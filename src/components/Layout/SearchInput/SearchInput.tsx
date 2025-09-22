import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './SearchInput.module.scss'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const SearchInput = () => {
  return (
    <section className={styles.root}>
      <div className={styles.search}>
        <input type="text" placeholder="Search" />
        <FontAwesomeIcon
          width={16}
          height={16}
          className={styles.icon}
          icon={faMagnifyingGlass}
        />
      </div>
    </section>
  )
}

export default SearchInput
