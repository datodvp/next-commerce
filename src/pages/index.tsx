import { ICategory } from "@/models/common/types";
import { GetServerSideProps } from "next";
import { fetchCategories } from "@/requests/fetchCategories";

const Home = () => {
  return <div>Next app!</div>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const categories: ICategory[] = await fetchCategories();

  return {
    props: {
      categories: categories,
    },
  };
};

export default Home;
