import { TextureLoader } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useLoader } from 'react-three-fiber'
import { VideoTextureLoader } from '@/Utils/VideoTextureLoader'

const getLoader = (url: string) => {
  if (/\.(gif|jpe?g|tiff|png|webp|bmp)$/i.test(url)) {
    return TextureLoader
  } else if (/\.(mp4|mp42)$/i.test(url)) {
    return VideoTextureLoader
  } else {
    return GLTFLoader
  }
}

export function useLoadManager<T>(src: string | string[]) {
  const loader = src instanceof Array ? getLoader(src[0]) : getLoader(src)
  return useLoader<T>(loader as any, src as any)
}
