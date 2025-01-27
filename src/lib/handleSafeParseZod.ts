import { z } from 'zod';

export const handleSafeParseZod = <T>(error: z.SafeParseError<T>) =>
  new Error(
    error.error.issues
      .map((e) => `${e.path}: ${e.code} - ${e.message}`)
      .join('; '),
  );
