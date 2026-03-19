/**
 * MSW (Mock Service Worker) setup for integration tests.
 *
 * This intercepts real HTTP requests at the network layer (via `msw`),
 * so the actual axios client in `api.ts` runs with no code changes.
 * The server starts before all tests and resets handlers between tests.
 */
import { setupServer } from 'msw/node';

export const server = setupServer(
  // Handlers are registered per-test via server.use(...)
  // so this list stays empty — each test file adds its own.
);
