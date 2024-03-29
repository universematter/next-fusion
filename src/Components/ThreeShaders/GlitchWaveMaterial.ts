import { Color, ShaderMaterial } from 'three'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ReactThreeFiber } from 'react-three-fiber'

const vertexShader = `
uniform float scale;
uniform float shift;
varying vec2 vUv;
void main() {
  vec3 pos = position;
  pos.y = pos.y + ((sin(uv.x * 3.1415926535897932384626433832795) * shift * 1.5) * 0.125);
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.);
}`

const fragmentShader = `
uniform sampler2D texture;
uniform float hasTexture;
uniform float shift;
uniform float scale;
uniform vec3 color;
uniform float opacity;
varying vec2 vUv;
void main() {
  float angle = 1.55;
  vec2 p = (vUv - vec2(0.5, 0.5)) * (1.0 - scale) + vec2(0.5, 0.5);
  vec2 offset = shift / 4.0 * vec2(cos(angle), sin(angle));
  vec4 cr = texture2D(texture, p + offset);
  vec4 cga = texture2D(texture, p);
  vec4 cb = texture2D(texture, p - offset);
  if (hasTexture == 1.0) gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
  else gl_FragColor = vec4(color, opacity);
}
`

const uniforms = {
  texture: { value: null },
  hasTexture: { value: 0 },
  scale: { value: 0 },
  shift: { value: 0 },
  opacity: { value: 1 },
  color: { value: new Color('white') },
}

export default class GlitchWaveMaterial extends ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      uniforms,
    })
  }

  // uniforms = new Proxy(this.uniforms, {
  //   get(target, prop, receiver) {
  //     if (prop === 'hasTexture') {
  //       console.log(target.texture, receiver.texture)
  //       return { value: !!target.texture.value }
  //     }
  //     if (prop === 'hasTextureDepth') {
  //       return { value: !!target.textureDepth.value }
  //     }
  //     return Reflect.get(target, prop, receiver)
  //   },
  // })

  set scale(value) {
    this.uniforms.scale.value = value
  }

  get scale() {
    return this.uniforms.scale.value
  }

  set shift(value) {
    this.uniforms.shift.value = value
  }

  get shift() {
    return this.uniforms.shift.value
  }

  set texture(value) {
    this.uniforms.hasTexture.value = !!value
    this.uniforms.texture.value = value
  }

  get texture() {
    return this.uniforms.texture.value
  }

  get color() {
    return this.uniforms.color.value
  }

  get opacity() {
    return this.uniforms.opacity.value
  }

  set opacity(value) {
    if (this.uniforms) this.uniforms.opacity.value = value
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      glitchWaveMaterial: ReactThreeFiber.MaterialNode<
        GlitchWaveMaterial,
        [THREE.ShaderMaterialParameters]
      >
    }
  }
}
