import { ICreateProductDto } from '../../src/types/products.js';

export const product: Readonly<ICreateProductDto> = {
  name: 'Test Product',
  description: 'Test Description',
  price: 10.99,
  category: 'Test Category',
  inStock: true,
};
