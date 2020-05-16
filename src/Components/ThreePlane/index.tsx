import { Euler, Group, Mesh, Texture, Vector3 } from 'three'
import { MutableRefObject, useRef } from 'react'
import lerp from 'lerp'
import { useBlock } from '@Components/Blocks'
import { GlitchWaveMaterial } from '@/Components/ThreeMaterials/GlitchWaveMaterial'
import state from '@/Store'
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
  color = 'white',
  map,
  ...props
}) => {
  const { viewportHeight, offsetFactor } = useBlock()
  const material = useRef() as MutableRefObject<GlitchWaveMaterial>
  const mesh = useRef() as MutableRefObject<Mesh>
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
  })

  return (
    <mesh {...props} ref={mesh}>
      <planeBufferGeometry attach="geometry" args={[1, 1, 32, 32]} />
      <glitchWaveMaterial
        ref={material}
        attach="material"
        color={color}
        map={map}
      />
    </mesh>
  )
}

interface IContentProps {
  children?: JSX.Element[] | JSX.Element
  left?: boolean
  map?: Texture
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
        color="#bfe2ca"
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
