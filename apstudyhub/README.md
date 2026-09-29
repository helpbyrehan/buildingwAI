# AP Study Hub — Vercel deployment

This package preserves the supplied HTML, CSS, navigation and Supabase-backed features. The Study AI browser now calls `POST /api/study-ai` on the same website. Vercel verifies the Supabase session, reserves the daily allowance, builds the AI prompt, calls the model, validates output, retries malformed output once and refunds failed requests. Supabase retains auth/database/storage. Cloudflare Workers AI supplies model inference through its REST API; **no separate Cloudflare Worker or Supabase Edge Function is needed**. No autonomous action-taking agent was present in the supplied site.

## Setup

1. Extract the ZIP. Upload the **contents** of `apstudyhub` to a GitHub repository (so `package.json`, `vercel.json`, `api/`, and `index.html` are at the repository root). Do not upload credentials or `.env.local`.
2. In your existing Supabase project's SQL Editor, run `supabase/vercel-study-ai.sql`. It adds isolated quota tables/functions; it does not replace your existing app schema. Only the server service role can reserve/refund usage. Five generations per user per UTC day; refunds are idempotent and apply to the original day.
3. In Vercel, Add New Project → import that GitHub repository. Choose **Other** as the framework, Node **24.x**, build command `npm run build`, output directory `public`. The included configuration sets these build/output settings and a 120-second maximum function duration. If uploading the containing folder to GitHub, set Vercel's Root Directory to `apstudyhub`.
4. Add the environment variables below to Vercel (Production and any Preview/Development environments you use), then deploy. Redeploy after changing variables.
5. In Supabase → Authentication → URL Configuration, set Site URL to your Vercel production URL and add the exact URLs used for login/password reset redirects. If using preview deployments, add only trusted preview URLs. Test login and password recovery on the deployed domain.
6. Log in and try summary, quiz and flashcards. Check Vercel function logs if generation fails. Once this works, the old Supabase `study-ai` Edge Function and custom Cloudflare Worker can be retired if no other site uses them.

## Environment variables

| Variable | Value | Secret? |
|---|---|---|
| `SUPABASE_URL` | Same project URL as `assets/config.js` | No |
| `SUPABASE_ANON_KEY` | Same publishable/anon key as `assets/config.js` | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Existing project's service-role key; server quota RPCs only | **Yes** |
| `CLOUDFLARE_ACCOUNT_ID` | Account owning Workers AI access | No |
| `CLOUDFLARE_API_TOKEN` | API token with Workers AI read/write permissions for that account | **Yes** |

`.env.example` lists all variables. The old custom `STUDY_AI_API_KEY` is **not** a Cloudflare API token and cannot replace `CLOUDFLARE_API_TOKEN`. Model usage remains subject to your provider's allowance/billing. Vercel runs the application logic; inference is supplied by the external model API.

The original Supabase public configuration is retained in `assets/config.js`. If moving to a different Supabase project, change those two public values there as well as the corresponding Vercel variables. Never put the service-role key or model token in browser files. The static build copies only pages and assets; it excludes API source, SQL, tests, documentation, and environment files.

## What was wrong / what changed

The supplied ZIP's browser invoked a Supabase Edge Function, which then required a separately deployed Cloudflare Worker and private shared key. Its README referenced `study-ai-setup.sql` and other SQL files that were absent. Those dependencies make the original package insufficient to set up Study AI by itself; the exact deployed failure cannot be confirmed without access to the live services.

This package replaces that chain with one authenticated Vercel endpoint and includes its own quota migration. It now ports your supplied v5-targeted Worker engine into `server/study-engine.js`: the original JSON schemas, AP prompts, formula cleanup, normalized duplicate detection, circular-motion formula checks, varied answer-position check, generation settings, and two-attempt quality loop are retained. Only the Cloudflare runtime binding is replaced with a server-side REST adapter. It keeps the renderer's result format and loading/error states, bounds notes and generated output, rejects duplicate quiz choices/questions/cards, and performs one repair generation with the validation issues. Authentication, atomic allowance updates and model requests happen server-side. Existing frontend page-specific loading and shared Supabase client are retained. No extra framework or runtime dependencies were added.

## Existing database permissions

This is a migration of an **existing Supabase-backed site**, not a fresh database installer. The upload does not contain the base schema, `full-product-upgrade.sql`, or `teacher-approval.sql`. Existing tables, storage policies and RPCs must remain installed. In particular, administrative updates, teacher approval and account deletion still use Supabase's existing database permissions/RPCs. These already run on the database server and require correct RLS/role enforcement; hiding admin controls is not authorization. This archive cannot verify or reconstruct those live policies from frontend code. No service-role credential is used for ordinary browser operations.

Before public launch, verify student/teacher/admin access with real accounts, private-class access, resource upload/deletion, and account deletion. The new quota tables are inaccessible to browser roles and use separate names to avoid altering existing quota logic. During migration, old endpoints have their own allowance; retire unused endpoints after testing to avoid parallel allowances. If a function is forcibly terminated or a refund fails, an allowance may remain consumed until the next UTC day; logs include the request ID for investigation. Quota data can be periodically cleaned up after an appropriate retention period.

## Local verification and development

- Node 24: `npm test` runs mocked API tests; `npm run build` produces static `public/`.
- `npm run dev` starts the Vercel development CLI (downloads the CLI if needed). Connect it to your Vercel project and configure development variables, or copy `.env.example` to `.env.local` and fill it in. Do not commit `.env.local`.
- Opening HTML directly or using a static-only file server does not run `/api/study-ai`.

Checks performed: JavaScript syntax, local HTML asset/page references, byte comparison of original HTML/CSS, static-output exclusions, and mocked API success/error/auth/quota cases. No real provider generation, database migration execution, RLS audit, Vercel deployment, or production browser test was performed; these require your accounts and credentials. Model output validation checks structure and duplicates, not guaranteed factual correctness.

References: [Vercel configuration](https://vercel.com/docs/project-configuration/vercel-json), [Vercel function runtimes](https://vercel.com/docs/functions/configuring-functions/runtime), [Cloudflare model REST API](https://developers.cloudflare.com/workers-ai/models/llama-3.3-70b-instruct-fp8-fast/).

## Your own API migration

Your supplied Worker is your custom AI API, and its model is Cloudflare-hosted Llama. Your custom generation logic now executes on Vercel; the model computation remains on Cloudflare. Vercel cannot execute Cloudflare's `env.AI` binding. The REST adapter calls the same model with the same schemas and settings. A Cloudflare account API token authorizes that model access; your old `study_sk_...` only authenticated callers to your old Worker and cannot authorize model access. No separate Worker deployment is needed.

The website endpoint uses a verified Supabase login instead of the old shared API key, and adds the server-only daily quota. This package does not preserve the old public `/health` and `/v1/generate` endpoints for external clients; the website uses `/api/study-ai`. The old Worker can remain online for other clients until you decide to retire it. The original engine's heuristic checks are preserved, but cannot guarantee scientific accuracy or detect all semantic duplicates.
