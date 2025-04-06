import { requestCategories } from "@/requests/requestCategories";
import { GetServerSideProps } from "next";

const Cart = () => {
  return <section>CartPage</section>;
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
