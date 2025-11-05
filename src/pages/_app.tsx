import '@/styles/globals.scss'
import Layout from '@/components/Layout'
import { AppProps } from 'next/app'
import { ICategory } from '@/models/common/types'
import { useNProgress } from '@/helpers/nprogress'
import { store } from '@/stores'
import { Provider } from 'react-redux'

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
  useNProgress()

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
