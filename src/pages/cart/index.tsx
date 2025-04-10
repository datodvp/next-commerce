import ProductList from "@/components/ProductList";
import { requestCategories } from "@/requests/requestCategories";
import { useAppSelector } from "@/stores";
import { GetServerSideProps } from "next";

const Cart = () => {
  const cartStore = useAppSelector((state) => state.cart);

  const products = cartStore.products;

  return (
    <section>
      <ProductList products={products} />
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
