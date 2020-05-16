import state from '@/Store'
import { LinearFilter, RGBFormat, VideoTexture } from 'three'
import { Block, useBlock } from '@Components/Blocks'
import { HTML } from 'drei'
import { Cross, Stripe, ThreeContent } from '@Components/ThreePlane'

export const ThreePages: React.FC<any> = () => {
  // var video = document.getElementById( 'video' );
  console.log(state.videos)
  const videoElements = state.videos.map((src) => {
    const video = document.createElement('video')
    video.src = src
    video.preload = 'auto'
    video.loop = true
    video.autoplay = true
    video.crossOrigin = 'anonymous'
    return video
  })
  const textures = videoElements.map((videoEl) => new VideoTexture(videoEl))
  // const textures = useLoader<Texture[]>(TextureLoader, state.videos)
  const [img1, img2, img3] = textures.map((texture) => {
    texture.minFilter = LinearFilter
    texture.magFilter = LinearFilter
    texture.format = RGBFormat
    return texture
  })
  const { contentMaxWidth, mobile } = useBlock()
  const aspect = 1.75
  const pixelWidth = contentMaxWidth * state.zoom

  return (
    <>
      {/* First section */}
      <Block factor={1.5} offset={0}>
        <ThreeContent left map={img1}>
          {
            <HTML
              style={{
                width: pixelWidth / (mobile ? 1 : 2),
                textAlign: 'left',
              }}
              position={[
                -contentMaxWidth / 2,
                -contentMaxWidth / 2 / aspect - 0.4,
                1,
              ]}
            >
              <div>
                The substance can take you to heaven but it can also take you to
                hell.
              </div>
            </HTML>
          }
        </ThreeContent>
      </Block>
      {/* Second section */}
      <Block factor={2.0} offset={1}>
        <ThreeContent map={img2}>
          {
            <HTML
              style={{
                width: pixelWidth / (mobile ? 1 : 2),
                textAlign: 'right',
              }}
              position={[
                mobile ? -contentMaxWidth / 2 : 0,
                -contentMaxWidth / 2 / aspect - 0.4,
                1,
              ]}
            >
              <div>
                We’ve found that the people whose EEG doesn’t show any
                alpha-wave activity when they’re relaxed aren’t likely to
                respond significantly to the substance.
              </div>
            </HTML>
          }
        </ThreeContent>
      </Block>
      {/* Stripe */}
      <Block factor={-1.0} offset={1}>
        <Stripe />
      </Block>
      {/* Last section */}
      <Block factor={1.5} offset={2}>
        <ThreeContent left map={img3}>
          <Block factor={-0.5}>
            <Cross />
          </Block>
          {
            <HTML
              prepend
              style={{
                width: pixelWidth / (mobile ? 1 : 2),
                textAlign: 'left',
              }}
              position={[
                -contentMaxWidth / 2,
                -contentMaxWidth / 2 / aspect - 0.4,
                1,
              ]}
            >
              <div>Education and enlightenment.</div>
            </HTML>
          }
        </ThreeContent>
      </Block>
    </>
  )
}
