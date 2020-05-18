import { state } from '@Store'
import { LinearFilter, VideoTexture } from 'three'
import { ThreeBlock, useBlock } from '@/Components/ThreeBlock'
import { HTML } from 'drei'
import { Stripe, ThreeContent } from '@Components/ThreePlane'
import { useLoader } from 'react-three-fiber'
import { useMemo } from 'react'
import { VideoTextureLoader } from '@/Utils/VideoTextureLoader'

export const ThreePages: React.FC<any> = () => {
  const videos = useLoader<VideoTexture[]>(
    VideoTextureLoader,
    state.blocks.map(({ video }) => video),
  )
  useMemo(
    () =>
      videos.forEach((texture) => {
        texture.minFilter = LinearFilter
        texture.magFilter = LinearFilter
      }),
    [videos],
  )

  const { contentMaxWidth } = useBlock()
  const aspect = 1.75
  const pixelWidth = contentMaxWidth * state.zoom

  return (
    <>
      {state.blocks.map((block, index) => (
        <ThreeBlock key={block.video} factor={block.factor} offset={index}>
          <ThreeContent left map={videos[index]}>
            {
              <HTML
                style={{
                  width: pixelWidth,
                  textAlign: 'left',
                }}
                position={[
                  -contentMaxWidth / 2,
                  -contentMaxWidth / 2 / aspect - 0.4,
                  1,
                ]}
              >
                <div>{block.text}</div>
              </HTML>
            }
          </ThreeContent>
        </ThreeBlock>
      ))}
      {/* Stripe */}
      <ThreeBlock factor={-1.0} offset={1}>
        <Stripe />
      </ThreeBlock>
    </>
  )
}
