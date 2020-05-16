import { MutableRefObject, useEffect, useRef } from 'react'
import lerp from 'lerp'
import { Canvas, useFrame, useThree } from 'react-three-fiber'

import state from '@Store'
import { ScrollArea } from '@Styled/Layout'
import {
  Color,
  Material,
  Mesh,
  PerspectiveCamera,
  Scene,
  Uncharted2ToneMapping,
} from 'three'
import { ThreePages } from '../ThreePages'
import ParticlesScene from '../ThreeEffects'

function ThreeCanvas() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const onMouseMove = ({ clientX: x, clientY: y }) => {
    state.mouse.current = [
      x - window.innerWidth / 2,
      y - window.innerHeight / 2,
    ]
    console.log(state.mouse.current)
  }
  const scrollArea = useRef<HTMLDivElement>(null)
  const onScroll = (e: React.UIEvent<HTMLElement>) => {
    state.top.current = e.currentTarget.scrollTop
    console.log(state.top.current)
  }
  useEffect(() => {
    onScroll({ currentTarget: scrollArea.current } as any)
    onMouseMove({ clientX: 0, clientY: 0 })
  }, [])

  return (
    <>
      <Canvas
        pixelRatio={Math.min(2, isMobile ? window.devicePixelRatio : 1)}
        className="canvas"
        camera={{
          zoom: state.zoom,
          position: [0, 0, 500],
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = Uncharted2ToneMapping
          gl.setClearColor(new Color('#020207'))
        }}
      >
        <ThreeApp />
      </Canvas>
      <ScrollArea
        ref={scrollArea}
        onScroll={onScroll}
        onMouseMove={onMouseMove}
      >
        <div style={{ height: `${state.pages * 100}vh` }} />
      </ScrollArea>
    </>
  )
}

function ThreeApp() {
  // const camera = useRef() as MutableRefObject<PerspectiveCamera>
  const { camera, size } = useThree()
  // useEffect(() => void setDefaultCamera(camera.current), [])
  useFrame(() => camera.updateMatrixWorld())
  return (
    <>
      {/* <orthographicCamera
        ref={camera}
        zoom={state.zoom}
        position={[0, 0, 500]}
        onUpdate={(self) => self.updateProjectionMatrix()}
      /> */}
      {/* <perspectiveCamera
        ref={camera}
        aspect={size.width / size.height}
        radius={(size.width + size.height) / 4}
        onUpdate={(self) => self.updateProjectionMatrix()}
      /> */}

      <ParticlesScene />
      <MainScene />
    </>
  )
}

function MainScene() {
  const scene = useRef() as MutableRefObject<Scene>
  const { camera } = useThree()
  useFrame(({ gl }) => {
    gl.autoClear = false
    // gl.clear()
    gl.clearDepth()
    gl.render(scene.current, camera)
  }, 100)
  return (
    <scene ref={scene}>
      <>
        {/* <Suspense
          fallback={
            <HTML center style={{ position: 'relative' }}>
              <h1>Loading Assets...</h1>
            </HTML>
          }
        > */}

        <ThreePages />
        <Startup />

        {/* <ThreeParticles count={isMobile ? 5000 : 10000} mouse={mouse} /> */}
      </>
    </scene>
  )
}

function Startup() {
  const ref = useRef() as MutableRefObject<Mesh>
  useFrame(
    () =>
      ((ref.current.material as Material).opacity = lerp(
        (ref.current.material as Material).opacity,
        0,
        0.025,
      )),
  )
  return (
    <mesh ref={ref} position={[0, 0, 200]} scale={[200, 200, 1]}>
      <planeBufferGeometry attach="geometry" />
      <meshBasicMaterial attach="material" color="#070712" transparent />
    </mesh>
  )
}

export default ThreeCanvas
