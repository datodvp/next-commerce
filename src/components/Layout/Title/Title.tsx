import Link from "next/link";
import styles from "./styles.module.scss";
import { akatab } from "@/utils/fonts/fonts";

const Title = () => {
  return (
    <section className={styles.root}>
      <Link href={"/"} className={`${styles.title} ${akatab.className}`}>
        Next Commerce
      </Link>
    </section>
  );
};

export default Title;
