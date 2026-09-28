// Standard response envelope returned by the Express backend.
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export * from './user';
export * from './lead';
export * from './contact';
export * from './company';
export * from './deal';
export * from './task';
export * from './notification';
