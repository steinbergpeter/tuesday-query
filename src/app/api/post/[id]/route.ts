import { readOneHandler, updateHandler, deleteHandler } from '@/lib/handlers';
import { prisma } from '@/lib/prisma';
import {
  postInputSchema,
  postOutputSchema,
  postSelectSchema,
  postIncludeSchema,
} from '@/validation/post';

export const GET = readOneHandler({
  prismaModel: prisma.post,
  outputSchema: postOutputSchema,
  selectSchema: postSelectSchema,
  includeSchema: postIncludeSchema,
} as const);

export const PATCH = updateHandler({
  prismaModel: prisma.post,
  inputSchema: postInputSchema,
  outputSchema: postOutputSchema,
} as const);

export const DELETE = deleteHandler({
  prismaModel: prisma.post,
} as const);
