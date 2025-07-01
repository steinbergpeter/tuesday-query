import { ZodSchema } from 'zod';

/**
 * Parses and validates Prisma query params from a Next.js request.
 * Accepts query params (for GET) or body (for POST) as JSON strings.
 * Returns a Prisma-ready object: { where, select, include, orderBy }
 */
export async function parsePrismaQueryParams({
  req,
  whereSchema,
  selectSchema,
  includeSchema,
  orderBySchema,
}: {
  req: Request;
  whereSchema?: ZodSchema<any>;
  selectSchema?: ZodSchema<any>;
  includeSchema?: ZodSchema<any>;
  orderBySchema?: ZodSchema<any>;
}) {
  let params: any = {};
  if (req.method === 'GET') {
    const url = new URL(req.url!);
    params = Object.fromEntries(url.searchParams.entries());
  } else {
    try {
      params = await req.json();
    } catch {
      params = {};
    }
  }

  function parseParam<T>(key: string, schema?: ZodSchema<T>) {
    if (!schema) return undefined;
    if (!(key in params)) return undefined;
    try {
      // Accept both JSON string and object
      const value =
        typeof params[key] === 'string' ? JSON.parse(params[key]) : params[key];
      return schema.parse(value);
    } catch {
      return undefined;
    }
  }

  return {
    where: parseParam('where', whereSchema),
    select: parseParam('select', selectSchema),
    include: parseParam('include', includeSchema),
    orderBy: parseParam('orderBy', orderBySchema),
  };
}
