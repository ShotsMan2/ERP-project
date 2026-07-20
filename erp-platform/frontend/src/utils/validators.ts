import { z } from 'zod';

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(255, 'Email must not exceed 255 characters');

export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .max(128, 'Password must not exceed 128 characters');

export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s-()]{7,20}$/, 'Invalid phone number');

export const taxIdSchema = z
  .string()
  .min(5, 'Tax ID must be at least 5 characters')
  .max(20, 'Tax ID must not exceed 20 characters');

export const urlSchema = z.string().url('Invalid URL');

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(200, 'Name must not exceed 200 characters');

export const descriptionSchema = z
  .string()
  .max(1000, 'Description must not exceed 1000 characters')
  .optional();

export const priceSchema = z
  .number()
  .min(0, 'Price must be non-negative')
  .max(999999999.99, 'Price is too high');

export const quantitySchema = z
  .number()
  .int('Quantity must be an integer')
  .min(0, 'Quantity must be non-negative')
  .max(999999999, 'Quantity is too high');

export const percentageSchema = z
  .number()
  .min(0, 'Percentage must be non-negative')
  .max(100, 'Percentage must not exceed 100');

export const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

export const idSchema = z.string().uuid('Invalid ID format');

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const userSchema = z.object({
  name: nameSchema,
  surname: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  roleIds: z.array(z.string()).min(1, 'At least one role is required'),
  isActive: z.boolean().default(true),
});

export const employeeSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  departmentId: idSchema,
  jobTitle: nameSchema,
  hireDate: dateStringSchema,
  salary: priceSchema.optional(),
  reportsTo: z.string().optional(),
});
