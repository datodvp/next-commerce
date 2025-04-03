import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./styles.module.scss";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SearchInput = () => {
  return (
    <section className={styles.root}>
      <div className={styles.search}>
        <input type="text" placeholder="Search" />
        <FontAwesomeIcon className={styles.icon} icon={faMagnifyingGlass} />
      </div>
    </section>
  );
};

export default SearchInput;
