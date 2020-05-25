module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      'babel-plugin-styled-components',
      {
        displayName: true,
        ssr: true,
      },
    ],
  ],
}
