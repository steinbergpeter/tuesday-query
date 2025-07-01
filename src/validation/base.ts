import { z } from 'zod';

export const truthEnum = z
  .enum(['true', 'false'])
  .default('false')
  .transform((val) => val === 'true');

export const directionEnum = z.enum(['asc', 'desc']);

export const baseQuerySchema = z.object({
  select: z.string().optional(),
  include: z.string().optional(),
  distinct: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
  cursor: z.string().optional(),
  orderBy: z.string().optional(),
  orderDir: directionEnum.optional(),
  includeTotalCount: truthEnum,
  and: z.string().optional(),
  or: z.string().optional(),
});

// Patch: allow page/limit/includeTotalCount to be number | undefined | boolean | undefined
// This matches Zod's default inference for optional+default+transform fields
export type PatchedBaseQuery = {
  page?: number;
  limit?: number;
  includeTotalCount?: boolean;
};
