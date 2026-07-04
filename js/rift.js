// Rift System for The Infinite Puzzle
// Portal between real world and multiverse

class Rift {
  constructor(scene, position, rotation, onEnter) {
    this.scene = scene;
    this.position = position;
    this.rotation = rotation;
    this.onEnter = onEnter;
    this.isActive = true;
    this.proximityDistance = 2.5;
    
    this.create();
  }
  
  create() {
    // Main portal disc
    this.portal = BABYLON.MeshBuilder.CreateTorus('rift', {
      diameter: 2.2,
      thickness: 0.15,
      tessellation: 48
    }, this.scene);
    
    this.portal.position = this.position.clone();
    this.portal.rotation.x = Math.PI / 2;
    this.portal.rotation.z = this.rotation;
    
    // Portal surface
    this.surface = BABYLON.MeshBuilder.CreateDisc('riftSurface', {
      radius: 1,
      tessellation: 48
    }, this.scene);
    
    this.surface.position = new BABYLON.Vector3(
      this.position.x,
      this.position.y,
      this.position.z
    );
    this.surface.rotation.x = Math.PI / 2;
    this.surface.rotation.z = this.rotation;
    
    // Portal material
    this.portalMat = new BABYLON.PBRMaterial('riftMat', this.scene);
    this.portalMat.albedoColor = new BABYLON.Color3(0.02, 0.08, 0.06);
    this.portalMat.metallic = 0.3;
    this.portalMat.roughness = 0.2;
    this.portalMat.emissiveColor = new BABYLON.Color3(0.16, 0.92, 0.85);
    this.portalMat.emissiveIntensity = 2;
    this.portalMat.alpha = 0.85;
    this.surface.material = this.portalMat;
    
    // Ring material
    const ringMat = new BABYLON.PBRMaterial('ringMat', this.scene);
    ringMat.albedoColor = new BABYLON.Color3(0.1, 0.5, 0.45);
    ringMat.metallic = 0.8;
    ringMat.roughness = 0.3;
    ringMat.emissiveColor = new BABYLON.Color3(0.16, 0.92, 0.85).scale(0.5);
    this.portal.material = ringMat;
    
    // Particles
    this.createParticles();
    
    // Animation
    this.time = 0;
  }
  
  createParticles() {
    // Energy particles around portal
    const particleTexture = new BABYLON.DynamicTexture('riftParticleTex', 64, this.scene, false);
    const ctx = particleTexture.getContext();
    
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    particleTexture.update();
    particleTexture.hasAlpha = true;
    
    this.particles = new BABYLON.ParticleSystem('riftParticles', 200, this.scene);
    this.particles.particleTexture = particleTexture;
    
    // Emitter
    this.particles.emitter = this.position.clone();
    this.particles.minEmitBox = new BABYLON.Vector3(-0.8, -0.8, 0);
    this.particles.maxEmitBox = new BABYLON.Vector3(0.8, 0.8, 0);
    
    // Colors
    this.particles.color1 = new BABYLON.Color4(0.16, 0.92, 0.85, 1);
    this.particles.color2 = new BABYLON.Color4(0.4, 0.95, 0.9, 0.8);
    this.particles.colorDead = new BABYLON.Color4(0.1, 0.5, 0.45, 0);
    
    // Size
    this.particles.minSize = 0.03;
    this.particles.maxSize = 0.12;
    
    // Lifetime
    this.particles.minLifeTime = 1;
    this.particles.maxLifeTime = 3;
    
    // Emission
    this.particles.emitRate = 40;
    
    // Direction (spiral effect)
    this.particles.direction1 = new BABYLON.Vector3(-0.2, -0.2, -0.5);
    this.particles.direction2 = new BABYLON.Vector3(0.2, 0.2, -0.3);
    this.particles.minEmitPower = 0.2;
    this.particles.maxEmitPower = 0.5;
    
    // Gravity (slight pull into portal)
    this.particles.gravity = new BABYLON.Vector3(0, 0, -0.3);
    
    this.particles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    this.particles.start();
  }
  
  update(deltaTime, playerPosition) {
    this.time += deltaTime;
    
    // Pulse animation
    const pulse = Math.sin(this.time * 2) * 0.3 + 1;
    this.portalMat.emissiveIntensity = 1.5 + pulse * 0.5;
    this.portalMat.alpha = 0.75 + pulse * 0.1;
    
    // Rotate particles direction based on time
    const angle = this.time * 0.5;
    this.particles.direction1 = new BABYLON.Vector3(
      Math.cos(angle) * 0.2 - 0.1,
      Math.sin(angle) * 0.2,
      -0.4
    );
    
    // Check proximity to player
    const distance = BABYLON.Vector3.Distance(
      new BABYLON.Vector3(playerPosition.x, playerPosition.y, playerPosition.z),
      this.position
    );
    
    return distance < this.proximityDistance;
  }
  
  trigger() {
    if (this.onEnter) {
      this.onEnter();
    }
  }
  
  dispose() {
    if (this.particles) {
      this.particles.stop();
      this.particles.dispose();
    }
    if (this.portal) this.portal.dispose();
    if (this.surface) this.surface.dispose();
    if (this.portalMat) this.portalMat.dispose();
  }
}
