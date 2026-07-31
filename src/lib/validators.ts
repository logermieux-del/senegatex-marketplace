import { z } from 'zod';

// Auth validators
export const signupSchema = z.object({
  email: z.string().email('Invalid email').toLowerCase(),
  name: z.string().min(2).max(100),
  password: z.string().min(8).max(128),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email').toLowerCase(),
  password: z.string(),
});

// Listing validators
export const createListingSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(5000),
  category: z.string().min(1),
  price: z.number().int().min(100), // Minimum 100 XOF
  city: z.string().min(1),
  region: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const updateListingSchema = createListingSchema.partial().extend({
  photos: z.array(z.string()).optional(),
});

// Message validators
export const createMessageSchema = z.object({
  toUserId: z.string().cuid(),
  listingId: z.string().cuid().optional(),
  body: z.string().min(1).max(5000),
});

// Review validators
export const createReviewSchema = z.object({
  toUserId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

// Report validators
export const createReportSchema = z.object({
  listingId: z.string().cuid(),
  reason: z.enum(['inappropriate', 'fraud', 'duplicate', 'contact_info', 'offensive']),
  description: z.string().min(10).max(1000),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateListingInput = z.infer<typeof createListingSchema>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CreateReportInput = z.infer<typeof createReportSchema>;
