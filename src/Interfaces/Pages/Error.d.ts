// #region Global Imports
// #endregion Global Imports

declare namespace IErrorPage {
  export interface IProps extends WithTranslation {
    statusCode?: number
  }

  export interface InitialProps {
    // namespacesRequired: string[];
  }
}

export { IErrorPage }
