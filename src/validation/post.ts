import { z } from 'zod';
import { baseQuerySchema, directionEnum } from './base';
import { userOutputWithPostsSchema } from './user';

// Post input (create/update) schema
export const postInputSchema = z.object({
  title: z.string(),
  content: z.string(),
  published: z.boolean().optional(),
  authorId: z.string().uuid(),
});

// Post output schema (with optional author relation)
export const postOutputSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
  authorId: z.string().uuid(),
});

export const postOutputWithAuthorSchema: z.ZodType<
  z.infer<typeof postOutputSchema> & {
    author?: z.infer<typeof userOutputWithPostsSchema>;
  }
> = z.lazy(() =>
  postOutputSchema.extend({ author: userOutputWithPostsSchema.optional() })
);

// Query parameter schemas for Prisma options
// Advanced include: allow nested includes for author
export const postIncludeSchema = z.object({
  author: z
    .union([
      z.boolean(),
      z.object({
        posts: z.boolean().optional(),
        // Add more nested includes as needed
      }),
    ])
    .optional(),
});

// Advanced where: allow nested where for author
export const postWhereSchema: z.ZodSchema<any> = baseQuerySchema
  .extend({
    id: z.string().uuid().optional(),
    title: z.string().optional(),
    published: z.boolean().optional(),
    authorId: z.string().uuid().optional(),
    author: z
      .object({
        email: z.string().email().optional(),
        // Add more author fields as needed
      })
      .optional(),
    // Add more post-specific filters as needed
  })
  .strict();

// Advanced select: allow specifying fields to return
export const postSelectSchema = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  content: z.boolean().optional(),
  published: z.boolean().optional(),
  author: z
    .union([
      z.boolean(),
      z.object({
        id: z.boolean().optional(),
        email: z.boolean().optional(),
        // Add more author fields as needed
      }),
    ])
    .optional(),
  // Add more fields as needed
});

// Advanced orderBy: allow array for multi-field sort
export const postOrderBySchema = z.union([
  z.object({
    createdAt: directionEnum.optional(),
    updatedAt: directionEnum.optional(),
    title: directionEnum.optional(),
    published: directionEnum.optional(),
  }),
  z.array(
    z.object({
      createdAt: directionEnum.optional(),
      updatedAt: directionEnum.optional(),
      title: directionEnum.optional(),
      published: directionEnum.optional(),
    })
  ),
]);

export type PostInput = z.infer<typeof postInputSchema>;
export type PostOutput = z.infer<typeof postOutputSchema>;
export type PostInclude = z.infer<typeof postIncludeSchema>;
export type PostWhere = z.infer<typeof postWhereSchema>;
export type PostSelect = z.infer<typeof postSelectSchema>;
export type PostOrderBy = z.infer<typeof postOrderBySchema>;
