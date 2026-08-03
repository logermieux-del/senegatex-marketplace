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
  // Real estate only (category = "immobilier")
  transactionType: z.enum(['location', 'achat', 'vente']).optional(),
  propertyType: z.enum(['bati', 'non_bati']).optional(),
  surfaceM2: z.number().positive().optional(),
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

// Transporteur validators
export const transporterRegisterSchema = z.object({
  typeVehicule: z.enum(['moto', 'voiture', '3roues', 'camionnette']),
  plaqueImmatriculation: z.string().min(3).max(20).regex(/^[A-Z0-9\-\s]+$/, 'Invalid plate format'),
  regionsCouvertes: z.array(z.string().min(1)).min(1, 'Select at least one region'),
  tarifParZone: z.record(z.number().int().min(500)), // Min 500 XOF
  capaciteVolume: z.enum(['petit', 'moyen', 'gros']),
  accepteConditions: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms of service' }),
  }),
});

export const transporterUpdateSchema = transporterRegisterSchema.partial().extend({
  bio: z.string().max(500).optional(),
  region: z.string().optional(),
  arrondissement: z.string().optional(),
  pointRetrait: z.string().optional(),
});

export const livraisonRatingSchema = z.object({
  punctualite: z.number().int().min(1).max(5),
  etatProduit: z.number().int().min(1).max(5),
  communication: z.number().int().min(1).max(5),
  professionalisme: z.number().int().min(1).max(5),
  commentaire: z.string().max(1000).optional(),
});

export const disputeSchema = z.object({
  raison: z.enum(['produit_casse', 'non_recu', 'retard', 'autre']),
  description: z.string().min(10).max(1000),
  preuves: z.array(z.string()).optional(),
});

export type TransporterRegisterInput = z.infer<typeof transporterRegisterSchema>;
export type TransporterUpdateInput = z.infer<typeof transporterUpdateSchema>;
export type LivraisonRatingInput = z.infer<typeof livraisonRatingSchema>;
export type DisputeInput = z.infer<typeof disputeSchema>;
