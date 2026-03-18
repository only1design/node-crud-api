import 'dotenv/config';

import { getAppConfig } from './config/appConfig.js';
import { getAppServer } from './servers/appServer.js';

const { port, isMulti, isPrimaryProcess } = getAppConfig();
const server = await getAppServer();

await server.listen({ port });

if (isMulti && isPrimaryProcess) {
  console.log('Load balancer is running on port ' + port + ' in multiprocess mode.');
} else {
  console.log('REST API server is running on port ' + port + '.');
}
