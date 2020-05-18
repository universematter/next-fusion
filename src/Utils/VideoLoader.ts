import { Cache, Loader } from 'three'

class VideoLoader extends Loader {
  constructor(manager) {
    super(manager)
  }

  load(url, onLoad, _onProgress, onError) {
    if (this.path !== undefined) url = this.path + url

    url = this.manager.resolveURL(url)

    const cached = Cache.get(url)

    if (cached !== undefined) {
      this.manager.itemStart(url)

      setTimeout(() => {
        if (onLoad) onLoad(cached)

        this.manager.itemEnd(url)
      }, 0)

      return cached
    }

    const video = document.createElement('video')

    const videoLength = 4

    const onProgress = (video) => {
      if (Math.round(video.buffered.end(0)) == videoLength) {
        video.removeEventListener('progress', onProgress)
        video.play()
      }
    }

    const onVideoLoad = () => {
      video.removeEventListener('canplay', onVideoLoad, false)
      // video.removeEventListener('error', onVideoError, false)

      if (Math.round(video.buffered.end(0)) >= videoLength) {
        console.log('video is already loaded')
        video.play()
      } else {
        console.log('Monitor video buffer progress before playing')
        video.addEventListener('progress', onProgress)
      }

      Cache.add(url, video)

      if (onLoad) onLoad(video)

      this.manager.itemEnd(url)
    }

    const onVideoError = (event) => {
      video.removeEventListener('canplay', onVideoLoad, false)
      video.removeEventListener('error', onVideoError, false)

      if (onError) onError(event)

      this.manager.itemError(url)
      this.manager.itemEnd(url)
    }

    video.addEventListener('canplay', onVideoLoad, false)
    video.addEventListener('error', onVideoError, false)

    if (url.substr(0, 5) !== 'data:') {
      if (this.crossOrigin !== undefined) video.crossOrigin = this.crossOrigin
    }

    this.manager.itemStart(url)

    video.preload = 'auto'
    video.loop = true
    // video.crossOrigin = 'anonymous'
    video.autoplay = true
    video.muted = true
    video.src = url
    video.load()

    return video
  }
}

export { VideoLoader }
