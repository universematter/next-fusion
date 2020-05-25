import { state } from '@Store'
import { ThreeBlock, useBlock } from '@/Components/ThreeBlock'
import { HTML } from 'drei'
import { ThreePlane } from '@Components/ThreePlane'
import { useMemo } from 'react'
import { ThreeMultilineText, ThreeText } from '@/Components/ThreeText'
import { ThreeParagraph } from '@/Components/ThreeParagraph'
import { useLoadManager } from '@/Utils/useLoadManager'
import { LinearFilter, Texture } from 'three'

export const ThreeContent: React.FC<any> = () => {
  const { contentMaxWidth: w, canvasWidth, canvasHeight, mobile } = useBlock()

  const textures = useLoadManager<Texture[]>(
    state.paragraphs.map(({ texture }) => texture),
  )
  const texturesDepth = useLoadManager<Texture[]>(
    state.paragraphs.map(({ textureDepth }) => textureDepth),
  )

  useMemo(
    () => textures.forEach((texture) => (texture.minFilter = LinearFilter)),
    [textures],
  )

  const pixelWidth = w * state.zoom
  return (
    <>
      <ThreeBlock factor={1} offset={0}>
        <ThreeBlock factor={1.2}>
          <ThreeText
            left
            size={w * 0.08}
            position={[-w / 3.2, 0.5, -1]}
            color="#d40749"
          >
            MOKSHA
          </ThreeText>
        </ThreeBlock>
        <ThreeBlock factor={1.0}>
          <HTML
            style={{ width: pixelWidth }}
            position={[-w / 3.2, -w * 0.08 + 0.25, -1]}
          >
            It was the year 2076.{mobile ? <br /> : ' '}The substance had
            arrived.
          </HTML>
        </ThreeBlock>
      </ThreeBlock>
      <ThreeBlock factor={1.2} offset={5.7}>
        <ThreeMultilineText
          top
          left
          size={w * 0.15}
          lineHeight={w / 5}
          position={[-w / 3.5, 0, -1]}
          color="#2fe8c3"
          text={'four\nzero\nzero'}
        />
      </ThreeBlock>
      {state.paragraphs.map((props, index) => (
        <ThreeParagraph
          key={index}
          index={index}
          {...props}
          texture={[textures[index], texturesDepth[index]]}
        />
      ))}
      {state.stripes.map(({ offset, color, height }, index) => (
        <ThreeBlock key={index} factor={-1.5} offset={offset}>
          <ThreePlane
            args={[500, height * 10, 32, 32]}
            shift={-4}
            color={color}
            rotation={[0, 0, Math.PI / 8]}
            position={[0, 0, -10]}
          />
        </ThreeBlock>
      ))}
      <ThreeBlock factor={1.25} offset={8}>
        <HTML
          style={{ width: pixelWidth }}
          className="bottom-left"
          position={[-canvasWidth / 2, -canvasHeight / 2, 0]}
        >
          Culture is not your friend.
        </HTML>
      </ThreeBlock>
    </>
  )
}
