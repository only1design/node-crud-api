import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import assert from 'node:assert';
import { getAppServer } from '../../src/servers/appServer.js';
import { IProduct } from '../../src/types/products.js';
import { product } from './const.js';

test('Products API update operations validation', async () => {
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
      method: 'PUT',
      url: '/api/products/' + productInDb.id,
      body: {
        ...product,
        price: 'invalid price',
      },
    });

    assert.strictEqual(response.statusCode, 400);
    const responseBody = JSON.parse(response.payload);
    assert.equal(responseBody.message, 'body/price must be number');
  }

  {
    const response = await server.inject({
      method: 'PUT',
      url: '/api/products/' + productInDb.id,
      body: {
        ...product,
        price: -30.99,
      },
    });

    assert.strictEqual(response.statusCode, 400);
    const responseBody = JSON.parse(response.payload);
    assert.equal(responseBody.message, 'body/price must be > 0');
  }

  {
    const response = await server.inject({
      method: 'PUT',
      url: '/api/products/' + 'invalid id',
      body: product,
    });

    assert.strictEqual(response.statusCode, 400);
    const responseBody = JSON.parse(response.payload);
    assert.equal(responseBody.message, 'params/id must match format "uuid"');
  }

  {
    const randomUuid = randomUUID();
    const response = await server.inject({
      method: 'PUT',
      url: '/api/products/' + randomUuid,
      body: product,
    });

    assert.strictEqual(response.statusCode, 404);
    const responseBody = JSON.parse(response.payload);
    assert.equal(responseBody.message, `Product with id ${randomUuid} not found`);
  }

  {
    const response = await server.inject({
      method: 'PUT',
      url: '/api/products/' + productInDb.id,
      body: { ...productInDb, price: 1337, redundantField: 'should not be in the body' },
    });

    assert.strictEqual(response.statusCode, 200);
    const responseBody = JSON.parse(response.payload);
    assert.deepEqual({ ...productInDb, price: 1337 }, responseBody);
  }
});
