import type { NextRequest } from "next/server";

interface Bucket { count: number; resetsAt: number }
const buckets = new Map<string, Bucket>();

export function rateLimit(request: NextRequest, namespace: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 5_000) for (const [key, bucket] of buckets) if (bucket.resetsAt <= now) buckets.delete(key);
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const identity = forwarded || request.headers.get("x-real-ip") || "local";
  const key = `${namespace}:${identity}`;
  const current = buckets.get(key);
  const bucket = !current || current.resetsAt <= now ? { count: 0, resetsAt: now + windowMs } : current;
  bucket.count += 1;
  buckets.set(key, bucket);
  return { allowed: bucket.count <= limit, remaining: Math.max(0, limit - bucket.count), retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetsAt - now) / 1000)) };
}
