import * as THREE from 'three'
import React, { forwardRef, useMemo } from 'react'
import { useLoader, useUpdate } from 'react-three-fiber'
import { Group, Mesh } from 'three'

interface IThreeTextProps {
  vAlign?: string
  hAlign?: string
  size?: number
  color?: string
  children: string
}

export const ThreeText = forwardRef<Group, IThreeTextProps>(({ children, vAlign = 'center', hAlign = 'center', size = 1, color = '#000000', ...props }, ref) => {
  const font = useLoader(THREE.FontLoader, '/bold.blob')
  const config = useMemo(() => ({ font, size: 40, height: 50 }), [font])
  const mesh = useUpdate<Mesh>(
    self => {
      const size = new THREE.Vector3()
      self.geometry.computeBoundingBox()
      self.geometry.boundingBox!.getSize(size)
      self.position.x = hAlign === 'center' ? -size.x / 2 : hAlign === 'right' ? 0 : -size.x
      self.position.y = vAlign === 'center' ? -size.y / 2 : vAlign === 'top' ? 0 : -size.y
    },
    [children]
  )

  // const ref = useRef() as MutableRefObject<Group>
  // useFrame(() => {
  //   if (ref && ref.current && state.mouse.current) {
  //     ref.current.position.x = lerp(
  //       ref.current.position.x,
  //       state.mouse.current[0] / 1 / 10,
  //       0.1,
  //     )
  //     ref.current.rotation.x = lerp(
  //       ref.current.rotation.x,
  //       0 + state.mouse.current[1] / 1 / 300,
  //       0.1,
  //     )
  //     ref.current.rotation.y = 0.8
  //   }
  // })

  return (
    <group ref={ref} {...props} scale={[0.1 * size, 0.1 * size, 0.1]}>
      <mesh ref={mesh}>
        <textGeometry attach="geometry" args={[children, config]} />
        <meshNormalMaterial attach="material" />
      </mesh>
    </group>
  )
})
