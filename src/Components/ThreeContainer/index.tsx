import { MutableRefObject, Suspense, useEffect, useRef } from 'react'
import lerp from 'lerp'
import { Canvas, useFrame, useThree } from 'react-three-fiber'

import { state } from '@Store'
import { ScrollArea } from '@Styled/Layout'
import { Color, Mesh, Uncharted2ToneMapping, sRGBEncoding } from 'three'
import { ThreePages } from '../ThreePages'
import ThreeSparks from '../ThreeSparks'
import Effects from '../ThreeEffects'
import { Material } from 'three'

function ThreeCanvas() {
  // const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const onMouseMove = ({ clientX: x, clientY: y }) => {
    state.mouse.current = [
      x - window.innerWidth / 2,
      y - window.innerHeight / 2,
    ]
    // console.log(state.mouse.current)
  }
  const scrollArea = useRef() as MutableRefObject<HTMLDivElement>
  const onScroll = (e: React.UIEvent<HTMLElement>) => {
    state.top.current = e.currentTarget.scrollTop
    // console.log(state.top.current)
  }
  useEffect(() => {
    onScroll({ currentTarget: scrollArea.current } as any)
    onMouseMove({ clientX: 0, clientY: 0 })
  })

  return (
    <>
      <Canvas
        className="canvas"
        shadowMap
        orthographic
        camera={{
          zoom: state.zoom,
          position: [0, 0, 500],
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = Uncharted2ToneMapping
          gl.outputEncoding = sRGBEncoding
          gl.setClearColor(new Color('#020207'))
        }}
      >
        <ThreeApp />
        <Controls />
      </Canvas>
      <ScrollArea
        id="scroll"
        ref={scrollArea}
        onScroll={onScroll}
        onMouseMove={onMouseMove}
      >
        <div style={{ height: `${state.pages * 100}vh` }} />
      </ScrollArea>
    </>
  )
}

function Controls() {
  const el = document.getElementById('scroll') as HTMLDivElement
  const { camera } = useThree()
  return <orbitControls args={[camera, el]} enableZoom={false} />
}

function ThreeApp() {
  // const camera = useRef() as MutableRefObject<PerspectiveCamera>
  // const { camera } = useThree()
  // useEffect(() => void setDefaultCamera(camera.current), [])
  return (
    <>
      <Suspense fallback={null}>
        <ThreePages />
        <Startup />
        {/* <fog attach="fog" args={[0xffffff, 50, 100]} /> */}
        <ambientLight />
        <pointLight
          castShadow
          distance={100}
          intensity={10}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          color={new Color('white')}
        />
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
        <Effects />
      </Suspense>
    </>
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
