import { ReactElement } from 'react'
import { ICategory } from '@/models/common/types'
import Header from '@/components/Layout/Header'
import styles from './Layout.module.scss'
import { inter } from '@/utils/fonts/fonts'

interface IProps {
  categories: ICategory[]
  children: ReactElement
}

export default function Layout({ categories, children }: IProps) {
  return (
    <main className={`${styles.root} ${inter.className}`}>
      <Header categories={categories} />
      {children}
    </main>
  )
}
