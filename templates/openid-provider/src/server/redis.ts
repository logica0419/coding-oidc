import Redis from "ioredis";

let client: Redis | undefined;

export function getRedis(): Redis {
  if (client === undefined) {
    client = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
      maxRetriesPerRequest: 3,
    });
  }
  return client;
}
