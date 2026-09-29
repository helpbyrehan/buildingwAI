const { randomUUID } = require('node:crypto');
const { isRecord } = require('../server/validate');
const { generateStudyAid } = require('../server/study-engine');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const send = (status, detail) => res.status(status).json({detail});
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(405, 'Method not allowed.'); }
  const env = process.env;
  const required = ['SUPABASE_URL','SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY','CLOUDFLARE_ACCOUNT_ID','CLOUDFLARE_API_TOKEN'];
  if (required.some(key => !env[key])) return send(503, 'Study AI is not configured. Ask the site owner to check Vercel environment variables.');
  const authorization = req.headers.authorization || '';
  if (!/^Bearer \S+$/.test(authorization)) return send(401, 'Log in to use Study AI.');
  let body = req.body;
  try { if (typeof body === 'string') body = JSON.parse(body); } catch { return send(400, 'Request body must be valid JSON.'); }
  if (!isRecord(body)) return send(400, 'Request body must be a JSON object.');
  if (Buffer.byteLength(JSON.stringify(body)) > 64000) return send(413, 'Request is too large.');
  const {mode} = body;
  const course = typeof body.course === 'string' ? body.course.trim() : 'General';
  const content = typeof body.content === 'string' ? body.content.trim() : '';
  if (!['summary','quiz','flashcards'].includes(mode)) return send(422, 'Choose summary, quiz, or flashcards.');
  if (!course || course.length > 120 || content.length < 40 || content.length > 12000) return send(422, 'Use a course of 1–120 characters and notes of 40–12,000 characters.');
  const options = isRecord(body.options) ? body.options : {};
  const bounded = (v, min, max, fallback) => Math.max(min, Math.min(Number.isInteger(Number(v)) ? Number(v) : fallback, max));
  const count = bounded(options.count, 1, mode === 'flashcards' ? 20 : 10, 5);
  const sentences = bounded(options.max_summary_sentences, 2, 10, 5);
  const difficulty = ['easy','medium','hard'].includes(options.difficulty) ? options.difficulty : 'medium';
  const supabase = env.SUPABASE_URL.replace(/\/$/, '');
  const requestId = randomUUID();
  let reserved = false;
  async function rpc(name, args) {
    const response = await fetch(`${supabase}/rest/v1/rpc/${name}`, {
      method:'POST', headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,Authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify(args), signal:AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error('quota');
    return response.json();
  }
  try {
    const auth = await fetch(`${supabase}/auth/v1/user`, {headers:{apikey:env.SUPABASE_ANON_KEY,Authorization:authorization},signal:AbortSignal.timeout(8000)});
    if (!auth.ok) return send(auth.status >= 500 ? 503 : 401, 'Could not verify your login. Please try again or log in again.');
    const user = await auth.json();
    if (!user.id) return send(401, 'Please log in again.');
    const usage = await rpc('vercel_reserve_study_ai', {target_user_id:user.id,request_id:requestId});
    if (!usage.allowed) return send(429, 'You have used today’s five Study AI generations. Try again after the daily reset.');
    reserved = true;
    const generated = await generateStudyAid(env, {mode, course, content, difficulty}, count, sentences);
    res.setHeader('X-Request-ID', requestId);
    return res.status(200).json({...generated, usage:{remaining:usage.remaining}, request_id:requestId});
  } catch (error) {
    if (reserved) {
      try { await rpc('vercel_refund_study_ai', {request_id:requestId}); }
      catch { console.error('Study AI refund failed', {requestId}); }
    }
    console.error('Study AI request failed', {requestId,kind:error.message === 'quota' ? 'quota' : 'upstream'});
    return send(error.message === 'quota' ? 503 : 502, error.message === 'quota'
      ? 'Could not verify your daily allowance. Ask the site owner to run supabase/vercel-study-ai.sql.'
      : 'Study AI is temporarily unavailable. Please try again.');
  }
};
