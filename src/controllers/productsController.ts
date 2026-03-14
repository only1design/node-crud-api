import { FastifyInstance } from 'fastify';
import { ICreateProductDto, IProduct, IUpdateProductDto } from '../types/products.js';

const productIdParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
  },
  required: ['id'],
};

const createProductBodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
    price: { type: 'number', exclusiveMinimum: 0 },
    category: { type: 'string', minLength: 1 },
    inStock: { type: 'boolean' },
  },
  required: ['name', 'description', 'price', 'category', 'inStock'],
};

const updateProductBodySchema = {
  type: createProductBodySchema.type,
  properties: createProductBodySchema.properties,
};

const productResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
    category: { type: 'string' },
    inStock: { type: 'boolean' },
  },
};

export const productsController = (fastify: FastifyInstance) => {
  fastify.get(
    '/products',
    {
      schema: {
        response: {
          200: {
            type: 'array',
            items: productResponseSchema,
          },
        },
      },
    },
    async () => {
      return await fastify.repository.products.findAll();
    }
  );

  fastify.get<{
    Params: { id: string };
    Reply: IProduct;
  }>(
    '/products/:id',
    {
      schema: {
        params: productIdParamsSchema,
        response: {
          200: productResponseSchema,
          400: { $ref: 'HttpError' },
          404: { $ref: 'HttpError' },
        },
      },
    },
    async (request) => {
      const { id } = request.params;
      const product = await fastify.repository.products.findById(id);

      if (!product) {
        throw fastify.httpErrors.notFound(`Product with id ${id} not found`);
      }

      return product;
    }
  );

  fastify.post<{
    Body: ICreateProductDto;
    Reply: IProduct;
  }>(
    '/products',
    {
      schema: {
        body: createProductBodySchema,
        response: {
          201: productResponseSchema,
          400: { $ref: 'HttpError' },
        },
      },
    },
    async (request, reply) => {
      const product = await fastify.repository.products.create(request.body);
      reply.code(201);
      return product;
    }
  );

  fastify.put<{
    Params: { id: string };
    Body: IUpdateProductDto;
    Reply: IProduct;
  }>(
    '/products/:id',
    {
      schema: {
        params: productIdParamsSchema,
        body: updateProductBodySchema,
        response: {
          200: productResponseSchema,
          400: { $ref: 'HttpError' },
          404: { $ref: 'HttpError' },
        },
      },
    },
    async (request) => {
      const { id } = request.params;

      const product = await fastify.repository.products.update(id, request.body);

      if (!product) {
        throw fastify.httpErrors.notFound(`Product with id ${id} not found`);
      }

      return product;
    }
  );

  fastify.delete<{
    Params: { id: string };
    Reply: void;
  }>(
    '/products/:id',
    {
      schema: {
        params: productIdParamsSchema,
        response: {
          204: { type: 'null' },
          400: { $ref: 'HttpError' },
          404: { $ref: 'HttpError' },
        },
      },
    },
    async (request, response) => {
      const { id } = request.params;

      const product = await fastify.repository.products.delete(id);

      if (!product) {
        throw fastify.httpErrors.notFound(`Product with id ${id} not found`);
      }

      response.code(204);

      return;
    }
  );
};
