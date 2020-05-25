import { Color } from 'three'

export default {
  // set texture(value) {
  //   this.uniforms.hasTexture.value = value ? 1 : 0
  //   this.uniforms.texture.value = value
  // },
  // get texture() {
  //   return this.uniforms.texture.value
  // },
  uniforms: {
    texture: { value: null },
    hasTexture: { value: 0 },
    // get hasTexture() {
    //   console.log('get hasTexture', !!this.texture)
    //   return { value: this.texture ? 1 : 0 }
    // },
    opacity: { value: 1 },
    color: { value: new Color('white') },
    textureDepth: { value: null },
    resolution: { type: '4f', value: null },
    mouse: { type: '2f', value: null },
    threshold: { type: '2f', value: null },
    time: { type: '1f', value: null },
    pixelRatio: { type: '1f', value: null },
  },

  vertexShader: `
    attribute vec2 a_position;
    
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4( a_position, 0, 1 );
    }`,

  fragmentShader: `
    #ifdef GL_ES
      precision mediump float;
    #endif

    uniform vec4 resolution;
    uniform vec2 mouse;
    uniform vec2 threshold;
    uniform float time;
    uniform float pixelRatio;

    uniform float hasTexture;
    uniform vec3 color;
    uniform float opacity;
    
    uniform sampler2D texture;
    uniform sampler2D textureDepth;


    vec2 mirrored(vec2 v) {
      vec2 m = mod(v,2.);
      return mix(m,2.0 - m, step(1.0 ,m));
    }

    void main() {
      // uvs and textures
      vec2 uv = pixelRatio*gl_FragCoord.xy / resolution.xy ;
      vec2 vUv = (uv - vec2(0.5))*resolution.zw + vec2(0.5);
      vUv.y = 1. - vUv.y;
      gl_FragColor = vec4(color, opacity);
      vec4 tex1 = texture2D(textureDepth,mirrored(vUv));
      vec2 fake3d = vec2(vUv.x + (tex1.r - 0.5)*mouse.x/threshold.x, vUv.y + (tex1.r - 0.5)*mouse.y/threshold.y);
      if (hasTexture == 1.0) gl_FragColor = texture2D(texture,mirrored(fake3d));
      else gl_FragColor = vec4(color, opacity);
    }`,
}
