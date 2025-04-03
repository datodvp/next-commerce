import "@/styles/globals.scss";
import Layout from "@/components/Layout";
import { AppProps } from "next/app";
import { ICategory } from "@/models/common/types";
import "@/helpers/nprogress";

interface IPageProps {
  categories: ICategory[];
}

interface IProps extends AppProps {
  pageProps: IPageProps;
}

export default function MyApp({ Component, pageProps }: IProps) {
  return (
    <Layout {...pageProps}>
      <Component {...pageProps} />
    </Layout>
  );
}
