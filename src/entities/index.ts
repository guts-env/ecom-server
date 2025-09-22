interface IBaseEntity {
  id: string;
  created_at: Date;
}

interface IUser extends IBaseEntity {
  name: string;
  email: string;
  hashed_password: string;
}

interface IStore extends IBaseEntity {
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
  phone_number?: string;
  rating?: number;
  is_open?: boolean;
  location_id?: string;
}

interface IProduct extends IBaseEntity {
  name: string;
  description: string;
  price: number;
  store_id: string;
  category: string;
  brand: string;
  stock: number;
}

interface IOrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

interface IOrder extends IBaseEntity {
  user_id: string;
  items: IOrderItem[];
  total_amount: number;
}

export type { IBaseEntity, IUser, IStore, IProduct, IOrder, IOrderItem };
