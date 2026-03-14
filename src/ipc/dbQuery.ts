import { Worker } from 'node:cluster';
import { randomUUID } from 'node:crypto';
import { IInMemoryDB } from '../db/inMemoryDB.js';

export const DB_QUERY = 'db_query';
export const DB_RESPONSE = 'db_response';

export interface IDBQueryMessage {
  type: typeof DB_QUERY;
  requestId: string;
  payload: {
    collection: string;
    method: string;
    args: unknown[];
  };
}
export interface IDBResponseMessage {
  type: typeof DB_RESPONSE;
  requestId: string;
  payload: {
    success: boolean;
    data?: unknown;
    error?: string;
  };
}

export const handleDbQuery = (db: IInMemoryDB, worker: Worker, message: IDBQueryMessage) => {
  const { collection, method, args } = message.payload;
  const { requestId } = message;

  const sendResponse = (payload: IDBResponseMessage['payload']) => {
    worker.send({
      type: DB_RESPONSE,
      requestId,
      payload,
    } satisfies IDBResponseMessage);
  };

  try {
    const coll = db.collection(collection);

    if (!coll) {
      return sendResponse({
        success: false,
        error: `Collection '${collection}' not found`,
      });
    }

    const methodFn = coll[method as keyof typeof coll];

    if (typeof methodFn !== 'function') {
      return sendResponse({
        success: false,
        error: `Method '${String(method)}' is not a function`,
      });
    }

    // @ts-expect-error Pass args with an unknown type
    const result = methodFn(...args);

    sendResponse({
      success: true,
      data: result,
    });
  } catch (error) {
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const sendDbQuery = <T>(
  collection: string,
  method: string,
  args: unknown[] = []
): Promise<T> =>
  new Promise((resolve, reject) => {
    const requestId = randomUUID();

    const handler = (message: IDBResponseMessage) => {
      if (message.type === DB_RESPONSE && message.requestId === requestId) {
        process.off('message', handler);

        if (message.payload.success) {
          resolve(message.payload.data as T);
        } else {
          reject(new Error(message.payload.error));
        }
      }
    };

    process.on('message', handler);

    process.send!({
      type: DB_QUERY,
      requestId,
      payload: { collection, method, args },
    } satisfies IDBQueryMessage);
  });
