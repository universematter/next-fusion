import {
  Color,
  Euler,
  Mesh,
  ShaderMaterial,
  TextureLoader,
  UniformsUtils,
  Vector2,
  Vector3,
} from 'three'
import { MutableRefObject, forwardRef, useEffect, useMemo, useRef } from 'react'
import lerp from 'lerp'
import { useBlock } from '@/Components/ThreeBlock'
import GlitchWaveMaterial from '@/Components/ThreeShaders/GlitchWaveMaterial'
import { state } from '@Store'
import { extend, useFrame } from 'react-three-fiber'
import {
  fragmentShader,
  uniforms,
  vertexShader,
} from '../ThreeShaders/Fake3dShader'

extend({ GlitchWaveMaterial })

interface IThreePlaneProps {
  frustumCulled?: boolean
  color?: string
  textureUrl?: string
  textureDepthUrl?: string
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
    {
      color = 'white',
      shift = 1,
      opacity = 1,
      args,
      textureUrl,
      textureDepthUrl,
      ...props
    },
    ref,
  ) => {
    const { viewportHeight, offsetFactor } = useBlock()
    const material = useRef() as MutableRefObject<ShaderMaterial>
    const [texture, textureDepth] = useMemo(() => {
      const texture = textureUrl && new TextureLoader().load(textureUrl)
      // texture.minFilter = LinearFilter
      const textureDepth =
        textureDepthUrl && new TextureLoader().load(textureDepthUrl)
      // textureDepth.minFilter = LinearFilter
      return [texture, textureDepth]
    }, [textureUrl, textureDepthUrl])

    const [threshold] = useMemo(() => {
      const threshold = new Vector2(350, 150)
      return [threshold]
    }, [])

    // const myUniforms = useMemo(
    //   () => ({
    //     threshold: { value: threshold },
    //     opacity: { value: opacity },
    //     color: { value: new Color(color) },
    //   }),
    //   [color, opacity, threshold],
    // )

    // const material = useMemo(() => {
    //   const mat = new ShaderMaterial({
    //     uniforms: {
    //       ...UniformsUtils.clone(uniforms),
    //       ...myUniforms,
    //     },
    //     vertexShader,
    //     fragmentShader,
    //     transparent: true,
    //   })

    //   return mat
    // }, [])

    // useEffect(() => {
    //   material.uniforms.texture.value = texture
    //   material.uniforms.textureDepth.value = textureDepth
    //   material.uniforms.hasTexture.value = !!texture && !!textureDepth
    // }, [material, texture, textureDepth])

    // let last = state.top.current
    useFrame(() => {
      const { pages, top, mouse } = state
      material.current.uniforms.mouse.value.set(
        mouse.current[0] * 0.05,
        mouse.current[1] * 0.05,
      )
      material.current.uniforms.scale.value = lerp(
        material.current.uniforms.scale.value,
        offsetFactor - top.current / ((pages - 1) * viewportHeight),
        0.1,
      )
      // material.shift = lerp(material.shift, (top.current - last) / shift, 0.1)
      // last = top.current
    })

    // const imageAspect = useMemo(() => {
    //   return texture ? texture.image.height / texture.image.width : 1
    // }, [texture])

    return (
      <>
        <mesh ref={ref} {...props}>
          <planeBufferGeometry attach="geometry" args={args} />
          {/* <primitive object={material} attach="material" /> */}
          <shaderMaterial
            attach="material"
            ref={material}
            args={[
              {
                uniforms: UniformsUtils.clone(uniforms),
                vertexShader,
                fragmentShader,
              },
            ]}
            uniforms-threshold-value={threshold}
            uniforms-texture-value={texture}
            uniforms-textureDepth-value={textureDepth}
            uniforms-hasTexture-value={!!(texture && textureDepth)}
            uniforms-opacity-value={opacity}
            uniforms-color-value={new Color(color)}
            transparent
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
