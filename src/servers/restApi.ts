import fastifySensible from '@fastify/sensible';
import fastify from 'fastify';
import { productsController } from '../controllers/productsController.js';
import { appPlugin } from '../plugins/appPlugin.js';

export const getRestApi = async () => {
  const appServer = fastify({
    logger: false,
  });

  appServer.register(appPlugin);
  appServer.register(fastifySensible, {
    sharedSchemaId: 'HttpError',
  });
  appServer.register(productsController, { prefix: '/api' });

  return appServer;
};
