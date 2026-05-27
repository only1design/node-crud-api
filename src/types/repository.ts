import { ICreateProductDto } from './products.js';

export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(product: ICreateProductDto): Promise<T>;
  update(id: string, product: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<T | null>;
}
