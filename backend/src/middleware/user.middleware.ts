/**
 * User middleware — re-exports authMiddleware under a semantic alias
 * for use in user-facing routes.
 */
export { authMiddleware as userMiddleware, type AuthEnv } from './auth.middleware'
