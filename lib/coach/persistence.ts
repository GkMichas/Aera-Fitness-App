import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { CoachAction, CoachIntent, ContextDomain } from "@/types/coach";

export async function persistCoachExchange(input: {
  userId: string | null;
  conversationId?: string;
  userMessage: string;
  assistantMessage: string;
  intent: CoachIntent;
  provider: string;
  actions: CoachAction[];
  contextManifest: ContextDomain[];
}) {
  if (!hasSupabaseEnv() || !input.userId) return null;
  const supabase = await createClient();
  let conversationId = input.conversationId;
  if (conversationId) {
    const { data } = await supabase.from("coach_conversations").select("id").eq("id", conversationId).eq("user_id", input.userId).maybeSingle();
    if (!data) conversationId = undefined;
  }
  if (!conversationId) {
    const { data, error } = await supabase.from("coach_conversations").insert({ user_id: input.userId, title: input.userMessage.slice(0, 80), last_intent: input.intent }).select("id").single();
    if (error) throw error;
    conversationId = data.id;
  } else {
    await supabase.from("coach_conversations").update({ last_intent: input.intent, last_message_at: new Date().toISOString() }).eq("id", conversationId).eq("user_id", input.userId);
  }
  const { error } = await supabase.from("coach_messages").insert([
    { conversation_id: conversationId, user_id: input.userId, role: "user", content: input.userMessage, intent: input.intent, context_manifest: [] },
    { conversation_id: conversationId, user_id: input.userId, role: "assistant", content: input.assistantMessage, intent: input.intent, provider: input.provider, action_cards: input.actions, context_manifest: input.contextManifest },
  ]);
  if (error) throw error;
  return conversationId;
}
