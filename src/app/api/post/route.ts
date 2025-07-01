import { createHandler, readManyHandler } from '@/lib/handlers';
import { prisma } from '@/lib/prisma';
import {
  postIncludeSchema,
  postInputSchema,
  postOrderBySchema,
  postOutputSchema,
  postSelectSchema,
  postWhereSchema,
} from '@/validation/post';

export const GET = readManyHandler({
  prismaModel: prisma.post,
  outputSchema: postOutputSchema,
  whereSchema: postWhereSchema,
  selectSchema: postSelectSchema,
  includeSchema: postIncludeSchema,
  orderBySchema: postOrderBySchema,
} as const);

export const POST = createHandler({
  prismaModel: prisma.post,
  inputSchema: postInputSchema,
  outputSchema: postOutputSchema,
} as const);
