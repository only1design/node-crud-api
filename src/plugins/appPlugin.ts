import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { dbPlugin } from './dbPlugin.js';
import { repositoryPlugin } from './repositoryPlugin.js';

const _appPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(dbPlugin);
  fastify.register(repositoryPlugin);
};

export const appPlugin = fastifyPlugin(_appPlugin, {
  name: 'app-plugin',
});
