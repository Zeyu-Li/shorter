import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "../../../server/db/client";
import { shortenableUrlSchema } from "../../../utils/url";
import { randomBytes } from "crypto";

const createUrlBody = z.object({ url: shortenableUrlSchema });

const create = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = createUrlBody.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ error: "A valid http(s) URL is required" });
  }
  const { url } = body.data;

  try {
    const existing = await prisma.url.findFirst({ where: { url } });
    if (existing) {
      return res.status(200).json(existing);
    }
    const createdUrl = await prisma.url.create({
      data: {
        url,
        slug: randomBytes(4).toString("hex"),
      },
    });
    res.status(200).json(createdUrl);
  } catch {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default create;
