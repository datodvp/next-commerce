import { ICategory } from "@/models/common/types";
import styles from "./styles.module.scss";
import SearchInput from "@/components/Layout/SearchInput";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Title from "@/components/Layout/Title";

interface IProps {
  categories: ICategory[];
}

const Header = ({ categories }: IProps) => {
  const pathname = usePathname();

  return (
    <header>
      <section className={styles.fixedHeader}>
        <Title />
        <SearchInput />
      </section>
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
    </header>
  );
};

export default Header;
