import cluster from 'node:cluster';

export const getAppConfig = () => ({
  port: Number(process.env.PORT),
  isPrimaryProcess: cluster.isPrimary,
  isMulti: process.env.APP_MODE === 'multi',
});
