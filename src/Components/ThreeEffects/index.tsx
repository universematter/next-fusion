import React, { MutableRefObject, useEffect, useMemo, useRef } from 'react'
import { ReactThreeFiber, extend, useFrame, useThree } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
// import { GlitchPass } from './postprocessing/Glitchpass'
import { WaterPass } from './postprocessing/Waterpass'
import { Color, Scene } from 'three'
import ThreeSparks from '../ThreeSparks'
import state from '@/Store'

extend({
  EffectComposer,
  ShaderPass,
  RenderPass,
  WaterPass,
  UnrealBloomPass,
  FilmPass,
})

export default function ParticlesScene() {
  const scene = useRef() as MutableRefObject<Scene>
  const { camera } = useThree()
  useFrame(({ gl }) => {
    gl.autoClear = false
    // gl.clearDepth()
    gl.clear()
    gl.render(scene.current, camera)
  }, 101)
  return (
    <scene ref={scene}>
      <fog attach="fog" args={[0xffffff, 50, 100]} />
      {/* <ambientLight /> */}
      <pointLight distance={200} intensity={4} color={new Color('white')} />
      {/* <mesh position={[-0.5, 0, 100]} scale={[200, 200, 1]}>
        <boxBufferGeometry attach="geometry" />
        <meshBasicMaterial attach="material" color="yellow" />
      </mesh> */}
      <ThreeSparks
        count={20}
        mouse={state.mouse}
        colors={[
          '#A2CCB6',
          '#FCEEB5',
          '#EE786E',
          '#e0feff',
          'lightpink',
          'lightblue',
        ]}
      />
    </scene>
  )
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      effectComposer: ReactThreeFiber.Node<
        EffectComposer,
        typeof EffectComposer
      >
      renderPass: ReactThreeFiber.Node<RenderPass, typeof RenderPass>
      waterPass: ReactThreeFiber.Node<WaterPass, typeof WaterPass>
      unrealBloomPass: ReactThreeFiber.Node<
        UnrealBloomPass,
        typeof UnrealBloomPass
      >
    }
  }
}
