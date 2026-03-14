import 'dotenv/config';
import { setupClusterManager } from './clusters/clusterManager.js';
import { getAppConfig } from './config/appConfig.js';
import { getAppServer } from './servers/appServer.js';
import { getLoadBalancer } from './servers/loadBalancer.js';

const { port, isPrimaryProcess, isMulti } = getAppConfig();

const getServer = async () => {
  if (isMulti && isPrimaryProcess) {
    const workerPorts = setupClusterManager(port);

    return await getLoadBalancer(workerPorts);
  } else {
    return await getAppServer();
  }
};

const server = await getServer();

await server.listen({ port });
