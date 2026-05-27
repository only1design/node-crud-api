import fastifySensible from '@fastify/sensible';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastify, { type FastifyError } from 'fastify';
import { productsController } from '../controllers/productsController.js';
import { appPlugin } from '../plugins/appPlugin.js';

export const getRestApi = async () => {
  const appServer = fastify({
    logger: false,
    ajv: {
      customOptions: {
        keywords: ['example'],
      },
    },
  });

  appServer.setErrorHandler((error: FastifyError, _request, reply) => {
    const statusCode = error.statusCode ?? 500;

    if (statusCode >= 500) {
      reply.status(statusCode).send({
        statusCode,
        error: 'Internal Server Error',
        message: 'Something went wrong',
      });
    } else {
      reply.status(statusCode).send(error);
    }
  });

  appServer.register(fastifySwagger);
  appServer.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  });
  appServer.register(fastifySensible, {
    sharedSchemaId: 'HttpError',
  });

  appServer.register(appPlugin);
  appServer.register(productsController, { prefix: '/api' });

  return appServer;
};
