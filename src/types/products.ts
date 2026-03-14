export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

export type ICreateProductDto = Omit<IProduct, 'id'>;
