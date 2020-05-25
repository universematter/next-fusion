// #region Global Imports
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
// #endregion Global Imports

// #region Local Imports
import { HomeActions } from '@Actions'
import { IHomePage, ReduxNextPageContext } from '@Interfaces'
import { FlexScreenCenter } from '@/Styled/Layout'
// import ThreeContainer from '@/Components/ThreeContainer';
// #endregion Local Imports

// #region Interface Imports
// #endregion Interface Imports

const ThreeContainerDynamic = dynamic(() => import('@/Components/ThreeApp'), {
  ssr: false,
  loading: () => (
    <FlexScreenCenter>
      <h1>Loading 3d effects...</h1>
    </FlexScreenCenter>
  ),
})

const Home: NextPage<IHomePage.IProps, IHomePage.InitialProps> = () => {
  // const home = useSelector((state: IStore) => state.home)
  // const dispatch = useDispatch()
  return <ThreeContainerDynamic />
}

Home.getInitialProps = async (
  ctx: ReduxNextPageContext,
): Promise<IHomePage.InitialProps> => {
  await ctx.store.dispatch(
    HomeActions.GetApod({
      params: { hd: true },
    }),
  )
  return {}
}

export default Home
