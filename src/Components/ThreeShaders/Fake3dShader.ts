import { Color, Vector2 } from 'three'

export const uniforms = {
  texture: { value: null },
  textureDepth: { value: null },
  scale: { value: 0 },
  hasTexture: { value: 0 },
  // get hasTexture() {
  //   return {
  //     value: !!this.texture.value && !!this.textureDepth.value,
  //   }
  // },
  opacity: { value: 1 },
  color: { value: new Color('white') },
  mouse: { type: '2f', value: new Vector2() },
  threshold: { type: '2f', value: null },
}

export const vertexShader = /* glsl */ `
    #ifdef GL_ES
      precision mediump float;
    #endif
    uniform float scale;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`

export const fragmentShader = /* glsl */ `
    #ifdef GL_ES
      precision mediump float;
    #endif
    uniform vec2 mouse;
    uniform vec2 threshold;
    uniform sampler2D texture;
    uniform sampler2D textureDepth;
    uniform float hasTexture;
    uniform float scale;
    uniform vec3 color;
    uniform float opacity;

    vec2 mirrored(vec2 v) {
      vec2 m = mod(v, 2.0);
      return mix(m, 2.0 - m, step(1.0, m));
    }

    varying vec2 vUv;
    void main() {
      vec2 p = (vUv - vec2(0.5)) * (1.0 - scale) + vec2(0.5);
      // p.y = 1.0 - p.y;
      vec4 textureDepthMirrored = texture2D(textureDepth, mirrored(p));
      vec2 fake3d = vec2(p.x + (textureDepthMirrored.r - 0.5) * mouse.x / threshold.x,
                        p.y + (textureDepthMirrored.r - 0.5) * mouse.y / threshold.y);
      if (hasTexture == 1.0) gl_FragColor = texture2D(texture, mirrored(fake3d));
      else gl_FragColor = vec4(color, opacity);
    }`

// export default class Fake3dShaderMaterial extends ShaderMaterial {
//   constructor() {
//     super(shader)
//   }

//   set scale(value) {
//     this.uniforms.scale.value = value
//   }

//   get scale() {
//     return this.uniforms.scale.value
//   }

//   set shift(value) {
//     this.uniforms.shift.value = value
//   }

//   get shift() {
//     return this.uniforms.shift.value
//   }

//   set texture(value) {
//     this.uniforms.hasTexture.value = !!value
//     this.uniforms.texture.value = value
//   }

//   get texture() {
//     return this.uniforms.texture.value
//   }

//   get color() {
//     return this.uniforms.color.value
//   }

//   get opacity() {
//     return this.uniforms.opacity.value
//   }

//   set opacity(value) {
//     if (this.uniforms) this.uniforms.opacity.value = value
//   }
// }
