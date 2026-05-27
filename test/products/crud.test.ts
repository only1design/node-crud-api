import { test } from 'node:test';
import assert from 'node:assert';
import { getAppServer } from '../../src/servers/appServer.js';
import { IProduct } from '../../src/types/products.js';
import { product } from './const.js';

test('Products API CRUD operations', async () => {
  const server = await getAppServer();

  let productInDb: IProduct;

  {
    const response = await server.inject({
      method: 'GET',
      url: '/api/products',
    });

    assert.strictEqual(response.statusCode, 200);
    const responseBody = JSON.parse(response.payload);
    assert.deepEqual(responseBody, []);
  }

  {
    const response = await server.inject({
      method: 'POST',
      url: '/api/products',
      body: product,
    });

    assert.strictEqual(response.statusCode, 201);
    productInDb = JSON.parse(response.payload);
    assert.deepEqual(
      {
        id: productInDb.id,
        ...product,
      },
      productInDb
    );
  }

  {
    const response = await server.inject({
      method: 'GET',
      url: '/api/products/' + productInDb.id,
    });

    assert.strictEqual(response.statusCode, 200);
    const responseProduct = JSON.parse(response.payload);
    assert.deepEqual(responseProduct, productInDb);
  }

  {
    const response = await server.inject({
      method: 'GET',
      url: '/api/products',
    });

    assert.strictEqual(response.statusCode, 200);
    const responseBody = JSON.parse(response.payload);
    assert.deepEqual(responseBody, [productInDb]);
  }

  {
    const response = await server.inject({
      method: 'PUT',
      url: '/api/products/' + productInDb.id,
      body: {
        price: 1337,
      },
    });

    assert.strictEqual(response.statusCode, 200);
    const responseProduct = JSON.parse(response.payload);
    assert.deepEqual(responseProduct, { ...productInDb, price: 1337 });
    productInDb = responseProduct;
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
      method: 'GET',
      url: '/api/products/' + productInDb.id,
    });

    assert.strictEqual(response.statusCode, 404);
    const responseBody = JSON.parse(response.payload);
    assert.deepEqual(responseBody, {
      statusCode: 404,
      error: 'Not Found',
      message: `Product with id ${productInDb.id} not found`,
    });
  }

  {
    const response = await server.inject({
      method: 'GET',
      url: '/api/products',
    });

    assert.strictEqual(response.statusCode, 200);
    const responseBody = JSON.parse(response.payload);
    assert.deepEqual(responseBody, []);
  }
});
