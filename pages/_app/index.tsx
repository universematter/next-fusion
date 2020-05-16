// #region Global Imports
import * as React from 'react'
import App, { AppContext, AppInitialProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
// #endregion Global Imports

// #region Local Imports
import { theme } from '@Definitions/Styled'
import { AppWithStore } from '@Interfaces'
import { wrapper } from '@Redux'

import "@Public/css/app.css";
// import "@Public/css/reset.scss";
// #endregion Local Imports

class WebApp extends App<AppWithStore> {
  static async getInitialProps({
    Component,
    ctx,
  }: AppContext): Promise<AppInitialProps> {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    )
  }
}

export default wrapper.withRedux(WebApp)
