// Player Controller for The Infinite Puzzle
// First-person movement with collision detection

class PlayerController {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.moveSpeed = 0.15;
    this.sprintMultiplier = 1.8;
    this.lookSensitivity = 0.002;
    this.isLocked = false;
    
    this.setupControls();
  }
  
  setupControls() {
    const canvas = this.scene.getEngine().getRenderingCanvas();
    
    // Pointer lock
    canvas.addEventListener('click', () => {
      if (!this.isLocked) {
        canvas.requestPointerLock();
      }
    });
    
    document.addEventListener('pointerlockchange', () => {
      this.isLocked = document.pointerLockElement === canvas;
    });
    
    // Movement keys
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false,
      interact: false
    };
    
    document.addEventListener('keydown', (e) => {
      this.handleKey(e.code, true);
    });
    
    document.addEventListener('keyup', (e) => {
      this.handleKey(e.code, false);
    });
    
    // Mouse look
    document.addEventListener('mousemove', (e) => {
      if (this.isLocked) {
        this.camera.rotation.y += e.movementX * this.lookSensitivity;
        this.camera.rotation.x += e.movementY * this.lookSensitivity;
        
        // Clamp vertical look
        this.camera.rotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.camera.rotation.x));
      }
    });
  }
  
  handleKey(code, pressed) {
    switch (code) {
      case 'KeyW':
      case 'ArrowUp':
        this.keys.forward = pressed;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.keys.backward = pressed;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.keys.left = pressed;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.keys.right = pressed;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.keys.sprint = pressed;
        break;
      case 'KeyE':
        this.keys.interact = pressed;
        break;
    }
  }
  
  update() {
    if (!this.isLocked) return;
    
    const speed = this.moveSpeed * (this.keys.sprint ? this.sprintMultiplier : 1);
    
    // Get forward/right vectors
    const forward = this.camera.getDirection(BABYLON.Vector3.Forward());
    forward.y = 0;
    forward.normalize();
    
    const right = this.camera.getDirection(BABYLON.Vector3.Right());
    right.y = 0;
    right.normalize();
    
    // Movement
    let movement = BABYLON.Vector3.Zero();
    
    if (this.keys.forward) movement.addInPlace(forward.scale(speed));
    if (this.keys.backward) movement.addInPlace(forward.scale(-speed));
    if (this.keys.right) movement.addInPlace(right.scale(speed));
    if (this.keys.left) movement.addInPlace(right.scale(-speed));
    
    // Apply movement with collision
    if (movement.length() > 0) {
      const newPos = this.camera.position.add(movement);
      
      // Simple boundary check (keep player in bounds)
      newPos.x = Math.max(-8, Math.min(8, newPos.x));
      newPos.z = Math.max(-14, Math.min(10, newPos.z));
      newPos.y = 1.7; // Keep height constant
      
      // Raycast for collision
      if (!this.checkCollision(newPos)) {
        this.camera.position = newPos;
      }
    }
  }
  
  checkCollision(position) {
    // Simple collision check using raycasting
    const ray = new BABYLON.Ray(
      new BABYLON.Vector3(position.x, 1.5, position.z),
      new BABYLON.Vector3(0, -1, 0),
      0.5
    );
    
    const hit = this.scene.pickWithRay(ray, (mesh) => {
      return mesh.checkCollisions && mesh.name !== 'floor' && mesh.name !== 'ground' && mesh.name !== 'carpet';
    });
    
    return hit && hit.hit;
  }
  
  setPosition(position) {
    this.camera.position = position.clone();
  }
  
  getPosition() {
    return this.camera.position.clone();
  }
}
