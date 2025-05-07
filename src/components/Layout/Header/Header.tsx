import { ICategory } from "@/models/common/types";
import styles from "./styles.module.scss";
import SearchInput from "@/components/Layout/SearchInput";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Title from "@/components/Layout/Title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "@/stores";

interface IProps {
  categories: ICategory[];
}

const Header = ({ categories }: IProps) => {
  const pathname = usePathname();
  const cartStore = useAppSelector((state) => state.cart);

  return (
    <>
      <section className={styles.fixedHeader}>
        <div className={styles.searchContainer}>
          <Title />
          <SearchInput />
        </div>
        <Link href={"/cart"} className={styles.cartContainer}>
          <FontAwesomeIcon
            icon={faCartShopping}
            width={25}
            height={25}
            fontSize={30}
            color="#3d7277"
          />
          {!!cartStore.total && <span>{cartStore.total}</span>}
        </Link>
      </section>
      <>
        <section className={styles.header}>
          <section className={styles.categories}>
            {categories?.slice(0, 6).map((category) => {
              const isActive = pathname.includes(category.slug);

              return (
                <Link
                  href={`/categories/${category.slug}`}
                  className={`${styles.category} ${isActive && styles.active}`}
                  key={category.id}
                >
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </section>
        </section>
      </>
    </>
  );
};

export default Header;
