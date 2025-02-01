/**
 * Application Constants
 */

export const APP_CONSTANTS = {
    // Pagination
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    
    // Authentication
    JWT_EXPIRY: '1d',
    REFRESH_TOKEN_EXPIRY: '7d',
    PASSWORD_SALT_ROUNDS: 10,
    
    // Upload Limits
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    
    // Cache
    CACHE_TTL: 60 * 60 * 1000, // 1 hour
    
    // Rate Limiting
    RATE_LIMIT: {
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
      MAX_REQUESTS: 100
    },
    
    // Order Status Messages
    ORDER_STATUS_MESSAGES: {
      PENDING: 'Order is pending confirmation',
      ACCEPTED: 'Order has been accepted',
      OUT_FOR_DELIVERY: 'Order is out for delivery',
      DELIVERED: 'Order has been delivered',
      CANCELLED: 'Order has been cancelled'
    },
    
    // Validation
    VALIDATION: {
      MIN_PASSWORD_LENGTH: 8,
      MAX_PASSWORD_LENGTH: 100,
      MIN_NAME_LENGTH: 2,
      MAX_NAME_LENGTH: 50,
      PHONE_REGEX: /^\+?[\d\s-]{10,}$/,
      POSTAL_CODE_REGEX: /^[A-Z\d]{3,10}$/i
    },
    
    // Error Messages
    ERROR_MESSAGES: {
      UNAUTHORIZED: 'You are not authorized to perform this action',
      NOT_FOUND: 'Resource not found',
      INVALID_CREDENTIALS: 'Invalid email or password',
      INVALID_TOKEN: 'Invalid or expired token',
      SERVER_ERROR: 'Internal server error'
    }
  } as const
  
  // HTTP Status Codes
  export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500
  } as const
  
  // Route Prefixes
  export const ROUTE_PREFIXES = {
    API: '/api',
    AUTH: '/auth',
    USERS: '/users',
    PRODUCTS: '/products',
    ORDERS: '/orders',
    CART: '/cart'
  } as const
  
  // Environment Types
  export const ENV_TYPES = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test'
  } as const
  
  // Content Types
  export const CONTENT_TYPES = {
    JSON: 'application/json',
    FORM_DATA: 'multipart/form-data',
    TEXT: 'text/plain'
  } as const
  
  // Cache Keys
  export const CACHE_KEYS = {
    PRODUCT_LIST: 'product_list',
    PRODUCT_DETAIL: 'product_detail',
    USER_PROFILE: 'user_profile',
    CATEGORY_LIST: 'category_list'
  } as const