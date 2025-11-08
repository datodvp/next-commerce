import { ICategory } from '@/models/common/types'
import HeroSection from './components/HeroSection'
import CategoriesSection from './components/CategoriesSection'
import CTASection from './components/CTASection'
import styles from './HomePage.module.scss'

interface HomePageProps {
  categories: ICategory[]
}

const HomePage = ({ categories }: HomePageProps) => {
  return (
    <div className={styles.landingPage}>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <CTASection show={categories.length > 0} />
    </div>
  )
}

export default HomePage

