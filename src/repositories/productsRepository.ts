import { randomUUID } from 'node:crypto';
import { IInMemoryDB } from '../db/inMemoryDB.js';
import { sendDbQuery } from '../ipc/dbQuery.js';
import { ICreateProductDto, IProduct } from '../types/products.js';
import { IRepository } from '../types/repository.js';

const COLLECTION = 'products';

export const getProductsRepository = (db: IInMemoryDB): IRepository<IProduct> => {
  const productsCollection = db.collection<IProduct>(COLLECTION);

  return {
    findAll: async () => productsCollection.getAll(),
    findById: async (id: string) => productsCollection.get(id) || null,
    create: async (productDto: ICreateProductDto) => {
      const product = { ...productDto, id: randomUUID() };

      return productsCollection.set(product.id, product);
    },
    update: async (id: string, product: Partial<IProduct>) => {
      const existingProduct = productsCollection.get(id);

      if (!existingProduct) {
        return null;
      }

      const updatedProduct = { ...existingProduct, ...product, id };

      return productsCollection.set(id, updatedProduct);
    },
    delete: async (id: string) => {
      const deleted = productsCollection.get(id) || null;

      productsCollection.delete(id);

      return deleted;
    },
  };
};

export const getIpcProductsRepository = (): IRepository<IProduct> => {
  return {
    findAll: async () => await sendDbQuery(COLLECTION, 'getAll'),
    findById: async (id: string) => (await sendDbQuery(COLLECTION, 'get', [id])) || null,
    create: async (productDto: ICreateProductDto) => {
      const product = { ...productDto, id: randomUUID() };

      return await sendDbQuery(COLLECTION, 'set', [product.id, product]);
    },
    update: async (id: string, product: Partial<IProduct>) => {
      const existingProduct = await sendDbQuery(COLLECTION, 'get', [id]);

      if (!existingProduct) {
        return null;
      }

      const updatedProduct = { ...existingProduct, ...product, id };

      return await sendDbQuery(COLLECTION, 'set', [id, updatedProduct]);
    },
    delete: async (id: string) => {
      const deleted = (await sendDbQuery<IProduct>(COLLECTION, 'get', [id])) || null;

      await sendDbQuery(COLLECTION, 'delete', [id]);

      return deleted;
    },
  };
};
