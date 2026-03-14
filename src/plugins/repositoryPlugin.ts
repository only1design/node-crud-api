import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { getAppConfig } from '../config/appConfig.js';
import {
  getProductsRepository,
  getIpcProductsRepository,
} from '../repositories/productsRepository.js';
import { IProduct } from '../types/products.js';
import { IRepository } from '../types/repository.js';

declare module 'fastify' {
  interface FastifyInstance {
    repository: {
      products: IRepository<IProduct>;
    };
  }
}

export const _repositoryPlugin: FastifyPluginAsync = async (fastify) => {
  const { isMulti } = getAppConfig();

  const products =
    isMulti || !fastify.db ? getIpcProductsRepository() : getProductsRepository(fastify.db);

  fastify.decorate('repository', {
    products,
  });
};

export const repositoryPlugin = fastifyPlugin(_repositoryPlugin, {
  name: 'repository-plugin',
  dependencies: ['db-plugin'],
});
