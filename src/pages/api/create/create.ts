// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";
import { randomBytes } from "crypto";

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    // return error
    return res.status(405).json({ error: "Method not allowed" });
  } else if (req.method === "POST") {
    try {
      const existing = await prisma.url.findFirst({
        where: {
          url: req.body.url,
        },
      });
      if (existing) {
        return res.status(200).json(existing);
      }
      const createdUrl = await prisma.url.create({
        data: {
          url: req.body.url,
          slug: randomBytes(4).toString("hex"),
        },
      });
      res.status(200).json(createdUrl);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
};

export default create;
