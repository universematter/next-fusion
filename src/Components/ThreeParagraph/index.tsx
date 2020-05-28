import { ThreeBlock, useBlock } from '../ThreeBlock'
import { state } from '@/Store'
import { ThreePlane } from '../ThreePlane'
import { ThreeText } from '../ThreeText'
import { HTML } from 'drei'

export const ThreeParagraph = ({
  textureUrl,
  textureDepthUrl,
  index,
  offset,
  factor,
  header,
  aspect,
  text,
}) => {
  const { contentMaxWidth: w, canvasWidth, margin, mobile } = useBlock()
  const size = aspect < 1 && !mobile ? 0.65 : 1
  const alignRight = (canvasWidth - w * size - margin) / 2
  const pixelWidth = w * state.zoom * size
  const left = !(index % 2)
  const color = index % 2 ? '#D40749' : '#2FE8C3'
  return (
    <ThreeBlock factor={factor} offset={offset}>
      <group position={[left ? -alignRight : alignRight, 0, 0]}>
        <ThreePlane
          textureUrl={textureUrl}
          textureDepthUrl={textureDepthUrl}
          args={[1, 1, 32, 32]}
          shift={75}
          size={size}
          aspect={aspect}
          scale={[w * size, (w * size) / aspect, 1]}
          frustumCulled={false}
        />
        <HTML
          style={{
            width: pixelWidth / (mobile ? 1 : 2),
            textAlign: left ? 'left' : 'right',
          }}
          position={[
            left || mobile ? (-w * size) / 2 : 0,
            (-w * size) / 2 / aspect - 5,
            1,
          ]}
        >
          <div tabIndex={index}>{text}</div>
        </HTML>
        <ThreeText
          left={left}
          right={!left}
          size={w * 0.04}
          color={color}
          top
          position={[
            ((left ? -w : w) * size) / 2,
            (w * size) / aspect / 2 + 5,
            -1,
          ]}
        >
          {header}
        </ThreeText>
        <ThreeBlock factor={0.2}>
          <ThreeText
            opacity={0.5}
            size={w * 0.1}
            color="#1A1E2A"
            position={[
              ((left ? w : -w) / 2) * size,
              (w * size) / aspect / 1.5 + 2,
              -10,
            ]}
          >
            {'0' + (index + 1)}
          </ThreeText>
        </ThreeBlock>
      </group>
    </ThreeBlock>
  )
}
