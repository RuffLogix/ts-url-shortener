import { createClient } from "redis";

export const redis = createClient();

redis.on("error", (err) => {
  console.log("Redis error:", err);
});

export async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
}
