import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./styles.module.scss";
import {
  faBasketShopping,
  faSpinner,
  faCircleCheck,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { IProduct } from "@/models/common/types";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/stores";
import { addProduct } from "@/stores/cart";

interface IProps {
  product: IProduct;
}

const AddToCart = ({ product }: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentIcon, setCurrentIcon] =
    useState<IconDefinition>(faBasketShopping);
  const dispatch = useAppDispatch();

  const addToCart = () => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch(addProduct(product));
      setIsLoading(false);
      setCurrentIcon(faCircleCheck);
    }, 500);
  };

  useEffect(() => {
    if (currentIcon === faCircleCheck) {
      setTimeout(() => {
        setCurrentIcon(faBasketShopping);
      }, 1000);
    }
  }, [currentIcon]);

  return (
    <div className={styles.root}>
      <button onClick={addToCart} className={styles.addToCart}>
        {isLoading && (
          <FontAwesomeIcon
            icon={faSpinner}
            width={16}
            height={16}
            spin
            className={styles.spinner}
          />
        )}
        <FontAwesomeIcon icon={currentIcon} width={16} height={16} />
      </button>
    </div>
  );
};

export default AddToCart;
