import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { connectRedis, redis } from "./redis.js";
import { generateRandomURL } from "./utils.js";

const PORT = 3000;
const WINDOW_SECONDS = 60;

async function main() {
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  await connectRedis();

  app.post("/", (req: Request, res: Response) => {
    const { url } = req.body;
    const shortUrl = generateRandomURL(12);

    if (!url) {
      return res.status(401).json({ error: "Missing url" });
    }

    redis.hSetEx("urlMap", [shortUrl, url], {
      expiration: {
        type: "EX",
        value: WINDOW_SECONDS,
      },
    });

    return res.status(200).json({
      shortUrl,
    });
  });

  app.get("/:shortUrl", async (req: Request, res: Response) => {
    const { shortUrl } = req.params;
    const value = await redis.HGET("urlMap", shortUrl as string);

    if (!value) {
      return res.status(404).json({
        error: "URL Not Found",
      });
    }

    res.status(200).redirect(value);
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch(console.error);
