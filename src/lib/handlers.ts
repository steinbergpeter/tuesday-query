// Generic REST handler utilities for Next.js API routes
import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema } from 'zod';
import { parsePrismaQueryParams } from '@/server/prismaQuery';
import { formatError } from '@/lib/formatError';

// Handler config interface
type HandlerConfig<
  TInput,
  TOutput,
  TWhere = any,
  TSelect = any,
  TInclude = any,
  TOrderBy = any
> = {
  prismaModel: any; // e.g., prisma.user or prisma.post
  inputSchema?: ZodSchema<TInput>;
  outputSchema?: ZodSchema<TOutput>;
  whereSchema?: ZodSchema<TWhere>;
  selectSchema?: ZodSchema<TSelect>;
  includeSchema?: ZodSchema<TInclude>;
  orderBySchema?: ZodSchema<TOrderBy>;
};

// Create (POST)
export function createHandler<TInput, TOutput>(
  config: HandlerConfig<TInput, TOutput>
) {
  return async function (req: NextRequest) {
    try {
      const data = await req.json();
      const parsed = config.inputSchema?.parse(data);
      const created = await config.prismaModel.create({ data: parsed });
      const output = config.outputSchema
        ? config.outputSchema.parse(created)
        : created;
      return NextResponse.json(output, { status: 201 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  };
}

export function readManyHandler<
  TOutput,
  TWhere = any,
  TSelect = any,
  TInclude = any,
  TOrderBy = any
>(config: HandlerConfig<any, TOutput, TWhere, TSelect, TInclude, TOrderBy>) {
  return async function (req: NextRequest) {
    try {
      // Parse and validate query params
      const { where, select, include, orderBy } = await parsePrismaQueryParams({
        req,
        whereSchema: config.whereSchema,
        selectSchema: config.selectSchema,
        includeSchema: config.includeSchema,
        orderBySchema: config.orderBySchema,
      });

      // Pagination
      const page = (where && (where as any).page) || 1;
      const limit = (where && (where as any).limit) || 10;
      const skip = (page - 1) * limit;
      const take = limit;

      // Remove page/limit from where before passing to Prisma
      if (where) {
        delete (where as any).page;
        delete (where as any).limit;
      }

      // Build Prisma query
      const prismaQuery: any = {
        where,
        select,
        include,
        orderBy,
        skip,
        take,
      };

      // Remove undefined keys
      Object.keys(prismaQuery).forEach(
        (key) => prismaQuery[key] === undefined && delete prismaQuery[key]
      );

      // Query
      const results = await config.prismaModel.findMany(prismaQuery);

      // Optionally get total count
      let totalCount = null;
      if (where && (where as any).includeTotalCount) {
        totalCount = await config.prismaModel.count({ where });
      }

      // Output validation
      const output = config.outputSchema
        ? results.map((r: any) => config.outputSchema!.parse(r))
        : results;

      // Response
      const response: any = {
        data: output,
        pagination: {
          page,
          limit,
          skip,
          take,
        },
      };
      if (totalCount !== null) {
        response.pagination.totalCount = totalCount;
        response.pagination.totalPages = Math.ceil(totalCount / limit);
      }

      return NextResponse.json(response);
    } catch (err: unknown) {
      const { status, body } = formatError(err);
      return NextResponse.json(body, { status });
    }
  };
}

// Read (GET one)
export function readOneHandler<TOutput>(config: HandlerConfig<any, TOutput>) {
  return async function (
    _req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const result = await config.prismaModel.findUnique({
        where: { id: params.id },
      });
      if (!result)
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      const output = config.outputSchema
        ? config.outputSchema.parse(result)
        : result;
      return NextResponse.json(output);
    } catch (err: unknown) {
      const { status, body } = formatError(err);
      return NextResponse.json(body, { status });
    }
  };
}

// Update (PATCH)
export function updateHandler<TInput, TOutput>(
  config: HandlerConfig<TInput, TOutput>
) {
  return async function (
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const data = await req.json();
      const parsed = config.inputSchema?.parse(data);
      const updated = await config.prismaModel.update({
        where: { id: params.id },
        data: parsed,
      });
      const output = config.outputSchema
        ? config.outputSchema.parse(updated)
        : updated;
      return NextResponse.json(output);
    } catch (err: unknown) {
      const { status, body } = formatError(err);
      return NextResponse.json(body, { status });
    }
  };
}

// Delete (DELETE)
export function deleteHandler(config: HandlerConfig<any, any>) {
  return async function (
    _req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      await config.prismaModel.delete({ where: { id: params.id } });
      return NextResponse.json({ success: true });
    } catch (err: unknown) {
      const { status, body } = formatError(err);
      return NextResponse.json(body, { status });
    }
  };
}

// TODO: Add query param parsing, advanced options, and better error formatting.
