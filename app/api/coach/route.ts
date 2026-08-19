import { NextResponse, type NextRequest } from "next/server";
import { runCoach } from "@/lib/coach/engine";
import { routeCoachIntent } from "@/lib/coach/intent-router";
import { loadCoachSnapshot, CoachAuthenticationError } from "@/lib/coach/context-source";
import { persistCoachExchange } from "@/lib/coach/persistence";
import { createCoachProvider } from "@/lib/coach/providers/factory";
import type { CoachMessage } from "@/types/coach";
import { rateLimit } from "@/lib/security/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const limit = rateLimit(request, "coach", 20, 60_000);
    if (!limit.allowed) return NextResponse.json({ error: "Too many Coach messages. Try again shortly." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds), "Cache-Control": "no-store" } });
    const body: unknown = await request.json();
    if (!isCoachRequest(body)) return NextResponse.json({ error: "Enter a message between 1 and 1,200 characters." }, { status: 400 });
    const message = body.message.trim();
    const history = sanitizeHistory(body.history);
    const intent = routeCoachIntent(message);
    const { snapshot, userId, isDemo } = await loadCoachSnapshot(intent);
    const result = await runCoach({ message, snapshot, recentMessages: history, provider: createCoachProvider() });
    const conversationId = await persistCoachExchange({
      userId,
      conversationId: body.conversationId,
      userMessage: message,
      assistantMessage: result.content,
      intent: result.intent,
      provider: result.provider,
      actions: result.actions,
      contextManifest: result.contextManifest,
    });
    return NextResponse.json({ ...result, conversationId, isDemo }, { headers: { "Cache-Control": "no-store", "X-RateLimit-Remaining": String(limit.remaining) } });
  } catch (error) {
    if (error instanceof CoachAuthenticationError) return NextResponse.json({ error: error.message }, { status: 401 });
    console.error("Coach request failed", error);
    return NextResponse.json({ error: "The Coach is unavailable right now. Your existing data has not been changed." }, { status: 503 });
  }
}

function isCoachRequest(value: unknown): value is { message: string; conversationId?: string; history?: unknown } {
  if (!value || typeof value !== "object" || !("message" in value) || typeof value.message !== "string") return false;
  const message = value.message.trim();
  if (!message || message.length > 1200) return false;
  if ("conversationId" in value && value.conversationId !== undefined && typeof value.conversationId !== "string") return false;
  return true;
}

function sanitizeHistory(value: unknown): Pick<CoachMessage, "role" | "content">[] {
  if (!Array.isArray(value)) return [];
  return value.slice(-8).flatMap((item): Pick<CoachMessage, "role" | "content">[] => {
    if (!item || typeof item !== "object" || !("role" in item) || !("content" in item)) return [];
    if ((item.role !== "user" && item.role !== "assistant") || typeof item.content !== "string") return [];
    return [{ role: item.role, content: item.content.slice(0, 1200) }];
  });
}
