import {
  Loader,
  LoadingManager,
  RGBAFormat,
  RGBFormat,
  Texture,
  VideoTexture,
} from 'three'
import { VideoLoader } from './VideoLoader'

export class VideoTextureLoader extends Loader {
  constructor(manager?: LoadingManager) {
    super(manager)
  }

  load(
    url: string,
    onLoad?: (texture: VideoTexture) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: ErrorEvent) => void,
  ): any {
    const loader = new VideoLoader(this.manager)
    loader.setCrossOrigin(this.crossOrigin)
    loader.setPath(this.path)

    loader.load(
      url,
      (video) => {
        const texture = new VideoTexture(video)

        // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
        // const isJPEG =
        //   url.search(/\.jpe?g($|\?)/i) > 0 ||
        //   url.search(/^data:video\/jpeg/) === 0

        const hasAlpha = false

        texture.format = hasAlpha ? RGBAFormat : RGBFormat

        texture.needsUpdate = true

        if (onLoad !== undefined) {
          onLoad(texture)
        }
      },
      onProgress,
      onError,
    )

    return new Texture()
  }
}
