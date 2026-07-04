// Graphics Pipeline for The Infinite Puzzle
// Post-processing, SSAO, bloom, color grading

class GraphicsPipeline {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.pipeline = null;
    this.glowLayer = null;
    this.ssao = null;
    
    this.setup();
  }
  
  setup() {
    // Glow layer for emissive elements
    this.glowLayer = new BABYLON.GlowLayer('glow', this.scene, {
      blurKernelSize: 64,
      mainTextureFixedSize: 512
    });
    this.glowLayer.intensity = 0.8;
    
    // Default rendering pipeline with effects
    this.pipeline = new BABYLON.DefaultRenderingPipeline(
      'defaultPipeline',
      true,
      this.scene,
      [this.camera]
    );
    
    // FXAA
    this.pipeline.fxaaEnabled = true;
    
    // Bloom
    this.pipeline.bloomEnabled = true;
    this.pipeline.bloomThreshold = 0.5;
    this.pipeline.bloomWeight = 0.6;
    this.pipeline.bloomKernel = 64;
    this.pipeline.bloomScale = 0.5;
    
    // Tone mapping (ACES for cinematic look)
    this.pipeline.imageProcessing.toneMappingEnabled = true;
    this.pipeline.imageProcessing.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
    this.pipeline.imageProcessing.exposure = 1.1;
    this.pipeline.imageProcessing.contrast = 1.25;
    
    // Vignette
    this.pipeline.imageProcessing.vignetteEnabled = true;
    this.pipeline.imageProcessing.vignetteWeight = 2.5;
    this.pipeline.imageProcessing.vignetteColor = new BABYLON.Color4(0, 0, 0, 1);
    this.pipeline.imageProcessing.vignetteStretch = 0.5;
    
    // Chromatic aberration
    this.pipeline.chromaticAberrationEnabled = true;
    this.pipeline.chromaticAberration.aberrationAmount = 15;
    this.pipeline.chromaticAberration.radialIntensity = 0.8;
    
    // Film grain
    this.pipeline.grainEnabled = true;
    this.pipeline.grain.intensity = 6;
    this.pipeline.grain.animated = true;
    
    // Color curves for cinematic look
    this.pipeline.imageProcessing.colorCurvesEnabled = true;
    const curves = new BABYLON.ColorCurves();
    
    // Cool shadows, warm highlights
    curves.shadowsHue = 190;
    curves.shadowsDensity = 30;
    curves.shadowsSaturation = 20;
    curves.highlightsHue = 40;
    curves.highlightsDensity = 20;
    curves.highlightsSaturation = 10;
    curves.globalHue = 0;
    curves.globalDensity = 10;
    curves.globalSaturation = 5;
    
    this.pipeline.imageProcessing.colorCurves = curves;
    
    // Try to add SSAO
    this.setupSSAO();
  }
  
  setupSSAO() {
    try {
      if (BABYLON.SSAO2RenderingPipeline.IsSupported) {
        this.ssao = new BABYLON.SSAO2RenderingPipeline(
          'ssao',
          this.scene,
          {
            ssaoRatio: 0.5,
            blurRatio: 1
          },
          [this.camera]
        );
        
        this.ssao.radius = 1.5;
        this.ssao.totalStrength = 1.2;
        this.ssao.expensiveBlur = true;
        this.ssao.samples = 16;
        this.ssao.maxZ = 100;
        this.ssao.minZAspect = 0.5;
      }
    } catch (e) {
      console.log('SSAO not available:', e.message);
    }
  }
  
  setWorldSettings(world) {
    if (!world) return;
    
    // Adjust exposure based on world
    if (world.id === 'subway') {
      this.pipeline.imageProcessing.exposure = 0.9;
    } else if (world.id === 'forest') {
      this.pipeline.imageProcessing.exposure = 0.85;
    } else if (world.id === 'apartment') {
      this.pipeline.imageProcessing.exposure = 1.15;
    } else {
      this.pipeline.imageProcessing.exposure = 1.1;
    }
    
    // Adjust bloom for dark worlds
    if (world.id === 'subway' || world.id === 'victorian') {
      this.pipeline.bloomWeight = 0.7;
      this.glowLayer.intensity = 1;
    } else {
      this.pipeline.bloomWeight = 0.5;
      this.glowLayer.intensity = 0.7;
    }
    
    // Color grading per world
    this.setColorGrading(world.id);
  }
  
  setColorGrading(worldId) {
    const curves = new BABYLON.ColorCurves();
    
    switch (worldId) {
      case 'apartment':
        // Warm, cozy
        curves.shadowsHue = 20;
        curves.shadowsDensity = 20;
        curves.highlightsHue = 40;
        curves.highlightsDensity = 10;
        break;
        
      case 'subway':
        // Cool, blue
        curves.shadowsHue = 210;
        curves.shadowsDensity = 40;
        curves.highlightsHue = 180;
        curves.highlightsDensity = 20;
        break;
        
      case 'victorian':
        // Amber, warm sepia
        curves.shadowsHue = 30;
        curves.shadowsDensity = 35;
        curves.highlightsHue = 45;
        curves.highlightsDensity = 25;
        break;
        
      case 'forest':
        // Green, natural
        curves.shadowsHue = 150;
        curves.shadowsDensity = 30;
        curves.highlightsHue = 50;
        curves.highlightsDensity = 15;
        break;
        
      default:
        curves.shadowsHue = 190;
        curves.shadowsDensity = 30;
        curves.highlightsHue = 35;
        curves.highlightsDensity = 20;
    }
    
    this.pipeline.imageProcessing.colorCurves = curves;
  }
  
  update(time) {
    // Subtle animated effects
    if (this.pipeline.chromaticAberrationEnabled) {
      const aberration = 12 + Math.sin(time * 0.5) * 3;
      this.pipeline.chromaticAberration.aberrationAmount = aberration;
    }
  }
  
  dispose() {
    if (this.ssao) this.ssao.dispose();
    if (this.glowLayer) this.glowLayer.dispose();
    if (this.pipeline) this.pipeline.dispose();
  }
}
