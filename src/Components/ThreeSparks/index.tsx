import { CatmullRomCurve3, Vector3 } from 'three'
import { MutableRefObject, useMemo, useRef } from 'react'
import { extend, useFrame, useThree } from 'react-three-fiber'
import lerp from 'lerp'
import * as meshline from 'threejs-meshline'
import { Group, ShaderMaterial } from 'three'
import { state } from '@Store'

extend(meshline)

const r = () => Math.max(0.2, Math.random())

function Fatline({ curve, width, color, speed }) {
  const material = useRef() as MutableRefObject<ShaderMaterial>
  useFrame(() => {
    material.current.uniforms.dashOffset.value -= speed
  })
  return (
    <>
      <mesh layers={state.layers.OCCLUSION_LAYER}>
        <meshLine attach="geometry" vertices={curve} />
        <meshLineMaterial
          attach="material"
          ref={material}
          transparent
          depthTest={true}
          lineWidth={width}
          color={color}
          dashArray={0.1}
          dashRatio={0.95}
        />
      </mesh>
    </>
  )
}

export default function ThreeSparks({ mouse, count, colors, radius = 10 }) {
  const lines = useMemo(
    () =>
      new Array(count).fill(0).map((_, index) => {
        const pos = new Vector3(
          Math.sin(0) * radius * r(),
          Math.cos(0) * radius * r(),
          0,
        )
        const points = new Array(30).fill(0).map((_, index) => {
          const angle = (index / 20) * Math.PI * 2
          return pos
            .add(
              new Vector3(
                Math.sin(angle) * radius * r(),
                Math.cos(angle) * radius * r(),
                0,
              ),
            )
            .clone()
        })
        const curve = new CatmullRomCurve3(points).getPoints(1000)
        return {
          color: colors[Math.floor(colors.length * Math.random())],
          width: Math.max(0.1, (0.2 * index) / 10),
          speed: Math.max(0.001, 0.004 * Math.random()),
          curve,
        }
      }),
    [count],
  )

  const ref = useRef() as MutableRefObject<Group>
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x = lerp(
        ref.current.rotation.x,
        0 + mouse.current[1] / aspect / 200 / 5,
        0.1,
      )
      ref.current.rotation.y = lerp(
        ref.current.rotation.y,
        0 + mouse.current[0] / aspect / 400 / 5,
        0.1,
      )
    }
  })

  return (
    <group ref={ref}>
      <group position={[radius * 2, -radius, -20]} scale={[1, 1.3, 1]}>
        {lines.map((props, index) => (
          <Fatline key={index} {...props} />
        ))}
      </group>
    </group>
  )
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLine: any
      meshLineMaterial: any
    }
  }
}
