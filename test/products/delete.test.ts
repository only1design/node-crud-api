import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import assert from 'node:assert';
import { getAppServer } from '../../src/servers/appServer.js';
import { IProduct } from '../../src/types/products.js';
import { product } from './const.js';

test('Products API delete operations validation', async () => {
  const server = await getAppServer();

  let productInDb: IProduct;

  {
    const response = await server.inject({
      method: 'POST',
      url: '/api/products',
      body: product,
    });

    assert.strictEqual(response.statusCode, 201);
    productInDb = JSON.parse(response.payload);
  }

  {
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/products/' + 'invalid id',
    });

    assert.strictEqual(response.statusCode, 400);
    const responseBody = JSON.parse(response.payload);
    assert.equal(responseBody.message, 'params/id must match format "uuid"');
  }

  {
    const randomUuid = randomUUID();
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/products/' + randomUuid,
    });

    assert.strictEqual(response.statusCode, 404);
    const responseBody = JSON.parse(response.payload);
    assert.equal(responseBody.message, `Product with id ${randomUuid} not found`);
  }

  {
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/products/' + productInDb.id,
    });

    assert.strictEqual(response.statusCode, 204);
  }

  {
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/products/' + productInDb.id,
    });

    assert.strictEqual(response.statusCode, 404);
    const responseBody = JSON.parse(response.payload);
    assert.equal(responseBody.message, `Product with id ${productInDb.id} not found`);
  }
});
