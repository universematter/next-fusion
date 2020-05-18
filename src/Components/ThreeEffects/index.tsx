import { MutableRefObject, useEffect, useMemo, useRef } from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ReactThreeFiber, extend, useFrame, useThree } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { WaterPass } from './postprocessing/Waterpass'
import { WebGLRenderTarget } from 'three'
import AdditiveBlendingShader from '../ThreeShaders/GlitchWaveMaterial/AdditiveBlendingShader'
import VolumetricLightShader from '../ThreeShaders/VolumetricLightShader'
import { state } from '@Store'

extend({
  EffectComposer,
  ShaderPass,
  RenderPass,
  WaterPass,
  UnrealBloomPass,
  FilmPass,
  OrbitControls,
})

export default function Effects() {
  const { gl, scene, camera, size } = useThree()
  const occlusionRenderTarget = useMemo(
    () => new WebGLRenderTarget(size.width, size.height),
    [size],
  )
  const occlusionComposer = useRef() as MutableRefObject<EffectComposer>
  const composer = useRef() as MutableRefObject<EffectComposer>

  useEffect(() => {
    occlusionComposer.current.setSize(size.width, size.height)
    composer.current.setSize(size.width, size.height)
  }, [size])

  // const aspect = useMemo(() => new Vector2(size.width, size.height), [size])

  useFrame(({ gl }) => {
    gl.autoClear = true
    // gl.clear()
    camera.layers.set(state.layers.OCCLUSION_LAYER)
    occlusionComposer.current.render()
    // gl.clearDepth()
    camera.layers.set(state.layers.DEFAULT_LAYER)
    composer.current.render()
  }, 1)

  return (
    <>
      {/* <mesh layers={state.layers.OCCLUSION_LAYER} position={[0, 4.5, -10]}>
        <sphereBufferGeometry attach="geometry" args={[5, 32, 32]} />
        <meshBasicMaterial attach="material" />
      </mesh> */}
      <effectComposer
        ref={occlusionComposer}
        args={[gl, occlusionRenderTarget]}
        renderToScreen={false}
      >
        <renderPass attachArray="passes" args={[scene, camera]} />
        {/* <unrealBloomPass attachArray="passes" args={[aspect, 2, 1, 0]} /> */}
        <shaderPass
          attachArray="passes"
          args={[VolumetricLightShader]}
          needsSwap={false}
        />
      </effectComposer>
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray="passes" args={[scene, camera]} />

        <waterPass attachArray="passes" factor={0.025} />
        <shaderPass
          attachArray="passes"
          args={[AdditiveBlendingShader]}
          uniforms-tAdd-value={occlusionRenderTarget.texture}
        />
        <shaderPass
          attachArray="passes"
          args={[FXAAShader]}
          uniforms-resolution-value={[1 / size.width, 1 / size.height]}
          renderToScreen
        />
      </effectComposer>
    </>
  )
}

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
      waterPass: ReactThreeFiber.Node<WaterPass, typeof WaterPass>
      unrealBloomPass: ReactThreeFiber.Node<
        UnrealBloomPass,
        typeof UnrealBloomPass
      >
    }
  }
}
