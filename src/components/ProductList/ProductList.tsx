import { IProduct } from "@/models/common/types";
import ProductCard from "../ProductCard";
import styles from "./styles.module.scss";

interface IProps {
  products: IProduct[];
}

const ProductList = ({ products }: IProps) => {
  return (
    <>
      <section className={styles.root}>
        {products?.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </section>
    </>
  );
};

export default ProductList;
