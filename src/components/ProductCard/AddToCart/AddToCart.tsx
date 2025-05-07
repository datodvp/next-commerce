import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./styles.module.scss";
import {
  faBasketShopping,
  faSpinner,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { IProduct } from "@/models/common/types";
import { useState } from "react";
import { useAppDispatch } from "@/stores";
import { addProduct } from "@/stores/cart";
import { useProductInBasket } from "@/helpers/useProductInBasket";

interface IProps {
  product: IProduct;
}

const AddToCart = ({ product }: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isInCart = useProductInBasket(product);

  const dispatch = useAppDispatch();

  const addToCart = () => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch(addProduct(product));
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className={styles.root}>
      <button
        disabled={isInCart}
        onClick={addToCart}
        className={styles.addToCart}
      >
        {isLoading ? (
          <FontAwesomeIcon
            icon={faSpinner}
            width={16}
            height={16}
            spin
            className={styles.spinner}
          />
        ) : (
          <FontAwesomeIcon
            icon={isInCart ? faCircleCheck : faBasketShopping}
            width={16}
            height={16}
          />
        )}
      </button>
    </div>
  );
};

export default AddToCart;
