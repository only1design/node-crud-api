import fastifyReplyFrom from '@fastify/reply-from';
import fastify from 'fastify';
import { appPlugin } from '../plugins/appPlugin.js';

export const getLoadBalancer = async (workerPorts: number[]) => {
  let roundRobinPointer = 0;

  const loadBalancer = fastify();

  loadBalancer.register(appPlugin);
  loadBalancer.register(fastifyReplyFrom);

  loadBalancer.all('*', async (request, reply) => {
    const { protocol, hostname, url } = request;

    const workerPort = workerPorts[roundRobinPointer];
    const redirectUrl = `${protocol}://${hostname}:${workerPort}${url}`;

    roundRobinPointer = (roundRobinPointer + 1) % workerPorts.length;

    return reply.from(redirectUrl);
  });

  return loadBalancer;
};
