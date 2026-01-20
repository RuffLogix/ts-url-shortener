import { NextFunction, Request, Response } from "express";
import { redis } from "./redis.js";
import { MAX_REQUESTS, WINDOW_SECONDS } from "./constant.js";

export async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const ip = req.ip;
  const key = `rate-limit:api:${ip}`;
  const tx = redis.multi();

  tx.incr(key);
  tx.ttl(key);

  const [request, ttl] = (await tx.exec()) as unknown as [number, number];

  if (request == 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }

  res.setHeader("X-RateLimit-Limit", MAX_REQUESTS.toString());
  res.setHeader(
    "X-RateLimit-Remaining",
    Math.max(0, MAX_REQUESTS - request).toString(),
  );
  res.setHeader("X-RateLimit-Reset", ttl.toString());

  if (request > MAX_REQUESTS) {
    return res.status(429).json({
      error: "Too many requests Try again later.",
    });
  }

  next();
}
