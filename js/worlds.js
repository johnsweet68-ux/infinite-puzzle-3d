// World definitions for The Infinite Puzzle
// Each world has environment setup, lighting, props, and rift locations

const WORLDS = {
  apartment: {
    id: 'apartment',
    name: 'Modern Apartment',
    description: 'A cozy urban flat with morning light',
    
    envTexture: null,
    envIntensity: 0.8,
    
    skybox: null,
    fog: { color: new BABYLON.Color3(0.02, 0.02, 0.03), density: 0.01 },
    clearColor: new BABYLON.Color3(0.01, 0.012, 0.015),
    
    ambient: { intensity: 0.3, diffuse: new BABYLON.Color3(0.9, 0.85, 0.8) },
    lights: [
      { type: 'point', position: new BABYLON.Vector3(2, 2.8, 1), intensity: 15, diffuse: new BABYLON.Color3(1, 0.95, 0.85), range: 12 }
    ],
    
    playerStart: new BABYLON.Vector3(0, 1.7, 4),
    playerTarget: new BABYLON.Vector3(0, 1.7, -2),
    
    build: buildApartment,
    
    riftPosition: new BABYLON.Vector3(0, 1.2, -4),
    riftRotation: Math.PI
  },
  
  subway: {
    id: 'subway',
    name: 'Subway Station',
    description: 'Underground transit with humming lights',
    
    envTexture: 'https://playground.babylonjs.com/textures/environment.env',
    envIntensity: 0.4,
    
    fog: { color: new BABYLON.Color3(0.01, 0.015, 0.02), density: 0.035 },
    clearColor: new BABYLON.Color3(0.008, 0.01, 0.015),
    
    ambient: { intensity: 0.15, diffuse: new BABYLON.Color3(0.6, 0.7, 0.8) },
    lights: [
      { type: 'point', position: new BABYLON.Vector3(-3, 3, 0), intensity: 20, diffuse: new BABYLON.Color3(0.7, 0.8, 1), range: 15 },
      { type: 'point', position: new BABYLON.Vector3(3, 3, -5), intensity: 20, diffuse: new BABYLON.Color3(0.7, 0.8, 1), range: 15 },
      { type: 'point', position: new BABYLON.Vector3(0, 3, -10), intensity: 25, diffuse: new BABYLON.Color3(1, 0.9, 0.7), range: 18 }
    ],
    
    playerStart: new BABYLON.Vector3(0, 1.7, 3),
    playerTarget: new BABYLON.Vector3(0, 1.7, -5),
    
    build: buildSubway,
    
    riftPosition: new BABYLON.Vector3(0, 1.5, -8),
    riftRotation: Math.PI
  },
  
  victorian: {
    id: 'victorian',
    name: 'Victorian Study',
    description: 'A study filled with antique furniture',
    
    envTexture: 'https://playground.babylonjs.com/textures/environment.env',
    envIntensity: 0.5,
    
    fog: { color: new BABYLON.Color3(0.03, 0.02, 0.015), density: 0.02 },
    clearColor: new BABYLON.Color3(0.02, 0.015, 0.01),
    
    ambient: { intensity: 0.2, diffuse: new BABYLON.Color3(0.9, 0.8, 0.6) },
    lights: [
      { type: 'point', position: new BABYLON.Vector3(-2, 2.5, 0), intensity: 12, diffuse: new BABYLON.Color3(1, 0.8, 0.5), range: 10 },
      { type: 'point', position: new BABYLON.Vector3(2, 2.5, -3), intensity: 8, diffuse: new BABYLON.Color3(1, 0.7, 0.4), range: 8 }
    ],
    
    playerStart: new BABYLON.Vector3(0, 1.7, 4),
    playerTarget: new BABYLON.Vector3(0, 1.7, -2),
    
    build: buildVictorian,
    
    riftPosition: new BABYLON.Vector3(0, 1.2, -5),
    riftRotation: Math.PI
  },
  
  forest: {
    id: 'forest',
    name: 'Forest Clearing',
    description: 'Ancient trees surround a moonlit clearing',
    
    envTexture: 'https://playground.babylonjs.com/textures/environment.env',
    envIntensity: 0.3,
    
    fog: { color: new BABYLON.Color3(0.01, 0.02, 0.015), density: 0.04 },
    clearColor: new BABYLON.Color3(0.008, 0.015, 0.01),
    
    ambient: { intensity: 0.15, diffuse: new BABYLON.Color3(0.5, 0.6, 0.7) },
    lights: [
      { type: 'point', position: new BABYLON.Vector3(0, 5, 0), intensity: 5, diffuse: new BABYLON.Color3(0.8, 0.85, 1), range: 25 },
      { type: 'point', position: new BABYLON.Vector3(3, 0.5, -3), intensity: 3, diffuse: new BABYLON.Color3(0.3, 0.5, 0.3), range: 6 }
    ],
    
    playerStart: new BABYLON.Vector3(0, 1.7, 5),
    playerTarget: new BABYLON.Vector3(0, 1.7, -3),
    
    build: buildForest,
    
    riftPosition: new BABYLON.Vector3(0, 1.5, -6),
    riftRotation: Math.PI
  }
};

// ============================================
// WORLD BUILDERS
// ============================================

function buildApartment(scene, shadowGenerator) {
  // Step 1 pipeline: HDRI image-based lighting (biggest realism lever)
  if (typeof setupApartmentEnvironment === 'function') setupApartmentEnvironment(scene);
  const hemiL = scene.getLightByName('hemi');
  if (hemiL) hemiL.intensity = 0.15;

  const WALL_COLOR = new BABYLON.Color3(0.85, 0.82, 0.78);
  const FLOOR_COLOR = new BABYLON.Color3(0.25, 0.22, 0.2);
  
  // Floor
  const floor = BABYLON.MeshBuilder.CreateGround('floor', { width: 12, height: 16 }, scene);
  const floorMat = pbrSurface(scene, 'floorMat', 'wood_floor_01', { uScale: 4, vScale: 5.3, roughness: 0.55 });
  floor.material = floorMat;
  floor.receiveShadows = true;
  floor.checkCollisions = true;
  
  // Ceiling
  const ceiling = BABYLON.MeshBuilder.CreateGround('ceiling', { width: 12, height: 16 }, scene);
  ceiling.position.y = 3.2;
  ceiling.rotation.x = Math.PI;
  const ceilMat = new BABYLON.PBRMaterial('ceilMat', scene);
  ceilMat.albedoColor = new BABYLON.Color3(0.9, 0.88, 0.85);
  ceilMat.metallic = 0;
  ceilMat.roughness = 0.95;
  ceiling.material = ceilMat;
  
  // Walls
  const plasterMat = pbrSurface(scene, 'plasterMat', 'plaster_01', { uScale: 6, vScale: 1.8, roughness: 0.9 });
  const wallB = createWall(scene, new BABYLON.Vector3(0, 1.6, -8), 12, 3.2, 0, WALL_COLOR, shadowGenerator);
  const wallL = createWall(scene, new BABYLON.Vector3(-6, 1.6, 0), 16, 3.2, Math.PI / 2, WALL_COLOR, shadowGenerator);
  const wallR = createWall(scene, new BABYLON.Vector3(6, 1.6, 0), 16, 3.2, -Math.PI / 2, WALL_COLOR, shadowGenerator);
  wallB.material = plasterMat; wallL.material = plasterMat; wallR.material = plasterMat;
  
  // Window
  const windowFrame = BABYLON.MeshBuilder.CreateBox('window', { width: 2.5, height: 2, depth: 0.1 }, scene);
  windowFrame.position = new BABYLON.Vector3(0, 1.8, -7.9);
  const windowMat = new BABYLON.PBRMaterial('windowMat', scene);
  windowMat.albedoColor = new BABYLON.Color3(0.9, 0.95, 1);
  windowMat.emissiveColor = new BABYLON.Color3(1, 0.98, 0.9).scale(0.8);
  windowMat.metallic = 0;
  windowMat.roughness = 0.1;
  windowFrame.material = windowMat;
  
  // GLB props from R2 (proof slice) — load-and-composite
  const P = (x, y, z) => new BABYLON.Vector3(x, y, z);
  loadAsset(scene, shadowGenerator, { key: 'hub/apartment/sofa_01', targetSize: { axis: 'width', meters: 2.1 }, position: P(-2.3, 0, -4.9), rotationY: Math.PI * 1.02 });
  loadAsset(scene, shadowGenerator, { key: 'hub/apartment/armchair_01', targetSize: { axis: 'width', meters: 0.8 }, position: P(1.6, 0, -3.9), rotationY: Math.PI * 0.45 });
  loadAsset(scene, shadowGenerator, { key: 'hub/apartment/coffee_table_01', targetSize: { axis: 'width', meters: 1.1 }, position: P(-1.7, 0, -2.9), rotationY: 0, collide: false });
  loadAsset(scene, shadowGenerator, { key: 'hub/apartment/bookshelf_01', targetSize: { axis: 'height', meters: 1.8 }, position: P(5.5, 0, -3.5), rotationY: -Math.PI / 2 });
  loadAsset(scene, shadowGenerator, { key: 'hub/apartment/plant_01', targetSize: { axis: 'height', meters: 1.6 }, position: P(-5.1, 0, -6.9), rotationY: 0, collide: false });

  // Rug (plane per asset pack — plain colour until a fabric surface set is ingested)
  const rug = BABYLON.MeshBuilder.CreateGround('rug', { width: 3.4, height: 2.6 }, scene);
  rug.position = new BABYLON.Vector3(-1.8, 0.01, -3.4);
  const rugMat = new BABYLON.PBRMaterial('rugMat', scene);
  rugMat.albedoColor = new BABYLON.Color3(0.45, 0.42, 0.38);
  rugMat.metallic = 0;
  rugMat.roughness = 0.95;
  rug.material = rugMat;
  rug.receiveShadows = true;
}

function buildSubway(scene, shadowGenerator) {
  const TILE_COLOR = new BABYLON.Color3(0.35, 0.38, 0.4);
  const CONCRETE_COLOR = new BABYLON.Color3(0.25, 0.27, 0.3);
  
  // Platform
  const platform = BABYLON.MeshBuilder.CreateBox('platform', { width: 8, height: 0.3, depth: 20 }, scene);
  platform.position = new BABYLON.Vector3(0, 0.15, -5);
  const platformMat = new BABYLON.PBRMaterial('platformMat', scene);
  platformMat.albedoColor = CONCRETE_COLOR;
  platformMat.metallic = 0.1;
  platformMat.roughness = 0.85;
  platform.material = platformMat;
  platform.receiveShadows = true;
  platform.checkCollisions = true;
  
  // Side walls
  createWall(scene, new BABYLON.Vector3(-4, 2, -5), 20, 4, Math.PI / 2, TILE_COLOR, shadowGenerator, true);
  createWall(scene, new BABYLON.Vector3(4, 2, -5), 20, 4, -Math.PI / 2, TILE_COLOR, shadowGenerator, true);
  createWall(scene, new BABYLON.Vector3(0, 2, -15), 8, 4, 0, TILE_COLOR, shadowGenerator, true);
  
  // Ceiling
  const ceiling = BABYLON.MeshBuilder.CreateBox('ceiling', { width: 8, height: 0.3, depth: 20 }, scene);
  ceiling.position = new BABYLON.Vector3(0, 4, -5);
  ceiling.material = platformMat;
  
  // Support pillars
  for (let z = -12; z <= 2; z += 7) {
    createPillar(scene, new BABYLON.Vector3(-3, 2, z), shadowGenerator);
    createPillar(scene, new BABYLON.Vector3(3, 2, z), shadowGenerator);
  }
  
  // Tracks
  const track = BABYLON.MeshBuilder.CreateBox('tracks', { width: 1.5, height: 0.1, depth: 20 }, scene);
  track.position = new BABYLON.Vector3(0, 0.05, -5);
  const trackMat = new BABYLON.PBRMaterial('trackMat', scene);
  trackMat.albedoColor = new BABYLON.Color3(0.15, 0.15, 0.15);
  trackMat.metallic = 0.8;
  trackMat.roughness = 0.4;
  track.material = trackMat;
  
  // Signs
  createSign(scene, 'SUBWAY', new BABYLON.Vector3(0, 3.5, -10), shadowGenerator);
  createSign(scene, 'EXIT', new BABYLON.Vector3(3.9, 2.5, -5), shadowGenerator);
  
  // Bench
  createBench(scene, new BABYLON.Vector3(-2, 0, 0), shadowGenerator);
}

function buildVictorian(scene, shadowGenerator) {
  const WALL_COLOR = new BABYLON.Color3(0.45, 0.35, 0.25);
  const WOOD_COLOR = new BABYLON.Color3(0.25, 0.18, 0.12);
  const CARPET_COLOR = new BABYLON.Color3(0.4, 0.15, 0.15);
  
  // Floor
  const floor = BABYLON.MeshBuilder.CreateGround('floor', { width: 10, height: 14 }, scene);
  const floorMat = new BABYLON.PBRMaterial('floorMat', scene);
  floorMat.albedoColor = WOOD_COLOR;
  floorMat.metallic = 0.05;
  floorMat.roughness = 0.65;
  floor.material = floorMat;
  floor.receiveShadows = true;
  floor.checkCollisions = true;
  
  // Carpet
  const carpet = BABYLON.MeshBuilder.CreateGround('carpet', { width: 6, height: 10 }, scene);
  carpet.position.y = 0.01;
  const carpetMat = new BABYLON.PBRMaterial('carpetMat', scene);
  carpetMat.albedoColor = CARPET_COLOR;
  carpetMat.metallic = 0;
  carpetMat.roughness = 0.95;
  carpet.material = carpetMat;
  carpet.receiveShadows = true;
  
  // Ceiling
  const ceiling = BABYLON.MeshBuilder.CreateGround('ceiling', { width: 10, height: 14 }, scene);
  ceiling.position.y = 3.5;
  ceiling.rotation.x = Math.PI;
  const ceilMat = new BABYLON.PBRMaterial('ceilMat', scene);
  ceilMat.albedoColor = new BABYLON.Color3(0.85, 0.8, 0.7);
  ceiling.material = ceilMat;
  
  // Walls
  createWall(scene, new BABYLON.Vector3(0, 1.75, -7), 10, 3.5, 0, WALL_COLOR, shadowGenerator);
  createWall(scene, new BABYLON.Vector3(-5, 1.75, 0), 14, 3.5, Math.PI / 2, WALL_COLOR, shadowGenerator);
  createWall(scene, new BABYLON.Vector3(5, 1.75, 0), 14, 3.5, -Math.PI / 2, WALL_COLOR, shadowGenerator);
  
  // Border
  const border = BABYLON.MeshBuilder.CreateBox('border', { width: 10, height: 0.15, depth: 0.05 }, scene);
  border.position = new BABYLON.Vector3(0, 2.8, -6.95);
  const borderMat = new BABYLON.PBRMaterial('borderMat', scene);
  borderMat.albedoColor = new BABYLON.Color3(0.7, 0.6, 0.2);
  borderMat.metallic = 0.2;
  borderMat.roughness = 0.5;
  border.material = borderMat;
  
  // Grandfather clock
  createGrandfatherClock(scene, new BABYLON.Vector3(-4, 0, -5), shadowGenerator);
  
  // Fireplace
  createFireplace(scene, new BABYLON.Vector3(0, 0, -6.5), shadowGenerator);
  
  // Bookshelf
  createBookshelf(scene, new BABYLON.Vector3(4, 0, -4), -Math.PI / 2, shadowGenerator);
  
  // Armchair
  createArmchair(scene, new BABYLON.Vector3(2, 0, -2), Math.PI * 0.8, shadowGenerator);
  
  // Desk
  createDesk(scene, new BABYLON.Vector3(3, 0, 1), Math.PI * 0.9, shadowGenerator);
}

function buildForest(scene, shadowGenerator) {
  const GRASS_COLOR = new BABYLON.Color3(0.15, 0.25, 0.1);
  
  // Ground
  const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 30, height: 30 }, scene);
  const groundMat = new BABYLON.PBRMaterial('groundMat', scene);
  groundMat.albedoColor = GRASS_COLOR;
  groundMat.metallic = 0;
  groundMat.roughness = 0.95;
  ground.material = groundMat;
  ground.receiveShadows = true;
  ground.checkCollisions = true;
  
  // Trees
  const treePositions = [
    { x: -6, z: -8 }, { x: 5, z: -10 }, { x: 8, z: -5 },
    { x: 10, z: 2 }, { x: 7, z: 8 }, { x: 0, z: 10 },
    { x: -8, z: 7 }, { x: -10, z: 0 }, { x: -9, z: -6 }
  ];
  
  treePositions.forEach(pos => {
    createTree(scene, new BABYLON.Vector3(pos.x, 0, pos.z), shadowGenerator);
  });
  
  // Rocks
  const rockPositions = [
    { x: 2, z: 4, scale: 0.4 },
    { x: -3, z: 3, scale: 0.3 },
    { x: 1, z: -4, scale: 0.25 }
  ];
  
  rockPositions.forEach(pos => {
    createRock(scene, new BABYLON.Vector3(pos.x, pos.scale * 0.3, pos.z), pos.scale, shadowGenerator);
  });
  
  // Moon
  const moon = BABYLON.MeshBuilder.CreateSphere('moon', { diameter: 1.5 }, scene);
  moon.position = new BABYLON.Vector3(8, 8, -12);
  const moonMat = new BABYLON.PBRMaterial('moonMat', scene);
  moonMat.emissiveColor = new BABYLON.Color3(0.95, 0.95, 0.9);
  moonMat.albedoColor = new BABYLON.Color3(0.9, 0.9, 0.85);
  moon.material = moonMat;
  
  // Distant mountains
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const dist = 18 + Math.random() * 5;
    const mountain = BABYLON.MeshBuilder.CreateCylinder('mountain' + i, {
      diameterTop: 0,
      diameterBottom: 6 + Math.random() * 4,
      height: 8 + Math.random() * 6,
      tessellation: 6
    }, scene);
    mountain.position = new BABYLON.Vector3(
      Math.cos(angle) * dist,
      (8 + Math.random() * 6) / 2 - 1,
      Math.sin(angle) * dist
    );
    const mountMat = new BABYLON.PBRMaterial('mountMat' + i, scene);
    mountMat.albedoColor = new BABYLON.Color3(0.08, 0.1, 0.08);
    mountMat.metallic = 0;
    mountMat.roughness = 1;
    mountain.material = mountMat;
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function createWall(scene, position, width, height, rotation, color, shadowGenerator, tiles = false) {
  const wall = BABYLON.MeshBuilder.CreateBox('wall', { width: width, height: height, depth: 0.15 }, scene);
  wall.position = position;
  wall.rotation.y = rotation;
  
  const wallMat = new BABYLON.PBRMaterial('wallMat' + Math.random(), scene);
  wallMat.albedoColor = color;
  wallMat.metallic = 0;
  wallMat.roughness = 0.85;
  wall.material = wallMat;
  wall.receiveShadows = true;
  wall.checkCollisions = true;
  if (shadowGenerator) shadowGenerator.addShadowCaster(wall);
  
  return wall;
}

function createSofa(scene, position, rotation, shadowGenerator) {
  const sofa = BABYLON.MeshBuilder.CreateBox('sofa', { width: 2.2, height: 0.8, depth: 0.9 }, scene);
  sofa.position = new BABYLON.Vector3(position.x, 0.4, position.z);
  sofa.rotation.y = rotation;
  
  const sofaMat = new BABYLON.PBRMaterial('sofaMat', scene);
  sofaMat.albedoColor = new BABYLON.Color3(0.25, 0.3, 0.35);
  sofaMat.metallic = 0;
  sofaMat.roughness = 0.9;
  sofa.material = sofaMat;
  sofa.receiveShadows = true;
  sofa.checkCollisions = true;
  if (shadowGenerator) shadowGenerator.addShadowCaster(sofa);
  
  const back = BABYLON.MeshBuilder.CreateBox('sofaBack', { width: 2.2, height: 0.6, depth: 0.15 }, scene);
  back.position = new BABYLON.Vector3(position.x, 0.85, position.z - 0.38);
  back.rotation.y = rotation;
  back.material = sofaMat;
  back.checkCollisions = true;
  if (shadowGenerator) shadowGenerator.addShadowCaster(back);
}

function createCoffeeTable(scene, position, shadowGenerator) {
  const table = BABYLON.MeshBuilder.CreateBox('table', { width: 1.2, height: 0.4, depth: 0.6 }, scene);
  table.position = new BABYLON.Vector3(position.x, 0.2, position.z);
  
  const tableMat = new BABYLON.PBRMaterial('tableMat', scene);
  tableMat.albedoColor = new BABYLON.Color3(0.15, 0.12, 0.1);
  tableMat.metallic = 0.1;
  tableMat.roughness = 0.5;
  table.material = tableMat;
  table.receiveShadows = true;
  table.checkCollisions = true;
  if (shadowGenerator) shadowGenerator.addShadowCaster(table);
}

function createBookshelf(scene, position, rotation, shadowGenerator) {
  const shelf = BABYLON.MeshBuilder.CreateBox('shelf', { width: 1.5, height: 2.2, depth: 0.35 }, scene);
  shelf.position = new BABYLON.Vector3(position.x, 1.1, position.z);
  shelf.rotation.y = rotation;
  
  const shelfMat = new BABYLON.PBRMaterial('shelfMat', scene);
  shelfMat.albedoColor = new BABYLON.Color3(0.35, 0.25, 0.18);
  shelfMat.metallic = 0;
  shelfMat.roughness = 0.7;
  shelf.material = shelfMat;
  shelf.receiveShadows = true;
  shelf.checkCollisions = true;
  if (shadowGenerator) shadowGenerator.addShadowCaster(shelf);
  
  for (let i = 0; i < 3; i++) {
    const book = BABYLON.MeshBuilder.CreateBox('book', { width: 0.25, height: 0.35, depth: 0.18 }, scene);
    book.position = new BABYLON.Vector3(position.x + (i - 1) * 0.3, 1.5, position.z);
    book.rotation.y = rotation;
    
    const bookMat = new BABYLON.PBRMaterial('bookMat' + i, scene);
    bookMat.albedoColor = new BABYLON.Color3(0.1 + Math.random() * 0.3, 0.1 + Math.random() * 0.2, 0.1 + Math.random() * 0.3);
    bookMat.metallic = 0;
    bookMat.roughness = 0.85;
    book.material = bookMat;
    if (shadowGenerator) shadowGenerator.addShadowCaster(book);
  }
}

function createFloorLamp(scene, position, shadowGenerator) {
  const pole = BABYLON.MeshBuilder.CreateCylinder('lampPole', { diameter: 0.05, height: 1.8 }, scene);
  pole.position = new BABYLON.Vector3(position.x, 0.9, position.z);
  
  const poleMat = new BABYLON.PBRMaterial('poleMat', scene);
  poleMat.albedoColor = new BABYLON.Color3(0.15, 0.15, 0.15);
  poleMat.metallic = 0.8;
  poleMat.roughness = 0.3;
  pole.material = poleMat;
  if (shadowGenerator) shadowGenerator.addShadowCaster(pole);
  
  const shade = BABYLON.MeshBuilder.CreateCylinder('lampShade', { diameterTop: 0.3, diameterBottom: 0.4, height: 0.35 }, scene);
  shade.position = new BABYLON.Vector3(position.x, 1.75, position.z);
  shade.material = poleMat;
}

function createPillar(scene, position, shadowGenerator) {
  const pillar = BABYLON.MeshBuilder.CreateCylinder('pillar', { diameter: 0.5, height: 4 }, scene);
  pillar.position = new BABYLON.Vector3(position.x, position.y, position.z);
  
  const pillarMat = new BABYLON.PBRMaterial('pillarMat', scene);
  pillarMat.albedoColor = new BABYLON.Color3(0.4, 0.42, 0.45);
  pillarMat.metallic = 0.1;
  pillarMat.roughness = 0.6;
  pillar.material = pillarMat;
  pillar.receiveShadows = true;
  pillar.checkCollisions = true;
  if (shadowGenerator) shadowGenerator.addShadowCaster(pillar);
}

function createSign(scene, text, position, shadowGenerator) {
  const sign = BABYLON.MeshBuilder.CreateBox('sign', { width: 1.5, height: 0.5, depth: 0.05 }, scene);
  sign.position = position;
  
  const signMat = new BABYLON.PBRMaterial('signMat', scene);
  signMat.albedoColor = new BABYLON.Color3(0.1, 0.1, 0.12);
  signMat.emissiveColor = new BABYLON.Color3(1, 0.9, 0.5).scale(0.3);
  sign.material = signMat;
  if (shadowGenerator) shadowGenerator.addShadowCaster(sign);
}

function createBench(scene, position, shadowGenerator) {
  const bench = BABYLON.MeshBuilder.CreateBox('bench', { width: 1.5, height: 0.5, depth: 0.5 }, scene);
  bench.position = new BABYLON.Vector3(position.x, 0.25, position.z);
  
  const benchMat = new BABYLON.PBRMaterial('benchMat', scene);
  benchMat.albedoColor = new BABYLON.Color3(0.25, 0.2, 0.18);
  benchMat.metallic = 0.2;
  benchMat.roughness = 0.7;
  bench.material = benchMat;
  bench.receiveShadows = true;
  bench.checkCollisions = true;
  if (shadowGenerator) shadowGenerator.addShadowCaster(bench);
}

function createGrandfatherClock(scene, position, shadowGenerator) {
  const clock = BABYLON.MeshBuilder.CreateBox('clock', { width: 0.6, height: 2, depth: 0.4 }, scene);
  clock.position = new BABYLON.Vector3(position.x, 1, position.z);
  
  const clockMat = new BABYLON.PBRMaterial('clockMat', scene);
  clockMat.albedoColor = new BABYLON.Color3(0.25, 0.18, 0.12);
  clockMat.metallic = 0;
  clockMat.roughness = 0.6;
  clock.material = clockMat;
  clock.checkCollisions = true;
  if (shadowGenerator) shadowGenerator.addShadowCaster(clock);
  
  const face = BABYLON.MeshBuilder.CreateCylinder('face', { diameter: 0.4, height: 0.02 }, scene);
  face.position = new BABYLON.Vector3(position.x - 0.31, 1.5, position.z);
  face.rotation.z = Math.PI / 2;
  const faceMat = new BABYLON.PBRMaterial('faceMat', scene);
  faceMat.albedoColor = new BABYLON.Color3(0.95, 0.95, 0.9);
  faceMat.metallic = 0;
  faceMat.roughness = 0.3;
  face.material = faceMat;
}

function createFireplace(scene, position, shadowGenerator) {
  const fireplace = BABYLON.MeshBuilder.CreateBox('fireplace', { width: 2, height: 1.2, depth: 0.5 }, scene);
  fireplace.position = new BABYLON.Vector3(position.x, 0.6, position.z);
  
  const fireMat = new BABYLON.PBRMaterial('fireMat', scene);
  fireMat.albedoColor = new BABYLON.Color3(0.5, 0.45, 0.4);
  fireMat.metallic = 0;
  fireMat.roughness = 0.8;
  fireplace.material = fireMat;
  fireplace.checkCollisions = true;
  if (shadowGenerator) shadowGenerator.addShadowCaster(fireplace);
  
  const glow = BABYLON.MeshBuilder.CreateBox('glow', { width: 1.5, height: 0.6, depth: 0.1 }, scene);
  glow.position = new BABYLON.Vector3(position.x, 0.5, position.z - 0.2);
  const glowMat = new BABYLON.PBRMaterial('glowMat', scene);
  glowMat.emissiveColor = new BABYLON.Color3(1, 0.4, 0.1).scale(0.5);
  glow.material = glowMat;
}

function createArmchair(scene, position, rotation, shadowGenerator) {
  const chair = BABYLON.MeshBuilder.CreateBox('chair', { width: 0.9, height: 0.9, depth: 0.8 }, scene);
  chair.position = new BABYLON.Vector3(position.x, 0.45, position.z);
  chair.rotation.y = rotation;
  
  const chairMat = new BABYLON.PBRMaterial('chairMat', scene);
  chairMat.albedoColor = new BABYLON.Color3(0.4, 0.15, 0.15);
  chairMat.metallic = 0;
  chairMat.roughness = 0.9;
  chair.material = chairMat;
  chair.checkCollisions = true;
  if (shadowGenerator) shadowGenerator.addShadowCaster(chair);
}

function createDesk(scene, position, rotation, shadowGenerator) {
  const desk = BABYLON.MeshBuilder.CreateBox('desk', { width: 1.4, height: 0.75, depth: 0.7 }, scene);
  desk.position = new BABYLON.Vector3(position.x, 0.375, position.z);
  desk.rotation.y = rotation;
  
  const deskMat = new BABYLON.PBRMaterial('deskMat', scene);
  deskMat.albedoColor = new BABYLON.Color3(0.3, 0.22, 0.15);
  deskMat.metallic = 0;
  deskMat.roughness = 0.6;
  desk.material = deskMat;
  desk.checkCollisions = true;
  if (shadowGenerator) shadowGenerator.addShadowCaster(desk);
}

function createTree(scene, position, shadowGenerator) {
  const trunk = BABYLON.MeshBuilder.CreateCylinder('trunk', { diameter: 0.5, height: 4 }, scene);
  trunk.position = new BABYLON.Vector3(position.x, 2, position.z);
  
  const trunkMat = new BABYLON.PBRMaterial('trunkMat', scene);
  trunkMat.albedoColor = new BABYLON.Color3(0.25, 0.18, 0.12);
  trunkMat.metallic = 0;
  trunkMat.roughness = 0.9;
  trunk.material = trunkMat;
  if (shadowGenerator) shadowGenerator.addShadowCaster(trunk);
  
  const foliage = BABYLON.MeshBuilder.CreateSphere('foliage', { diameter: 3 }, scene);
  foliage.position = new BABYLON.Vector3(position.x, 4.5, position.z);
  foliage.scaling = new BABYLON.Vector3(1, 1.3, 1);
  
  const foliageMat = new BABYLON.PBRMaterial('foliageMat', scene);
  foliageMat.albedoColor = new BABYLON.Color3(0.1, 0.25, 0.1);
  foliageMat.metallic = 0;
  foliageMat.roughness = 0.9;
  foliage.material = foliageMat;
  if (shadowGenerator) shadowGenerator.addShadowCaster(foliage);
}

function createRock(scene, position, scale, shadowGenerator) {
  const rock = BABYLON.MeshBuilder.CreatePolyhedron('rock', { type: 1, size: scale }, scene);
  rock.position = position;
  rock.rotation = new BABYLON.Vector3(Math.random(), Math.random(), Math.random());
  
  const rockMat = new BABYLON.PBRMaterial('rockMat', scene);
  rockMat.albedoColor = new BABYLON.Color3(0.25, 0.25, 0.25);
  rockMat.metallic = 0;
  rockMat.roughness = 0.95;
  rock.material = rockMat;
  rock.receiveShadows = true;
  if (shadowGenerator) shadowGenerator.addShadowCaster(rock);
}
