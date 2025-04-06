import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./styles.module.scss";
import { faBasketShopping, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { IProduct } from "@/models/common/types";
import { useState } from "react";

interface IProps {
  product: IProduct;
}

const AddToCart = ({ product }: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addToCart = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log(product);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className={styles.root}>
      <button onClick={addToCart} className={styles.addToCart}>
        {isLoading ? (
          <FontAwesomeIcon icon={faSpinner} width={16} height={16} spin />
        ) : (
          <FontAwesomeIcon icon={faBasketShopping} width={16} height={16} />
        )}
      </button>
    </div>
  );
};

export default AddToCart;
