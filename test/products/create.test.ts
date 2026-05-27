import { test } from 'node:test';
import assert from 'node:assert';
import { getAppServer } from '../../src/servers/appServer.js';
import { product } from './const.js';

test('Products API create operations validation', async () => {
  const server = await getAppServer();

  {
    const response = await server.inject({
      method: 'POST',
      url: '/api/products',
      body: {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
      },
    });

    assert.strictEqual(response.statusCode, 400);
    const responseBody = JSON.parse(response.payload);
    assert.equal(responseBody.message, "body must have required property 'inStock'");
  }

  {
    const response = await server.inject({
      method: 'POST',
      url: '/api/products',
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
      method: 'POST',
      url: '/api/products',
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
      method: 'POST',
      url: '/api/products',
      body: product,
    });

    assert.strictEqual(response.statusCode, 201);
  }
});
