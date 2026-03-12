import 'dotenv/config';
import cluster from 'node:cluster';
import { setupClusterManager } from './clusters/clusterManager.js';
import { getAppServer } from './servers/appServer.js';
import { getLoadBalancer } from './servers/loadBalancer.js';

const port = Number(process.env.PORT) as number;

const getServer = () => {
  if (cluster.isPrimary && process.env.APP_MODE === 'multi') {
    const workerPorts = setupClusterManager(port);

    return getLoadBalancer(workerPorts);
  } else {
    return getAppServer();
  }
};

const server = getServer();

server.listen({ port });
