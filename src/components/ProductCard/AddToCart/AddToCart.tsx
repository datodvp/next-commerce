import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./styles.module.scss";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { IProduct } from "@/models/common/types";

interface IProps {
  product: IProduct;
}

const AddToCart = ({ product }: IProps) => {
  const addToCart = (product: IProduct) => {
    // console.log(product);
  };
  return (
    <div className={styles.root}>
      <button onClick={() => addToCart(product)} className={styles.addToCart}>
        <FontAwesomeIcon icon={faBasketShopping} width={16} height={16} />
      </button>
    </div>
  );
};

export default AddToCart;
