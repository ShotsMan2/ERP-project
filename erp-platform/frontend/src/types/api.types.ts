// Base Types
export interface BaseEntity {
  id: string; // UUID
  createdAt: string;
  updatedAt: string;
}

// User & Auth Types
export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isSuperuser: boolean;
  defaultBranchId?: string;
  roles: Role[];
}

export interface Role extends BaseEntity {
  name: string;
  description?: string;
  permissions: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Company & Tenant Types
export interface Company extends BaseEntity {
  name: string;
  taxId: string;
  isActive: boolean;
  settings: Record<string, any>;
}

export interface Branch extends BaseEntity {
  companyId: string;
  name: string;
  address: string;
}

// Utility Types for API Requests
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}
