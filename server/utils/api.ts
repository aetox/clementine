import { ZodError } from "zod";

export function handleApiError(error: unknown) {
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
