export const Permissions = {
  // Auth & Users
  USERS_READ: 'users.read',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',

  // Roles
  ROLES_READ: 'roles.read',
  ROLES_CREATE: 'roles.create',
  ROLES_UPDATE: 'roles.update',
  ROLES_DELETE: 'roles.delete',

  // Employees
  EMPLOYEES_READ: 'employees.read',
  EMPLOYEES_CREATE: 'employees.create',
  EMPLOYEES_UPDATE: 'employees.update',
  EMPLOYEES_DELETE: 'employees.delete',

  // Products
  PRODUCTS_READ: 'products.read',
  PRODUCTS_CREATE: 'products.create',
  PRODUCTS_UPDATE: 'products.update',
  PRODUCTS_DELETE: 'products.delete',

  // Inventory
  INVENTORY_READ: 'inventory.read',
  INVENTORY_UPDATE: 'inventory.update',
  INVENTORY_CREATE: 'inventory.create',

  // Purchasing
  PURCHASING_READ: 'purchasing.read',
  PURCHASING_CREATE: 'purchasing.create',
  PURCHASING_UPDATE: 'purchasing.update',
  PURCHASING_APPROVE: 'purchasing.approve',
  PURCHASING_RECEIVE: 'purchasing.receive',

  // Sales
  SALES_READ: 'sales.read',
  SALES_CREATE: 'sales.create',
  SALES_UPDATE: 'sales.update',
  SALES_APPROVE: 'sales.approve',
  SALES_SHIP: 'sales.ship',

  // CRM
  CRM_READ: 'crm.read',
  CRM_CREATE: 'crm.create',
  CRM_UPDATE: 'crm.update',

  // Accounting
  ACCOUNTING_READ: 'accounting.read',
  ACCOUNTING_CREATE: 'accounting.create',
  ACCOUNTING_POST: 'accounting.post',

  // Projects
  PROJECTS_READ: 'projects.read',
  PROJECTS_CREATE: 'projects.create',
  PROJECTS_UPDATE: 'projects.update',

  // Reports
  REPORTS_READ: 'reports.read',
  REPORTS_CREATE: 'reports.create',

  // Notifications
  NOTIFICATIONS_READ: 'notifications.read',
  NOTIFICATIONS_UPDATE: 'notifications.update',

  // Audit
  AUDIT_READ: 'audit.read',

  // Documents
  DOCUMENTS_CREATE: 'documents.create',

  // Search
  SEARCH: 'search',
} as const;

export const PermissionActions = ['read', 'create', 'update', 'delete', 'approve', 'ship', 'receive', 'post'] as const;

export type PermissionAction = typeof PermissionActions[number];

export type PermissionKey = keyof typeof Permissions;

export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  return userPermissions.includes(requiredPermission);
}

export function hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.some((p) => userPermissions.includes(p));
}

export function hasAllPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.every((p) => userPermissions.includes(p));
}
