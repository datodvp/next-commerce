export interface IFlag {
  id: number
  name: string
  discountPercentage: number
  productCount?: number // Number of products using this flag
}

export interface IProduct {
  id: number
  sku?: string
  title: string
  slug: string
  price: number
  discountedPrice?: number
  description?: string
  stock?: number
  category: ICategory
  images: IImage[]
  flags?: IFlag[]
}

export interface ICategory {
  id: number
  name: string
  slug: string
  image: string
  order?: number // Optional for backwards compatibility
  productCount?: number // Number of products in this category
}

export interface IImage {
  id: number
  url: string
  order?: number
}

export interface IUser {
  id: number
  email: string
  password: string
  name: string
  role: string
  avatar: string
}

export interface ILogin {
  access_token: string
  refresh_token: string
}
