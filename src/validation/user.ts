import { z } from 'zod';
import { postOutputWithAuthorSchema } from './post';
import { baseQuerySchema, directionEnum } from './base';

// User input (create/update) schema
export const userInputSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export const userOutputSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  email: z.string().email(),
  name: z.string().nullable(),
});

// User output schema (with optional posts relation)
export const userOutputWithPostsSchema: z.ZodType<
  z.infer<typeof userOutputSchema> & {
    posts?: (z.infer<typeof postOutputWithAuthorSchema> | undefined)[];
  }
> = z.lazy(() =>
  userOutputSchema.extend({
    posts: z.array(postOutputWithAuthorSchema.optional()),
  })
);

// Query parameter schemas for Prisma options
// Advanced include: allow nested includes for posts
export const userIncludeSchema = z.object({
  posts: z
    .union([
      z.boolean(),
      z.object({
        author: z.boolean().optional(),
        // Add more nested includes as needed
      }),
    ])
    .optional(),
});

// Advanced where: allow nested where for posts
export const userWhereSchema = baseQuerySchema.extend({
  id: z.string().uuid().optional(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  posts: z
    .object({
      title: z.string().optional(),
      published: z.boolean().optional(),
      // Add more post fields as needed
    })
    .optional(),
  // Add more user-specific filters as needed
});
// Advanced select: allow specifying fields to return
export const userSelectSchema = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  name: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  posts: z
    .union([
      z.boolean(),
      z.object({
        id: z.boolean().optional(),
        title: z.boolean().optional(),
        // Add more post fields as needed
      }),
    ])
    .optional(),
  // Add more fields as needed
});

// Advanced orderBy: allow array for multi-field sort
export const userOrderBySchema = z.union([
  z.object({
    createdAt: directionEnum.optional(),
    updatedAt: directionEnum.optional(),
    email: directionEnum.optional(),
    name: directionEnum.optional(),
  }),
  z.array(
    z.object({
      createdAt: directionEnum.optional(),
      updatedAt: directionEnum.optional(),
      email: directionEnum.optional(),
      name: directionEnum.optional(),
    })
  ),
]);

export type UserInput = z.infer<typeof userInputSchema>;
export type UserOutput = z.infer<typeof userOutputSchema>;
export type UserInclude = z.infer<typeof userIncludeSchema>;
export type UserWhere = z.infer<typeof userWhereSchema>;
export type UserSelect = z.infer<typeof userSelectSchema>;
export type UserOrderBy = z.infer<typeof userOrderBySchema>;
