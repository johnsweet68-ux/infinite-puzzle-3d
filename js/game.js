// Main Game Controller for The Infinite Puzzle
// Simplified version for faster loading

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true, { stencil: true, antialias: true });
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color3(0.01, 0.012, 0.015);
scene.collisionsEnabled = true;

console.log('[Game] Engine and scene created');

// Camera
const camera = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(0, 1.7, 4), scene);
camera.setTarget(new BABYLON.Vector3(0, 1.7, -2));
camera.minZ = 0.05;
camera.fov = 1.0;
camera.speed = 0.22;
camera.keysUp = [87, 38];
camera.keysDown = [83, 40];
camera.keysLeft = [65, 37];
camera.keysRight = [68, 39];
camera.checkCollisions = true;
camera.ellipsoid = new BABYLON.Vector3(0.5, 0.85, 0.5);

// Lighting
const hemi = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), scene);
hemi.intensity = 0.4;
hemi.diffuse = new BABYLON.Color3(0.9, 0.85, 0.8);

const pointLight = new BABYLON.PointLight('point', new BABYLON.Vector3(2, 2.8, 1), scene);
pointLight.intensity = 15;
pointLight.diffuse = new BABYLON.Color3(1, 0.95, 0.85);
pointLight.range = 12;

// Shadow generator
const shadowGenerator = new BABYLON.ShadowGenerator(1024, hemi);
shadowGenerator.usePercentageCloserFiltering = true;
shadowGenerator.darkness = 0.4;

console.log('[Game] Camera and lights created');

// Build the apartment
buildApartment(scene, shadowGenerator);
console.log('[Game] Apartment built');

// Create rift
const rift = new Rift(scene, new BABYLON.Vector3(0, 1.2, -4), Math.PI, () => {
  console.log('Entering the multiverse...');
});
shadowGenerator.addShadowCaster(rift.portal);

// Graphics pipeline
const graphics = new GraphicsPipeline(scene, camera);
graphics.setWorldSettings({ id: 'apartment', fog: { color: new BABYLON.Color3(0.02, 0.02, 0.03), density: 0.01 } });

console.log('[Game] Graphics setup complete');

// Player controller
const player = new PlayerController(scene, camera);

// Post-process setup
scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
scene.fogColor = new BABYLON.Color3(0.02, 0.02, 0.03);
scene.fogDensity = 0.01;

console.log('[Game] All setup complete, starting render loop');

// Hide loading, show HUD
document.getElementById('loading').classList.add('hidden');
document.getElementById('hud').classList.remove('hidden');

// Attach controls
camera.attachControl(canvas, true);
canvas.addEventListener('click', () => canvas.requestPointerLock());

// Time tracking
let time = 0;

// Render loop
engine.runRenderLoop(() => {
  const deltaTime = engine.getDeltaTime() / 1000;
  time += deltaTime;
  
  // Update player
  player.update();
  
  // Update rift
  const isNearRift = rift.update(deltaTime, player.getPosition());
  document.getElementById('interact-prompt').classList.toggle('hidden', !isNearRift);
  
  // Check for interaction
  if (isNearRift && player.keys.interact) {
    rift.trigger();
  }
  
  // Update graphics
  graphics.update(time);
  
  // Render
  scene.render();
});

// Handle resize
window.addEventListener('resize', () => engine.resize());

console.log('[Game] Game ready!');