import '@/styles/globals.scss'
import Layout from '@/components/Layout'
import { AppProps } from 'next/app'
import { ICategory } from '@/models/common/types'
import { useNProgress } from '@/helpers/nprogress'
import { store } from '@/stores'
import { Provider } from 'react-redux'
import { useRouter } from 'next/router'
import AdminLayout from '@/admin/components/AdminLayout'
import { useEffect } from 'react'
import {
  loadCartFromStorage,
  loadFavouritesFromStorage,
} from '@/utils/localStorage'
import { setCart } from '@/stores/cart'
import { setFavourites } from '@/stores/favourites'

interface IPageProps {
  categories: ICategory[]
}

interface IProps extends AppProps {
  pageProps: IPageProps
}

function AppContent({
  Component,
  pageProps,
}: {
  Component: AppProps['Component']
  pageProps: IPageProps
}) {
  const router = useRouter()
  const isAdminRoute = router.pathname.startsWith('/admin')

  useNProgress()

  // Load cart and favourites from localStorage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage()
    if (savedCart) {
      store.dispatch(setCart(savedCart))
    }

    const savedFavourites = loadFavouritesFromStorage()
    if (savedFavourites) {
      store.dispatch(setFavourites(savedFavourites))
    }
  }, [])

  // Admin routes don't use the regular Layout
  if (isAdminRoute) {
    return (
      <AdminLayout>
        <Component {...pageProps} />
      </AdminLayout>
    )
  }

  // Client routes use the regular Layout
  return (
    <Layout {...pageProps}>
      <Component {...pageProps} />
    </Layout>
  )
}

export default function MyApp({ Component, pageProps }: IProps) {
  return (
    <Provider store={store}>
      <AppContent Component={Component} pageProps={pageProps} />
    </Provider>
  )
}
