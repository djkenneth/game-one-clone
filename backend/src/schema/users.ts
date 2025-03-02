// src/schema/users.ts

import { z } from 'zod';
import { t } from 'elysia';

export const SignUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  defaultShippingAddress: z.number().optional(),
  defaultBillingAddress: z.number().optional(),
});

export const ProfileSchema = z.object({
  firstName: z.string(),
  middleName: z.string().nullable(),
  lastName: z.string(),
  birthDate: z.string(),
  age: z.number(),
  profilePicture: z.string().nullable(),
});

// Response Types
export const AddressType = t.Object({
  lineOne: t.String(),
  lineTwo: t.Optional(t.String()),
  city: t.String(),
  country: t.String(),
  pincode: t.String(),
});

export const ProfileInputSchema = t.Object({
  firstName: t.String(),
  middleName: t.Optional(t.String()),
  lastName: t.String(),
  birthDate: t.String(),
  age: t.String(),
  profilePicture: t.Optional(t.String()),
});

export const ProfileResponseType = t.Object({
  id: t.Number(),
  firstName: t.String(),
  middleName: t.Optional(t.String()),
  lastName: t.String(),
  birthDate: t.String(),
  age: t.Number(),
  profilePicture: t.Optional(t.String()),
});

export const UpdateUsersType = t.Object({
  name: t.Optional(t.String()),
  defaultShippingAddress: t.Optional(t.String()),
  defaultBillingAddress: t.Optional(t.String()),
});
