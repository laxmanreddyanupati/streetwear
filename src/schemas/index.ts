import { z } from 'zod';

const name = z.string().trim().min(2, 'Enter at least 2 characters.').max(50, 'Keep this under 50 characters.');
const email = z.email('Enter a valid email address.').trim().toLowerCase();
const phone = z
  .string()
  .trim()
  .min(8, 'Enter a valid phone number.')
  .max(20, 'Keep this under 20 characters.')
  .regex(/^[+0-9 ()-]+$/, 'Use digits, spaces, brackets, + or - only.');

export const addressFieldsSchema = z.object({
  firstName: name,
  lastName: name,
  line1: z.string().trim().min(4, 'Enter a street address.').max(120),
  line2: z.string().trim().max(120).optional().or(z.literal('')),
  city: z.string().trim().min(2, 'Enter a city.').max(60),
  state: z.string().trim().min(2, 'Enter a state or region.').max(60),
  postalCode: z
    .string()
    .trim()
    .min(3, 'Enter a postal code.')
    .max(12, 'Postal code is too long.')
    .regex(/^[A-Za-z0-9 -]+$/, 'Use letters, numbers, spaces or hyphens.'),
  country: z.string().trim().min(2, 'Enter a country.').max(60),
  phone,
});

export const checkoutSchema = addressFieldsSchema.extend({
  email,
  shippingMethodId: z.enum(['standard', 'express']),
  promoCode: z.string().trim().max(30).optional().or(z.literal('')),
  notes: z.string().trim().max(300, 'Keep notes under 300 characters.').optional().or(z.literal('')),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const addressSchema = addressFieldsSchema.extend({
  label: z.string().trim().min(1, 'Add a label such as Home or Studio.').max(30),
  isDefault: z.boolean().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

export const loginSchema = z.object({
  email,
  password: z.string().min(8, 'Demo passwords must be at least 8 characters.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: name,
    lastName: name,
    email,
    password: z.string().min(8, 'Use at least 8 characters.'),
    confirmPassword: z.string().min(8, 'Confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({ email });

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const profileSchema = z.object({
  firstName: name,
  lastName: name,
  phone: z.string().trim().max(20).optional().or(z.literal('')),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const newsletterSchema = z.object({
  email,
  consent: z
    .boolean()
    .refine((value) => value, { message: 'Please confirm you want to receive emails.' }),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export const contactSchema = z.object({
  name: name,
  email,
  subject: z.string().trim().min(3, 'Add a short subject.').max(100),
  message: z.string().trim().min(10, 'Tell us a little more.').max(1500, 'Keep this under 1,500 characters.'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

const optionalNumber = z.preprocess(
  (value) => (value === '' || value === null || value === undefined ? undefined : Number(value)),
  z.number({ message: 'Enter a number.' }).min(0, 'Must be zero or more.').optional(),
);

export const adminProductSchema = z.object({
  name: z.string().trim().min(2, 'Product name is required.').max(100),
  slug: z
    .string()
    .trim()
    .max(100)
    .regex(/^[a-z0-9-]*$/, 'Use lowercase letters, numbers and hyphens.')
    .optional()
    .or(z.literal('')),
  subtitle: z.string().trim().min(2, 'Add a short subtitle.').max(120),
  description: z.string().trim().min(10, 'Add a description.').max(2000),
  categorySlug: z.string().min(1, 'Choose a category.'),
  priceRupees: z.coerce.number({ message: 'Enter a price.' }).min(1, 'Price must be positive.').max(1_000_000),
  compareAtRupees: optionalNumber,
  status: z.enum(['active', 'draft', 'archived']),
  badge: z.enum(['New', 'Bestseller', 'Limited', 'Almost gone']).optional().or(z.literal('')),
  materials: z.string().trim().max(300).optional().or(z.literal('')),
  care: z.string().trim().max(300).optional().or(z.literal('')),
});

export type AdminProductFormValues = z.infer<typeof adminProductSchema>;

export const adminCategorySchema = z.object({
  name: z.string().trim().min(2, 'Category name is required.').max(60),
  description: z.string().trim().max(300).optional().or(z.literal('')),
  imageUrl: z.string().trim().max(300).optional().or(z.literal('')),
});

export type AdminCategoryFormValues = z.infer<typeof adminCategorySchema>;

export const adminPromotionSchema = z.object({
  code: z.string().trim().min(2, 'Add a code.').max(30).regex(/^[A-Za-z0-9]+$/, 'Use letters and numbers only.'),
  description: z.string().trim().min(3, 'Add a description.').max(200),
  type: z.enum(['percentage', 'fixed', 'free_shipping']),
  value: z.coerce.number().min(0, 'Value cannot be negative.'),
  minSubtotalRupees: optionalNumber,
  active: z.boolean(),
});

export type AdminPromotionFormValues = z.infer<typeof adminPromotionSchema>;
