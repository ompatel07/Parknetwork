import "server-only";

/**
 * Basic rate limiting: by default 5 attempts per 10 minutes per key (IP).
 * Uses Upstash Redis when configured (shared across serverless instances),
 * otherwise an in-memory map (per instance — fine for low traffic).
 */
const memory = new Map<string, { count: number; reset: number }>();

export async function rateLimit(key: string, MAX = 5, WINDOW_S = 600): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      const res = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify([
          ["INCR", `rl:${key}`],
          ["EXPIRE", `rl:${key}`, WINDOW_S, "NX"],
        ]),
        cache: "no-store",
      });
      const data = (await res.json()) as { result: number }[];
      return (data[0]?.result ?? 0) <= MAX;
    } catch {
      // fall through to memory if Redis is unreachable
    }
  }

  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.reset < now) {
    memory.set(key, { count: 1, reset: now + WINDOW_S * 1000 });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX;
}
