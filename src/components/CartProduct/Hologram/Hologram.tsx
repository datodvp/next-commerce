import { ReactElement } from 'react'
import styles from './Hologram.module.scss'

interface IProps {
  children: ReactElement
}

const Hologram = ({ children }: IProps) => {
  return (
    <>
      <div className={styles.holographicContainer}>
        <div className={styles.holographicCard}>{children}</div>
      </div>
    </>
  )
}

export default Hologram
