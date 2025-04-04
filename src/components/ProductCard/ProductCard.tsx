import { IProduct } from "@/models/common/types";
import Image from "next/image";
import styles from "./styles.module.scss";

interface IProps {
  product: IProduct;
  key: number;
}
const ProductCard = ({ product, key }: IProps) => {
  return (
    <section className={styles.root} key={key}>
      <div className={styles.product}>
        <div className={styles.image}>
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
      </div>
    </section>
  );
};

export default ProductCard;
