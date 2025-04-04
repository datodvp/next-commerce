import { IProduct } from "@/models/common/types";
import Image from "next/image";
import styles from "./styles.module.scss";
import AddToCart from "./AddToCart";

interface IProps {
  product: IProduct;
}
const ProductCard = ({ product }: IProps) => {
  return (
    <section className={styles.root}>
      <div className={styles.product}>
        <div className={styles.imageContainer}>
          <Image
            src={product.images[0]}
            alt={product.title}
            width={170}
            height={170}
          />
        </div>

        <div className={styles.category}>{product.category.name}</div>
        <span className={styles.title}>{product.title}</span>
        <span className={styles.price}>${product.price}</span>
        <AddToCart product={product} />
      </div>
    </section>
  );
};

export default ProductCard;
