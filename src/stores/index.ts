import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, useStore } from 'react-redux'
import rootReducer from './combineReducers'
import { localStorageMiddleware } from './localStorageMiddleware'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch
type AppStore = typeof store

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()
