# CRUD API — Product Catalog (Fastify + TypeScript)

Simple CRUD API for a Product Catalog, implemented with Fastify and TypeScript. 
The app uses an in‑memory data store. It supports two execution modes:
- Single-process mode (default): the API and the in-memory DB run in the same process.
- Multi-process mode: a lightweight Fastify load balancer on the primary process fans out requests to worker processes; the DB is centralized in the primary process and accessed via IPC.


## Stack
- Language: TypeScript
- Framework: Fastify ^5
- Utilities: dotenv, @fastify/sensible, @fastify/reply-from, cross-env
- Tooling: tsx (dev runner and tests), TypeScript, ESLint, Prettier, simple-git-hooks
- Package manager: npm


## Requirements
- Node.js 24.14.0
- npm

Optional for development:
- curl or an API client (e.g., Postman) for manual testing


## Installation
1. Clone the repository
   ```bash
   git clone https://github.com/only1design/node-crud-api.git
   cd node-crud-api
   ```
2. Install dependencies
   ```bash
   npm install
   ```


## Configuration (Environment Variables)
The application reads environment variables via `dotenv`. Create a `.env` file in the project root. Use `.env.example` as template.

Required:
- `PORT` — the public port to listen on (no default; must be provided).


## Running the app
- Development (single-process):
  ```bash
  npm run start:dev
  ```
- Development (multi-process):
  ```bash
  npm run start:multi
  ```
- Production (single-process):
  ```bash
  npm run start:prod
  ```
- Production (multi-process):
  ```bash
  npm run start:prod:multi
  ```

Notes on multi-process mode:
- Public traffic is served on `PORT` by the primary process.
- Worker processes are forked on ports `PORT + 1 ... PORT + N`, where `N = availableParallelism()` of the host OS (`src/clusters/clusterManager.ts`).
- The in-memory DB lives in the primary process; workers access it through a small IPC protocol (`src/ipc/dbQuery.ts`).

## Testing
- Run all tests:
  ```bash
  npm test
  ```
- Test framework: Node’s built-in `node:test` API executed via `tsx --test`.
- Test files: see `test/**/*.test.ts` - all the files inside `test` folder with `.test.ts` extension.

## API Overview
Base URL prefix: `/api`

Validation and error responses are powered by `@fastify/sensible` with a shared schema id `HttpError`.
