import { Color, Euler, Group, Mesh, Texture, Vector3 } from 'three'
import { MutableRefObject, useRef } from 'react'
import lerp from 'lerp'
import { useBlock } from '@/Components/ThreeBlock'
import GlitchWaveMaterial from '@/Components/ThreeShaders/GlitchWaveMaterial/GlitchWaveMaterial'
import { state } from '@Store'
import { extend, useFrame } from 'react-three-fiber'

extend({ GlitchWaveMaterial })

interface IThreePlaneProps {
  color?: string
  map?: Texture
  scale?: Vector3 | [number, number, number]
  rotation?: Euler | [number, number, number]
  position?: Vector3 | [number, number, number]
  mouse?: MutableRefObject<number[]>
}

export const ThreePlane: React.FC<IThreePlaneProps> = ({
  color = 'black',
  map,
  ...props
}) => {
  const { viewportHeight, offsetFactor } = useBlock()
  // const { camera } = useThree()
  const material = useRef() as MutableRefObject<GlitchWaveMaterial>
  const mesh = useRef() as MutableRefObject<Mesh>

  // useEffect(() => {
  //   console.log('map change', map)
  // }, [map])
  console.log('render plane')

  let last = state.top.current
  useFrame(() => {
    const { pages, top } = state
    material.current.scale = lerp(
      material.current.scale,
      offsetFactor - top.current / ((pages - 1) * viewportHeight),
      0.1,
    )
    material.current.shift = lerp(
      material.current.shift,
      (top.current - last) / 120,
      0.1,
    )
    last = top.current
    // material.current.uniforms.texture.needsUpdate = true
    // camera.updateMatrixWorld()
  })

  return (
    <>
      <mesh
        {...props}
        ref={mesh}
        layers={state.layers.DEFAULT_LAYER}
        receiveShadow
        castShadow
      >
        <planeBufferGeometry attach="geometry" args={[1, 1, 32, 32]} />
        <glitchWaveMaterial
          ref={material}
          attach="material"
          map={map}
          color={color}
        />
      </mesh>
      <mesh
        {...props}
        layers={state.layers.OCCLUSION_LAYER}
        receiveShadow
        castShadow
        position-z={-1}
      >
        <planeBufferGeometry attach="geometry" args={[1, 1, 32, 32]} />
        <meshBasicMaterial attach="material" color={new Color('black')} />
      </mesh>
    </>
  )
}

interface IContentProps {
  children?: JSX.Element[] | JSX.Element
  left?: boolean
  map?: Texture
  onTextureReady?: Function
}

export const ThreeContent: React.FC<IContentProps> = ({
  left,
  children,
  map,
}): React.ReactElement => {
  const { contentMaxWidth, canvasWidth, margin } = useBlock()
  const aspect = 1.75
  const alignRight = (canvasWidth - contentMaxWidth - margin) / 2

  return (
    <group position={[alignRight * (left ? -1 : 1), 0, 0]}>
      <ThreePlane
        scale={[contentMaxWidth, contentMaxWidth / aspect, 1]}
        color="#333333"
        map={map}
      />
      {children}
    </group>
  )
}

export function Cross() {
  const ref = useRef() as MutableRefObject<Group>
  const { viewportHeight } = useBlock()
  useFrame(() => {
    const curTop = state.top.current
    const curY = ref.current.rotation.z
    const nextY = (curTop / ((state.pages - 1) * viewportHeight)) * Math.PI
    ref.current.rotation.z = lerp(curY, nextY, 0.1)
  })
  return (
    <group ref={ref} scale={[2, 2, 2]}>
      <ThreePlane scale={[1, 0.2, 0.2]} color="#e2bfca" />
      <ThreePlane scale={[0.2, 1, 0.2]} color="#e2bfca" />
    </group>
  )
}

export function Stripe() {
  const { contentMaxWidth } = useBlock()
  return (
    <ThreePlane
      scale={[400, contentMaxWidth, 1]}
      rotation={[0, 0, Math.PI / 4]}
      position={[0, 0, -1]}
      color="#171725"
    />
  )
}
