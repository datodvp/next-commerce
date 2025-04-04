import { ICategory, IProduct } from "@/models/common/types";
import { GetServerSideProps } from "next";
import { requestCategories } from "@/requests/requestCategories";
import ProductList from "@/components/ProductList";
import { requestProducts } from "@/requests/requestProducts";

interface IProps {
  categories: ICategory[];
  products: IProduct[];
}

const Home = ({ products }: IProps) => {
  return (
    <section>
      <ProductList products={products} />
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const categories: ICategory[] = await requestCategories.fetchAllCategories();

  const products: IProduct[] = await requestProducts.fetchAllProducts();

  return {
    props: {
      categories: categories,
      products: products,
    },
  };
};

export default Home;
