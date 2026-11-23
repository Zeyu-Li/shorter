import { z } from "zod";

// `Url.url` is a MySQL VARCHAR(191) column (Prisma's default for `String`).
const MAX_URL_LENGTH = 191;

/**
 * An absolute http(s) URL that fits the `Url.url` column. Rejects everything
 * else, including `javascript:`/`data:` targets and Prisma filter objects.
 */
export const shortenableUrlSchema = z
  .url({ protocol: /^https?$/ })
  .max(MAX_URL_LENGTH);

export const isShortenableUrl = (value: string): boolean =>
  shortenableUrlSchema.safeParse(value).success;
