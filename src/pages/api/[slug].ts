import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import { isShortenableUrl } from "../../utils/url";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query;

  // check if slug
  if (!slug || typeof slug !== "string") {
    res.statusCode = 404;

    res.send(JSON.stringify({ message: "pls use with a slug" }));

    return;
  }

  const url = await prisma.url.findFirst({
    where: {
      slug: slug as string,
    },
  });
  // Never redirect to a stored non-http(s) target (e.g. `javascript:`), even if
  // one was saved before the create endpoint validated its input.
  if (url && isShortenableUrl(url.url)) {
    // cache
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=10000000, stale-while-revalidate");

    res.redirect(url.url);
  } else {
    res.status(404).json({ error: "Not found" });
  }
};
