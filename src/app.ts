import 'dotenv/config';

import { getAppConfig } from './config/appConfig.js';
import { getAppServer } from './servers/appServer.js';

const { port } = getAppConfig();
const server = await getAppServer();

await server.listen({ port });
