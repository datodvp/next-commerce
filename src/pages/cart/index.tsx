import CartProduct from "@/components/CartProduct";
import styles from "./styles.module.scss";
import { requestCategories } from "@/requests/requestCategories";
import { useAppSelector } from "@/stores";
import { GetServerSideProps } from "next";

const Cart = () => {
  const cartStore = useAppSelector((state) => state.cart);

  const products = cartStore.products;

  return (
    <section className={styles.root}>
      {products.map((product) => (
        <CartProduct product={product} key={product.id} />
      ))}
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const categories = await requestCategories.fetchAllCategories();

  return {
    props: {
      categories: categories,
    },
  };
};

export default Cart;
