import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export function formatError(error: unknown) {
  if (error instanceof ZodError) {
    return {
      status: 400,
      body: {
        error: 'Validation error',
        details: error.errors,
      },
    };
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return {
      status: 400,
      body: {
        error: 'Prisma error',
        code: error.code,
        message: error.message,
        meta: error.meta,
      },
    };
  }
  if (error instanceof Error) {
    return {
      status: 500,
      body: {
        error: error.name || 'Error',
        message: error.message,
      },
    };
  }
  return {
    status: 500,
    body: {
      error: 'Unknown error',
      details: error,
    },
  };
}
