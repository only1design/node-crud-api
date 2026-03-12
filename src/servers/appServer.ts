import fastify from 'fastify';

export const getAppServer = () => {
  const appServer = fastify();

  appServer.get('/', async function handler(request, reply) {
    return `hello world ${process.pid}`;
  });

  return appServer;
};
