import { setupClusterManager } from '../clusters/clusterManager.js';
import { getAppConfig } from '../config/appConfig.js';
import { getLoadBalancer } from './loadBalancer.js';
import { getRestApi } from './restApi.js';

export const getAppServer = async () => {
  const { port, isPrimaryProcess, isMulti } = getAppConfig();

  if (isMulti && isPrimaryProcess) {
    const workerPorts = setupClusterManager(port);

    return await getLoadBalancer(workerPorts);
  } else {
    return await getRestApi();
  }
};
