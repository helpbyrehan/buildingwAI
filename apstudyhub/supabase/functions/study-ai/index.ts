import { createClient } from "npm:@supabase/supabase-js@2";

const MAX_CONTENT_LENGTH = 12_000;

function corsHeaders(request: Request) {
  const origin = request.headers.get("Origin") || "*";
  const configured = (Deno.env.get("SITE_ORIGINS") || "*")
    .split(",")
    .map((value) => value.trim().replace(/\/$/, ""))
    .filter(Boolean);
  const allowed = configured.includes("*") || configured.includes(origin.replace(/\/$/, ""));
  return {
    allowed,
    headers: {
      "Access-Control-Allow-Origin": configured.includes("*") ? "*" : origin,
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Vary": "Origin",
    },
  };
}

function json(request: Request, body: unknown, status = 200) {
  const cors = corsHeaders(request);
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors.headers, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function normalizeWorkerUrl(value: string) {
  const base = value.trim().replace(/\/$/, "");
  return base.endsWith("/v1/generate") ? base : `${base}/v1/generate`;
}

Deno.serve(async (request) => {
  const cors = corsHeaders(request);
  if (request.method === "OPTIONS") {
    return new Response(null, { status: cors.allowed ? 204 : 403, headers: cors.headers });
  }
  if (!cors.allowed) return json(request, { detail: "This website origin is not allowed." }, 403);
  if (request.method !== "POST") return json(request, { detail: "Method not allowed." }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  const workerUrl = Deno.env.get("STUDY_AI_WORKER_URL") || "";
  const workerKey = Deno.env.get("STUDY_AI_API_KEY") || "";
  if (!supabaseUrl || !supabaseAnonKey || !workerUrl || !workerKey) {
    return json(request, { detail: "Study AI has not been fully configured." }, 503);
  }

  const authorization = request.headers.get("Authorization") || "";
  if (!authorization.startsWith("Bearer ")) {
    return json(request, { detail: "Log in to use Study AI." }, 401);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const token = authorization.slice(7);
  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData.user) return json(request, { detail: "Your session has expired. Please log in again." }, 401);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json(request, { detail: "Request body must be valid JSON." }, 400);
  }

  const mode = typeof body.mode === "string" ? body.mode : "";
  const course = typeof body.course === "string" ? body.course.trim() : "General";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const rawOptions = body.options && typeof body.options === "object" ? body.options as Record<string, unknown> : {};
  const difficulty = ["easy", "medium", "hard"].includes(String(rawOptions.difficulty))
    ? String(rawOptions.difficulty)
    : "medium";

  if (!["summary", "quiz", "flashcards"].includes(mode)) {
    return json(request, { detail: "Choose summary, quiz, or flashcards." }, 422);
  }
  if (!course || course.length > 120) return json(request, { detail: "Course must contain 1 to 120 characters." }, 422);
  if (content.length < 40 || content.length > MAX_CONTENT_LENGTH) {
    return json(request, { detail: "Notes must contain 40 to 12,000 characters." }, 422);
  }

  const rawCount = Number(rawOptions.count);
  const countLimit = mode === "quiz" ? 10 : mode === "flashcards" ? 20 : 10;
  const count = Math.max(1, Math.min(Number.isInteger(rawCount) ? rawCount : 5, countLimit));
  const rawSentences = Number(rawOptions.max_summary_sentences);
  const maxSummarySentences = Math.max(2, Math.min(Number.isInteger(rawSentences) ? rawSentences : 5, 10));

  const { data: usage, error: usageError } = await supabase.rpc("consume_study_ai_request");
  if (usageError) {
    const limitReached = /daily ai limit reached/i.test(usageError.message || "");
    return json(
      request,
      { detail: limitReached ? "You have used today’s five Study AI generations. Try again after the daily reset." : "Could not verify your daily AI allowance." },
      limitReached ? 429 : 503,
    );
  }

  try {
    const response = await fetch(normalizeWorkerUrl(workerUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": workerKey },
      body: JSON.stringify({
        mode,
        course,
        content,
        options: { difficulty, count, max_summary_sentences: maxSummarySentences },
      }),
      signal: AbortSignal.timeout(90_000),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result) {
      console.error("Study AI Worker failed", { status: response.status, requestId: result?.request_id || null });
      return json(request, { detail: response.status === 429 ? "Study AI’s free daily capacity has been reached. Try again tomorrow." : "Study AI could not complete this request. Please try again." }, response.status === 429 ? 429 : 502);
    }
    return json(request, { ...result, usage });
  } catch (error) {
    console.error("Study AI request failed", { error: String(error) });
    return json(request, { detail: "Study AI is temporarily unavailable. Please try again." }, 502);
  }
});

