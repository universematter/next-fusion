// #region Global Imports
import { AnyAction, applyMiddleware, combineReducers, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { Context, HYDRATE, createWrapper } from 'next-redux-wrapper'
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
// #endregion Global Imports

// #region Local Imports
import { HomeReducer } from './Reducers/home'
// #endregion Local Imports

const HydrateReducer = (state = {}, action: AnyAction) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

const Reducers = combineReducers({
  home: HomeReducer,
  hydrate: HydrateReducer,
})

export const makeStore = (_context: Context) => {
  return createStore(
    Reducers,
    composeWithDevTools(applyMiddleware(thunkMiddleware)),
  )
}

export const wrapper = createWrapper(makeStore, { debug: false })
