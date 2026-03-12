import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';

export const setupClusterManager = (port: number) => {
  const workerPorts: number[] = [];
  const numOfWorkers = availableParallelism();

  for (let workerIndex = 1; workerIndex <= numOfWorkers; workerIndex++) {
    const workerPort = port + workerIndex;
    workerPorts.push(workerPort);
    cluster.fork({ PORT: workerPort });
  }

  return workerPorts;
};
