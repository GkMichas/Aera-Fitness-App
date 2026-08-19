const jsonHeaders = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };

function json(value, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: jsonHeaders });
}

async function asset(env, request, pathname, contentType) {
  const url = new URL(pathname, request.url);
  const response = await env.ASSETS.fetch(new Request(url, { method: "GET", headers: request.headers }));
  if (!contentType || !response.ok) return response;
  const headers = new Headers(response.headers);
  headers.set("content-type", contentType);
  return new Response(response.body, { status: response.status, headers });
}

function coachResponse(message) {
  const text = message.toLowerCase();
  if (text.includes("eat") || text.includes("food") || text.includes("nutrition")) {
    return { intent: "nutrition", content: "Choose a balanced meal with a lean protein source, vegetables and a carbohydrate portion that matches your activity today. Your Nutrition plan has ready-to-use examples.", actions: [{ kind: "open_meal_plan", label: "Open meal plan", href: "/nutrition/plan" }] };
  }
  if (text.includes("sleep") || text.includes("tired") || text.includes("sore") || text.includes("recover")) {
    return { intent: "recovery", content: "Keep today flexible: reduce intensity, prioritise technique and stop if your performance or symptoms worsen. A short walk and an earlier bedtime may be more useful than forcing a hard session.", actions: [{ kind: "recovery_tips", label: "Review recovery", href: "/weekly-review" }] };
  }
  return { intent: "training", content: "Your next planned session is ready. Start with the warm-up, keep two controlled repetitions in reserve and adjust the load if your form changes.", actions: [{ kind: "view_workout", label: "View workout", href: "/training/workout" }] };
}

function healthAssessment(body) {
  const emergency = Array.isArray(body.emergencyFlags) && body.emergencyFlags.length > 0;
  const urgent = !emergency && (Number(body.severity) >= 8 || body.weakness || body.worsening || (body.injury && body.swelling));
  const urgency = emergency ? "emergency" : urgent ? "urgent" : "routine";
  return {
    urgency,
    title: emergency ? "Get emergency help now" : urgent ? "Seek prompt professional assessment" : "Monitor and adjust activity",
    summary: emergency ? "One or more emergency warning signs were selected. Do not wait for an online assessment." : urgent ? "Your answers include features that should be assessed promptly by a qualified healthcare professional." : "No emergency warning sign was selected. This does not rule out injury or illness.",
    generalGuidance: emergency ? ["Call local emergency services now.", "Do not drive yourself if you feel faint or seriously unwell."] : ["Pause activities that clearly worsen symptoms.", "Use gentle, pain-free movement only if comfortable.", "Seek professional help if symptoms persist or worsen."],
    escalation: emergency ? "In the EU, call 112 now." : urgent ? "Arrange same-day or prompt medical advice." : "Book a routine assessment if this is not improving.",
    uncertainty: "AERA cannot examine you or provide a diagnosis. When unsure, choose the safer level of care.",
    matchedRuleIds: emergency ? ["emergency-red-flag"] : urgent ? ["prompt-review"] : ["routine-monitor"],
    rulesVersion: "aera-safety-v1",
    sources: [{ label: "European emergency number 112", url: "https://digital-strategy.ec.europa.eu/en/policies/112" }],
  };
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/") return Response.redirect(new URL("/home", url), 302);

    if (request.method === "POST" && url.pathname === "/api/coach") {
      const body = await request.json().catch(() => ({}));
      const message = typeof body.message === "string" ? body.message.trim() : "";
      if (!message) return json({ error: "Enter a message." }, 400);
      const answer = coachResponse(message);
      return json({ ...answer, conversationId: null, isDemo: true });
    }

    if (request.method === "POST" && url.pathname === "/api/health/assess") {
      const body = await request.json().catch(() => ({}));
      return json({ assessment: healthAssessment(body), eventId: null, isDemo: true });
    }

    if (url.pathname === "/_next/image") {
      const source = url.searchParams.get("url");
      if (source?.startsWith("/")) return asset(env, request, source);
      return new Response("Image not found", { status: 404 });
    }

    if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method not allowed", { status: 405 });
    if (url.pathname.startsWith("/_next/") || /\.[a-z0-9]{2,5}$/i.test(url.pathname)) return asset(env, request, url.pathname);

    const cleanPath = url.pathname.replace(/\/+$/, "").replace(/\.\./g, "") || "/home";
    let response = await asset(env, request, `${cleanPath}/index.html`, "text/html; charset=utf-8");
    if (response.status === 404) response = await asset(env, request, "/home/index.html", "text/html; charset=utf-8");
    return response;
  },
};

export default worker;
