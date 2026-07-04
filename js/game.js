// Main Game Controller for The Infinite Puzzle

class Game {
  constructor() {
    this.canvas = document.getElementById('renderCanvas');
    this.engine = null;
    this.scene = null;
    this.camera = null;
    this.player = null;
    this.rift = null;
    this.graphics = null;
    this.currentWorld = null;
    this.shadowGenerator = null;
    this.envTexture = null;
    
    this.isRunning = false;
    this.time = 0;
    
    this.init();
  }
  
  init() {
    console.log('[Game] Initializing...');
    
    // Create engine
    this.engine = new BABYLON.Engine(this.canvas, true, {
      stencil: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    console.log('[Game] Engine created');
    
    // Create scene
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color3(0.01, 0.012, 0.015);
    console.log('[Game] Scene created');
    
    // Enable collisions
    this.scene.collisionsEnabled = true;
    
    // Setup camera
    this.setupCamera();
    
    // Setup lighting
    this.setupLighting();
    
    // Start loading the world directly
    this.startGame();
    
    // Start render loop
    this.engine.runRenderLoop(() => {
      if (this.isRunning) {
        this.update();
      }
      this.scene.render();
    });
    
    // Handle resize
    window.addEventListener('resize', () => {
      this.engine.resize();
    });
    
    console.log('[Game] Init complete');
  }
  
  setupCamera() {
    this.camera = new BABYLON.UniversalCamera(
      'camera',
      new BABYLON.Vector3(0, 1.7, 5),
      this.scene
    );
    
    this.camera.minZ = 0.05;
    this.camera.fov = 1.0;
    this.camera.angularSensibility = 2500;
    this.camera.speed = 0.22;
    this.camera.inertia = 0.7;
    
    // Key bindings
    this.camera.keysUp = [87, 38];    // W, Up
    this.camera.keysDown = [83, 40];  // S, Down
    this.camera.keysLeft = [65, 37];   // A, Left
    this.camera.keysRight = [68, 39]; // D, Right
    
    this.camera.checkCollisions = true;
    this.camera.applyGravity = false;
    this.camera.ellipsoid = new BABYLON.Vector3(0.5, 0.85, 0.5);
    
    console.log('[Game] Camera setup complete');
  }
  
  setupLighting() {
    // Hemisphere light for ambient
    const hemi = new BABYLON.HemisphericLight(
      'hemi',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    hemi.intensity = 0.3;
    hemi.diffuse = new BABYLON.Color3(0.9, 0.85, 0.8);
    
    // Shadow generator
    this.shadowGenerator = new BABYLON.ShadowGenerator(1024, hemi);
    this.shadowGenerator.usePercentageCloserFiltering = true;
    this.shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_HIGH;
    this.shadowGenerator.darkness = 0.4;
    this.shadowGenerator.bias = 0.001;
    
    console.log('[Game] Lighting setup complete');
  }
  
  startGame() {
    console.log('[Game] Starting game...');
    
    const loadingScreen = document.getElementById('loading');
    const hud = document.getElementById('hud');
    const worldTitle = document.getElementById('world-title');
    
    // For now, just use one location (will be random later)
    const worldId = 'apartment';
    const world = WORLDS[worldId];
    
    console.log('[Game] Loading world:', worldId);
    
    if (world) {
      // Use setTimeout to ensure UI updates
      setTimeout(() => {
        this.loadWorld(world, () => {
          console.log('[Game] World loaded successfully');
          // Hide loading, show game
          loadingScreen.classList.add('hidden');
          hud.classList.remove('hidden');
          worldTitle.textContent = world.name;
          
          // Attach camera controls
          this.camera.attachControl(this.canvas, true);
          
          // Lock pointer on click
          this.canvas.addEventListener('click', () => {
            this.canvas.requestPointerLock();
          });
          
          // Start game loop
          this.isRunning = true;
          console.log('[Game] Game running');
        });
      }, 100);
    } else {
      console.error('[Game] World not found:', worldId);
    }
  }
  
  loadWorld(world, callback) {
    console.log('[Game] loadWorld called');
    this.setProgress(10);
    
    try {
      this.currentWorld = world;
      
      // Set environment
      console.log('[Game] Setting environment...');
      this.setEnvironment(world);
      this.setProgress(30);
      
      // Build world geometry
      console.log('[Game] Building world...');
      if (world.build) {
        world.build(this.scene, this.shadowGenerator);
      }
      this.setProgress(60);
      
      // Setup player
      console.log('[Game] Setting up player...');
      this.camera.position = world.playerStart.clone();
      this.camera.setTarget(world.playerTarget);
      this.camera.rotation = new BABYLON.Vector3(0, Math.PI, 0);
      
      this.player = new PlayerController(this.scene, this.camera);
      
      // Setup graphics pipeline
      console.log('[Game] Setting up graphics...');
      this.graphics = new GraphicsPipeline(this.scene, this.camera);
      this.graphics.setWorldSettings(world);
      
      // Create rift
      console.log('[Game] Creating rift...');
      this.createRift(world);
      this.setProgress(90);
      
      // Final setup
      console.log('[Game] Finalizing...');
      setTimeout(() => {
        this.setProgress(100);
        if (callback) callback();
      }, 500);
      
    } catch (e) {
      console.error('[Game] Error loading world:', e);
      // Still try to show the game even if there's an error
      setTimeout(() => {
        this.setProgress(100);
        if (callback) callback();
      }, 1000);
    }
  }
  
  setEnvironment(world) {
    console.log('[Game] Loading environment texture:', world.envTexture);
    
    // Environment texture (IBL)
    if (world.envTexture) {
      try {
        if (this.envTexture) {
          this.envTexture.dispose();
        }
        
        this.envTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
          world.envTexture,
          this.scene
        );
        this.scene.environmentTexture = this.envTexture;
        this.scene.environmentIntensity = world.envIntensity || 0.8;
        console.log('[Game] Environment texture loaded');
      } catch (e) {
        console.warn('[Game] Environment texture failed, using fallback:', e);
        // Continue without environment texture
      }
    }
    
    // Fog
    if (world.fog) {
      this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
      this.scene.fogColor = world.fog.color;
      this.scene.fogDensity = world.fog.density;
    } else {
      this.scene.fogMode = BABYLON.Scene.FOGMODE_NONE;
    }
    
    // Clear color
    if (world.clearColor) {
      this.scene.clearColor = world.clearColor;
    }
    
    // Setup lights
    this.setupWorldLights(world);
  }
  
  setupWorldLights(world) {
    // Clear existing lights except hemi
    const lights = this.scene.lights.filter(l => l.name !== 'hemi');
    lights.forEach(l => l.dispose());
    
    // Ambient
    const hemi = this.scene.getLightByName('hemi');
    if (hemi && world.ambient) {
      hemi.intensity = world.ambient.intensity;
      hemi.diffuse = world.ambient.diffuse;
    }
    
    // Additional lights
    if (world.lights) {
      world.lights.forEach((lightDef, i) => {
        if (lightDef.type === 'point') {
          const light = new BABYLON.PointLight(
            `worldLight${i}`,
            lightDef.position,
            this.scene
          );
          light.intensity = lightDef.intensity;
          light.diffuse = lightDef.diffuse;
          light.range = lightDef.range || 20;
        }
      });
    }
  }
  
  createRift(world) {
    if (this.rift) {
      this.rift.dispose();
    }
    
    this.rift = new Rift(
      this.scene,
      world.riftPosition,
      world.riftRotation || 0,
      () => this.onRiftEnter()
    );
    
    // Update shadow generator to include rift
    if (this.rift.portal) {
      this.shadowGenerator.addShadowCaster(this.rift.portal);
    }
  }
  
  onRiftEnter() {
    console.log('Entering the multiverse...');
  }
  
  update() {
    const deltaTime = this.engine.getDeltaTime() / 1000;
    this.time += deltaTime;
    
    // Update player
    if (this.player) {
      this.player.update();
    }
    
    // Update rift
    if (this.rift && this.player) {
      const isNearRift = this.rift.update(deltaTime, this.player.getPosition());
      this.showInteractPrompt(isNearRift);
      
      // Check for interaction
      if (isNearRift && this.player.keys.interact) {
        this.rift.trigger();
      }
    }
    
    // Update graphics
    if (this.graphics) {
      this.graphics.update(this.time);
    }
  }
  
  showInteractPrompt(show) {
    const prompt = document.getElementById('interact-prompt');
    if (show) {
      prompt.classList.remove('hidden');
    } else {
      prompt.classList.add('hidden');
    }
  }
  
  setProgress(percent) {
    const fill = document.getElementById('fill');
    if (fill) {
      fill.style.width = percent + '%';
    }
  }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Game] DOM loaded, starting...');
  window.game = new Game();
});

// Also try window load as fallback
window.addEventListener('load', () => {
  console.log('[Game] Window loaded');
});