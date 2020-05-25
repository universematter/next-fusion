// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ReactThreeFiber, extend } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

extend({
  EffectComposer,
  ShaderPass,
  RenderPass,
  UnrealBloomPass,
  FilmPass,
  OrbitControls,
})

declare global {
  namespace JSX {
    interface IntrinsicElements {
      effectComposer: ReactThreeFiber.Node<
        EffectComposer,
        typeof EffectComposer
      >
      orbitControls: ReactThreeFiber.Node<OrbitControls, typeof OrbitControls>
      renderPass: ReactThreeFiber.Node<RenderPass, typeof RenderPass>
      shaderPass: ReactThreeFiber.Node<ShaderPass, typeof ShaderPass>
      unrealBloomPass: ReactThreeFiber.Node<
        UnrealBloomPass,
        typeof UnrealBloomPass
      >
    }
  }
}
