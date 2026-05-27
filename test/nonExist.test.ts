import { test } from 'node:test';
import assert from 'node:assert';
import { getAppServer } from '../src/servers/appServer.js';

test('Requests to non-existing endpoints', async () => {
  const server = await getAppServer();

  {
    const response = await server.inject({
      method: 'GET',
      url: '/some-non/existing/resource',
    });

    assert.strictEqual(response.statusCode, 404);
    const responseBody = JSON.parse(response.payload);
    assert.equal(responseBody.message, 'Route GET:/some-non/existing/resource not found');
  }
});
