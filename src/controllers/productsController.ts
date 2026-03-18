import { FastifyInstance } from 'fastify';
import { ICreateProductDto, IProduct, IUpdateProductDto } from '../types/products.js';

const productIdParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
  },
  required: ['id'],
};

const createProductBodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, example: 'Wireless Keyboard' },
    description: {
      type: 'string',
      minLength: 1,
      example: 'Compact wireless keyboard with Bluetooth 5.0',
    },
    price: { type: 'number', exclusiveMinimum: 0, example: 49.99 },
    category: { type: 'string', minLength: 1, example: 'Electronics' },
    inStock: { type: 'boolean', example: true },
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
    id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
    name: { type: 'string', example: 'Wireless Keyboard' },
    description: { type: 'string', example: 'Compact wireless keyboard with Bluetooth 5.0' },
    price: { type: 'number', example: 49.99 },
    category: { type: 'string', example: 'Electronics' },
    inStock: { type: 'boolean', example: true },
  },
};

export const productsController = (fastify: FastifyInstance) => {
  fastify.get(
    '/products',
    {
      schema: {
        summary: 'List all products',
        description: 'Returns all products from the catalog.',
        response: {
          200: {
            description: 'List of products',
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
        summary: 'Get a product by ID',
        description: 'Returns a single product by its UUID.',
        params: productIdParamsSchema,
        response: {
          200: { description: 'The requested product', ...productResponseSchema },
          400: { description: 'Invalid product ID format', $ref: 'HttpError' },
          404: { description: 'Product not found', $ref: 'HttpError' },
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
        summary: 'Create a product',
        description: 'Adds a new product to the catalog. All fields are required.',
        body: createProductBodySchema,
        response: {
          201: { description: 'The created product', ...productResponseSchema },
          400: { description: 'Validation error', $ref: 'HttpError' },
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
        summary: 'Update a product',
        description:
          'Updates an existing product. All fields are optional — only provided fields will be changed.',
        params: productIdParamsSchema,
        body: updateProductBodySchema,
        response: {
          200: { description: 'The updated product', ...productResponseSchema },
          400: { description: 'Invalid ID format or validation error', $ref: 'HttpError' },
          404: { description: 'Product not found', $ref: 'HttpError' },
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
        summary: 'Delete a product',
        description: 'Removes a product from the catalog by its UUID.',
        params: productIdParamsSchema,
        response: {
          204: { description: 'Product deleted successfully', type: 'null' },
          400: { description: 'Invalid product ID format', $ref: 'HttpError' },
          404: { description: 'Product not found', $ref: 'HttpError' },
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
