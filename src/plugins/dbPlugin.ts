import { FastifyPluginAsync } from 'fastify';
import cluster from 'node:cluster';
import { getAppConfig } from '../config/appConfig.js';
import { createInMemoryDB, IInMemoryDB } from '../db/inMemoryDB.js';
import fastifyPlugin from 'fastify-plugin';
import { DB_QUERY, handleDbQuery } from '../ipc/sendDbQuery.js';

declare module 'fastify' {
  interface FastifyInstance {
    db: IInMemoryDB | null;
  }
}

const _dbPlugin: FastifyPluginAsync = async (fastify) => {
  const { isMulti, isPrimaryProcess } = getAppConfig();

  if (isMulti && isPrimaryProcess) {
    const db = createInMemoryDB();

    cluster.on('message', (worker, message) => {
      if (message.type === DB_QUERY) {
        handleDbQuery(db, worker, message);
      }
    });

    fastify.decorate('db', null);
  } else if (!isMulti) {
    const db = createInMemoryDB();

    fastify.decorate('db', db);
  }
};

export const dbPlugin = fastifyPlugin(_dbPlugin, {
  name: 'db-plugin',
  dependencies: [],
});
