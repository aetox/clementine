import { ZodError } from "zod";
import { H3Error } from "h3";

export function handleApiError(error: unknown) {
  if (error instanceof H3Error) {
    throw error;
  }

  if (error instanceof ZodError) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation error",
      data: error.flatten(),
    });
  }

  if (error instanceof Error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  throw createError({
    statusCode: 500,
    statusMessage: "Unexpected server error",
  });
}
