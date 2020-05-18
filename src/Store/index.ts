import { MutableRefObject, createRef } from 'react'

const videos = [
  'VTN__0739__jpg',
  'VTN__0740__jpg',
  'VTN__0754__jpg',
  // 'VTN__0764__jpg',
  // 'VTN__0781__jpg',
  // 'VTN__0785__jpg',
  // 'VTN__0786__jpg',
  // 'VTN__0793__jpg',
].map(
  (src) =>
    `https://storage.googleapis.com/3d-photo/insta3d/renders/__content__3d__photo__photos__${src}/render.mp4`,
)

export const state = {
  sections: 3,
  pages: 3,
  zoom: 5,
  images: ['/images/1.jpg', '/images/2.jpg', '/images/3.jpg', '/images/4.jpg'],
  blocks: [
    {
      factor: 1.5,
      video: videos[0],
      // texture: createRef() as MutableRefObject<Texture>,
      text: `The substance can take you to heaven but it can also take you to hell.`,
    },
    {
      factor: 2,
      video: videos[1],
      // texture: createRef() as MutableRefObject<Texture>,
      text: `We’ve found that the people whose EEG doesn’t show any
        alpha-wave activity when they’re relaxed aren’t likely to
        respond significantly to the substance.`,
    },
    {
      factor: 1.5,
      video: videos[2],
      // texture: createRef() as MutableRefObject<Texture>,
      text: `Education and enlightenment.`,
    },
  ],
  top: createRef() as MutableRefObject<number>,
  mouse: createRef() as MutableRefObject<number[]>,
  layers: { DEFAULT_LAYER: 0, OCCLUSION_LAYER: 1, PARTICLES_LAYER: 2 } as any,
}

export function useStore() {
  return state
}
