import '@/styles/globals.scss'
import Layout from '@/components/Layout'
import { AppProps } from 'next/app'
import { ICategory } from '@/models/common/types'
import { useNProgress } from '@/helpers/nprogress'
import { store } from '@/stores'
import { Provider } from 'react-redux'
import { useRouter } from 'next/router'
import AdminLayout from '@/admin/components/AdminLayout'

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
