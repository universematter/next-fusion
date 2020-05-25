import { Euler, Mesh, Texture, Vector2, Vector3, Vector4 } from 'three'
import { MutableRefObject, forwardRef, useMemo, useRef } from 'react'
import lerp from 'lerp'
import { useBlock } from '@/Components/ThreeBlock'
import GlitchWaveMaterial from '@/Components/ThreeShaders/GlitchWaveMaterial'
import { state } from '@Store'
import { extend, useFrame, useThree } from 'react-three-fiber'
import Fake3dShader from '../ThreeShaders/Fake3dShader'

extend({ GlitchWaveMaterial })

interface IThreePlaneProps {
  frustumCulled?: boolean
  color?: string
  texture?: Texture
  position?: [number, number, number] | Vector3
  scale?: [number, number, number] | Vector3
  rotation?: [number, number, number] | Euler
  shift?: number
  opacity?: number
  args?: any

  size?: number
  aspect?: number
}

export const ThreePlane = forwardRef<Mesh, IThreePlaneProps>(
  (
    { color = 'white', shift = 1, opacity = 1, args, texture, ...props },
    ref,
  ) => {
    const { viewportHeight, offsetFactor } = useBlock()
    const material = useRef() as MutableRefObject<GlitchWaveMaterial>

    let textureDepth = new Texture()
    if (texture instanceof Array) {
      textureDepth = texture[1]
      texture = texture[0]
    }

    let last = state.top.current
    const mouseVector = new Vector2()
    useFrame(() => {
      const { pages, top, mouse } = state
      mouseVector.set(mouse.current[0] * 0.05, mouse.current[1] * 0.05)
      material.current.scale = lerp(
        material.current.scale,
        offsetFactor - top.current / ((pages - 1) * viewportHeight),
        0.1,
      )
      material.current.shift = lerp(
        material.current.shift,
        (top.current - last) / shift,
        0.1,
      )
      last = top.current
    })

    const { size, gl, clock } = useThree()

    const imageAspect = useMemo(() => {
      return texture ? texture.image.height / texture.image.width : 1
    }, [texture])

    const [resolution, threshold, pixelRatio] = useMemo(() => {
      let a1, a2
      if (size.height / size.width < imageAspect) {
        a1 = 1
        a2 = size.height / size.width / imageAspect
      } else {
        a1 = (size.width / size.height) * imageAspect
        a2 = 1
      }
      const threshold = new Vector2(35, 15)
      // gl.setViewport(0, 0, size.width, size.height)
      // const context = gl.getContext()
      // const positionLocation = context.getAttribLocation(
      //   context.getParameter(context.CURRENT_PROGRAM),
      //   'a_position',
      // )
      // context.enableVertexAttribArray(positionLocation)
      // context.vertexAttribPointer(
      //   positionLocation,
      //   2,
      //   context.FLOAT,
      //   false,
      //   0,
      //   0,
      // )
      const pixelRatio = gl.getPixelRatio()
      const resolution = new Vector4(size.width, size.height, a1, a2)
      return [resolution, threshold, pixelRatio]
    }, [gl, imageAspect, size.height, size.width])

    return (
      <>
        <mesh ref={ref} {...props}>
          <planeBufferGeometry attach="geometry" args={args} />
          <shaderMaterial
            attach="material"
            ref={material}
            args={[Fake3dShader]}
            uniforms-resolution-value={resolution}
            uniforms-mouse-value={mouseVector}
            uniforms-threshold-value={threshold}
            uniforms-time-value={clock.getElapsedTime()}
            uniforms-pixelRatio-value={pixelRatio}
            uniforms-texture-value={texture}
            uniforms-hasTexture-value={!!texture}
            uniforms-textureDepth-value={textureDepth}
            transparent
            opacity={opacity}
          />
          {/* <glitchWaveMaterial
            ref={material}
            attach="material"
            color={color}
            uniforms-texture-value={texture}
            uniforms-textureDepth-value={textureDepth}
            transparent
            opacity={opacity}
          /> */}
        </mesh>
        {/* <mesh
          {...props}
          layers={state.layers.OCCLUSION_LAYER}
          receiveShadow
          castShadow
          position-z={-1}
        >
          <planeBufferGeometry attach="geometry" args={args} />
          <meshBasicMaterial attach="material" color={new Color('black')} />
        </mesh> */}
      </>
    )
  },
)
