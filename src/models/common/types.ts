export interface IFlag {
  id: number
  name: string
  discountPercentage: number
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
