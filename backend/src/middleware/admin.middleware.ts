/**
 * Admin middleware — re-exports both authMiddleware and isAdminMiddleware
 * for use in admin-only routes. Always chain both: authMiddleware then isAdminMiddleware.
 */
export { authMiddleware, isAdminMiddleware, type AuthEnv } from './auth.middleware'
