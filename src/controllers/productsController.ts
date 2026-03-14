import { FastifyInstance } from 'fastify';
import { ICreateProductDto } from '../types/products.js';

export const productsController = (fastify: FastifyInstance) => {
  fastify.get('/products', async () => {
    return await fastify.repository.products.findAll();
  });
  fastify.post('/products', async (req) => {
    return await fastify.repository.products.create(req.body as ICreateProductDto);
  });
};
