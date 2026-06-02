// Re-export utilities here
export * from './api';

export const APP_VERSION = '1.0.0';
export const API_TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '30000');
