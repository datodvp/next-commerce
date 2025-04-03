import { ICategory, IProduct } from "@/models/common/types";
import { fetchCategories } from "@/requests/fetchCategories";
import { GetServerSideProps } from "next";

interface IProps {
  products: IProduct[];
}

const Category = ({ products }: IProps) => {
  return (
    <section>
      <div>
        {products.map((product) => (
          <div key={product.id}>{product.title}</div>
        ))}
      </div>
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { params } = ctx;
  const { slug } = params as { slug: string };

  const categories: ICategory[] = await fetchCategories();

  const currentCategory = categories.find((category) => category.slug === slug);

  const products: IProduct[] = await fetch(
    `https://api.escuelajs.co/api/v1/categories/${currentCategory?.id}/products`
  ).then((data) => data.json());

  return {
    props: {
      categories: categories,
      params: slug,
      products: products,
    },
  };
};

export default Category;
