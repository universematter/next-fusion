import { MutableRefObject, Suspense, useEffect, useRef } from 'react'
import lerp from 'lerp'
import { Canvas, useFrame, useThree } from 'react-three-fiber'

import '@/Utils/ThreeComponents'
import { state } from '@Store'
import { ScrollArea } from '@Styled/Layout'
import { Mesh } from 'three'
import { ThreeContent } from '../ThreeContent'
import { ThreeGLTF } from '@Components/ThreeGLTF'
// import ThreeSparks from '../ThreeSparks'
// import Effects from '../ThreeEffects'
import { Material } from 'three'
import { ThreePlane } from '../ThreePlane'

function ThreeApp() {
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
        concurrent
        pixelRatio={1}
        orthographic
        camera={{
          zoom: state.zoom,
          position: [0, 0, 500],
        }}
      >
        <Suspense fallback={'Loading 3d assets...'}>
          <ThreeContent />
          <ThreeGLTF />
          <Startup />
          {/* <fog attach="fog" args={[0xffffff, 50, 100]} /> */}
          {/* <ambientLight />
          <pointLight
            castShadow
            distance={100}
            intensity={10}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            color={new Color('white')}
          /> */}
          {/* <ThreeSparks
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
          <Effects /> */}
          <Controls />
        </Suspense>
      </Canvas>
      <ScrollArea
        id="scroll"
        ref={scrollArea}
        onScroll={onScroll}
        onMouseMove={onMouseMove}
      >
        {new Array(state.sections).fill(null).map((_, index) => (
          <div
            key={index}
            id={'0' + index}
            style={{ height: `${(state.pages / state.sections) * 100}vh` }}
          />
        ))}
      </ScrollArea>
    </>
  )
}

function Controls() {
  const el = document.getElementById('scroll') as HTMLDivElement
  const { camera } = useThree()
  return <orbitControls args={[camera, el]} enableZoom={false} />
}

function Startup() {
  const ref = useRef() as MutableRefObject<Mesh>
  useFrame(
    () =>
      ((ref.current.material as Material).opacity = lerp(
        ref.current.material as Material,
        0,
        0.025,
      )),
  )
  return (
    <ThreePlane
      ref={ref}
      color="#0e0e0f"
      position={[0, 0, 200]}
      scale={[100, 100, 1]}
    />
  )
}

export default ThreeApp
