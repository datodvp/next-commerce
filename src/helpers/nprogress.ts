import { useRouter } from 'next/router'
import { useEffect } from 'react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

let loading = false

export const useNProgress = () => {
  const router = useRouter()

  useEffect(() => {
    const handleStart = () => {
      if (!loading) {
        loading = true
        NProgress.start()
        NProgress.set(0.4)
      }
    }

    const handleComplete = () => {
      if (loading) {
        loading = false
        NProgress.done()
      }
    }

    const handleError = () => {
      if (loading) {
        loading = false
        NProgress.done()
      }
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleError)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleError)
    }
  }, [router])
}
