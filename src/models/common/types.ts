export interface IProduct {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: ICategory;
  images: string[];
}

export interface ICategory {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export interface IUser {
  id: number;
  email: string;
  passsword: string;
  name: string;
  role: string;
  avatar: string;
}

export interface ILogin {
  access_token: string;
  refresh_token: string;
}
