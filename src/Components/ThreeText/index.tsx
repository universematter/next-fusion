import { useFrame, useLoader } from 'react-three-fiber'
import { FontLoader, TextBufferGeometry, Vector3 } from 'three'
import lerp from 'lerp'
import { MutableRefObject, useCallback, useRef } from 'react'
import { state } from '@/Store'
import { usePromiseSuspense } from '@/Utils/usePromiseSuspense'
import GlitchWaveMaterial from '../ThreeShaders/GlitchWaveMaterial'

interface IThreeTextProps {
  children: string
  size?: number
  left?: boolean
  right?: boolean
  top?: boolean
  bottom?: boolean
  color?: string
  opacity?: number
  height?: number
  font?: string
  position?: [number, number, number] | Vector3
}

export const ThreeText: React.FC<IThreeTextProps> = ({
  children,
  size = 1,
  left,
  right,
  top,
  bottom,
  color = 'white',
  opacity = 1,
  height = 0.01,
  font = '/MOONGET_Heavy.blob',
  ...props
}) => {
  const data = useLoader(FontLoader, font)
  const geom = usePromiseSuspense(
    () =>
      new Promise((resolve) =>
        resolve(
          new TextBufferGeometry(children, {
            font: data,
            size: 1,
            height,
            curveSegments: 32,
          }),
        ),
      ),
    [children],
  )
  const onUpdate = useCallback(
    (self) => {
      const box = new Vector3()
      self.geometry.computeBoundingBox()
      self.geometry.boundingBox.getSize(box)
      self.position.x = left ? 0 : right ? -box.x : -box.x / 2
      self.position.y = top ? 0 : bottom ? -box.y : -box.y / 2
    },
    [left, right, top, bottom],
  )

  const ref = useRef() as MutableRefObject<GlitchWaveMaterial>
  let last = state.top.current
  useFrame(() => {
    ref.current.shift = lerp(
      ref.current.shift,
      (state.top.current - last) / 100,
      0.1,
    )
    last = state.top.current
  })

  return (
    <group {...props} scale={[size, size, 0.1]}>
      <mesh geometry={geom} onUpdate={onUpdate} frustumCulled={false}>
        <glitchWaveMaterial
          ref={ref}
          attach="material"
          color={color}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  )
}

export const ThreeMultilineText = ({
  text,
  size = 1,
  lineHeight = 1,
  position = [0, 0, 0],
  ...props
}) =>
  text.split('\n').map((text, index) => (
    <ThreeText
      key={index}
      size={size}
      {...props}
      position={[position[0], position[1] - index * lineHeight, position[2]]}
    >
      {text}
    </ThreeText>
  ))
