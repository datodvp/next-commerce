import { ReactElement } from "react";
import { ICategory } from "@/models/common/types";
import Header from "@/components/Header";
import styles from "./styles.module.scss";

interface IProps {
  categories: ICategory[];
  children: ReactElement;
}

export default function Layout({ categories, children }: IProps) {
  return (
    <main className={`${styles.root}`}>
      <Header categories={categories} />
      {children}
      <footer>Footer</footer>
    </main>
  );
}
