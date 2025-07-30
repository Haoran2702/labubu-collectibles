// API URL configuration for development and production
const getApiUrl = () => {
  // Check if we're in production (Vercel)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // In production, use relative URLs for same-origin requests
    return '';
  }
  
  // In development, use localhost
  return 'http://localhost:3001';
};

export const API_BASE = getApiUrl();

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string): string => {
  const base = API_BASE;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  PROFILE: '/api/auth/profile',
  VERIFY_EMAIL: '/api/auth/verify-email',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  CHANGE_PASSWORD: '/api/auth/change-password',
  
  // Products
  PRODUCTS: '/api/products',
  PRODUCT_BY_ID: (id: string) => `/api/products/${id}`,
  CHECK_STOCK: '/api/products/check-stock',
  RESERVE_STOCK: '/api/products/reserve-stock',
  
  // Orders
  ORDERS: '/api/orders',
  ORDER_BY_ID: (id: string) => `/api/orders/${id}`,
  CANCEL_ORDER: (id: string) => `/api/orders/${id}/cancel`,
  RETURN_REQUEST: (id: string) => `/api/orders/${id}/return-request`,
  
  // Payments
  CREATE_PAYMENT_INTENT: '/api/payments/create-payment-intent',
  CONFIRM_PAYMENT: '/api/payments/confirm-payment',
  PAYPAL_CAPTURE: '/api/payments/paypal-capture',
  
  // Support
  SUPPORT: '/api/support',
  SUPPORT_BY_ID: (id: string) => `/api/support/${id}`,
  SUPPORT_REPLY: (id: string) => `/api/support/${id}/reply`,
  SUPPORT_STATUS: (id: string) => `/api/support/${id}/status`,
  
  // Reviews
  REVIEWS: '/api/reviews',
  REVIEWS_BY_PRODUCT: (productId: string) => `/api/reviews/products/${productId}`,
  REVIEW_STATS: (productId: string) => `/api/reviews/products/${productId}/stats`,
  REVIEW_HELPFUL: (reviewId: string) => `/api/reviews/${reviewId}/helpful`,
  
  // Admin
  ADMIN_ORDERS: '/api/admin/orders',
  ADMIN_USERS: '/api/admin/users',
  ADMIN_ANALYTICS: '/api/analytics',
  ADMIN_FORECASTING: '/api/forecasting',
  ADMIN_MARKETING: '/api/marketing',
  ADMIN_SECURITY: '/api/fraud/stats',
  
  // Email
  EMAIL_SIGNUP: '/api/email-signup',
  
  // Privacy
  PRIVACY_DATA_RIGHTS: '/api/privacy/data-rights',
  
  // Currency
  CURRENCY_CONVERT: '/api/currency/convert',
}; 