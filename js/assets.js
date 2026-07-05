// Asset helpers for The Infinite Puzzle — Step 1 pipeline.
// Loads optimised GLB props, PBR surfaces and HDRI lighting from Cloudflare R2.
// Dev host: r2.dev public URL (rate-limited; swap for a custom domain in production).

const ASSETS_BASE = 'https://pub-46388c66e0644085b894123976534759.r2.dev';

function assetsWithTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(label + ' timed out after ' + ms + 'ms')), ms))
  ]);
}

// Load a GLB from R2: auto-scale to the manifest target size, drop to floor,
// register shadows and collisions. Falls back to a plain box on failure.
async function loadAsset(scene, shadowGenerator, opts) {
  const { key, targetSize, position, rotationY = 0, collide = true } = opts;
  const url = ASSETS_BASE + '/' + key + '.glb';
  try {
    const result = await assetsWithTimeout(
      BABYLON.SceneLoader.ImportMeshAsync(null, url, '', scene, null, '.glb'),
      30000, 'load ' + key);
    const root = result.meshes[0];
    const measurable = result.meshes.filter(m => m.getTotalVertices && m.getTotalVertices() > 0);

    const bounds = () => {
      let min = null, max = null;
      for (const m of measurable) {
        m.computeWorldMatrix(true);
        const bb = m.getBoundingInfo().boundingBox;
        if (!min) { min = bb.minimumWorld.clone(); max = bb.maximumWorld.clone(); }
        else {
          min = BABYLON.Vector3.Minimize(min, bb.minimumWorld);
          max = BABYLON.Vector3.Maximize(max, bb.maximumWorld);
        }
      }
      return { min, max, size: max.subtract(min) };
    };

    // 1. scale so the asset matches its real-world target size
    let b = bounds();
    const axis = (targetSize && targetSize.axis) || 'height';
    const current = axis === 'width' ? b.size.x : (axis === 'depth' ? b.size.z : b.size.y);
    if (targetSize && current > 0.0001) {
      const f = targetSize.meters / current;
      root.scaling = root.scaling.scale(f);
    }

    // 2. position, rotation, drop to floor
    root.rotationQuaternion = null;
    root.rotation.y = rotationY;
    root.position = position.clone();
    b = bounds();
    root.position.y += position.y - b.min.y;
    // recentre horizontally so the visual centre sits on the requested spot
    const cx = (b.min.x + b.max.x) / 2, cz = (b.min.z + b.max.z) / 2;
    root.position.x += position.x - cx;
    root.position.z += position.z - cz;

    // 3. shadows + collisions
    for (const m of measurable) {
      m.receiveShadows = true;
      if (shadowGenerator) shadowGenerator.addShadowCaster(m);
      if (collide) m.checkCollisions = true;
    }
    console.log('[Assets] loaded ' + key);
    return root;
  } catch (err) {
    console.warn('[Assets] FAILED ' + key + ': ' + err.message + ' — using fallback box');
    const size = (targetSize && targetSize.meters) ? Math.min(targetSize.meters, 1) : 0.5;
    const box = BABYLON.MeshBuilder.CreateBox('fallback_' + key.replace(/\W/g, '_'), { size }, scene);
    box.position = new BABYLON.Vector3(position.x, position.y + size / 2, position.z);
    if (collide) box.checkCollisions = true;
    return box;
  }
}

// PBR surface material from an R2-hosted ambientCG set (colour + normal maps).
function pbrSurface(scene, name, prefix, options) {
  const o = options || {};
  const mat = new BABYLON.PBRMaterial(name, scene);
  const albedo = new BABYLON.Texture(ASSETS_BASE + '/surfaces/' + prefix + '_color.jpg', scene);
  const bump = new BABYLON.Texture(ASSETS_BASE + '/surfaces/' + prefix + '_normal.jpg', scene);
  albedo.uScale = o.uScale || 1; albedo.vScale = o.vScale || 1;
  bump.uScale = o.uScale || 1; bump.vScale = o.vScale || 1;
  mat.albedoTexture = albedo;
  mat.bumpTexture = bump;
  mat.invertNormalMapX = true; // ambientCG ships OpenGL-style normals
  mat.invertNormalMapY = true;
  mat.metallic = 0;
  mat.roughness = o.roughness !== undefined ? o.roughness : 0.9;
  return mat;
}

// Interior HDRI image-based lighting from R2 (the biggest realism lever).
function setupApartmentEnvironment(scene) {
  try {
    const hdr = new BABYLON.HDRCubeTexture(
      ASSETS_BASE + '/lighting/interior_day_01.hdr', scene, 128, false, true, false, true);
    scene.environmentTexture = hdr;
    scene.environmentIntensity = 0.9;
    console.log('[Assets] HDRI environment set');
  } catch (err) {
    console.warn('[Assets] HDRI failed: ' + err.message);
  }
}
