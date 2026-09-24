# AP Study Hub — website files

Static HTML/CSS/JavaScript site using GitHub Pages and an existing Supabase project. Publish the **contents** of this `apstudyhub` folder as the site root. Keep the supplied `assets/config.js` publishable/anon key only; never add a service-role key to browser code.

## Corrections in this package

- Replaced the browser-only Study Assistant draft generator with the authenticated AP Study Hub AI service. Signed-in students can create structured summaries, self-checking quizzes and revealable flashcards without exposing the Cloudflare API key in public website code.
- Added an atomic five-generations-per-user daily limit, a Supabase Edge Function gateway, strict note and output limits, responsive Study AI layouts, loading/error states, character counting and copy controls.
- Hardened Study AI generation with strict server-side response checks, duplicate-question and duplicate-choice detection, formula/control-character cleanup, stronger AP-style assessment instructions, prompt-injection resistance, and an automatic repair attempt. The browser also cleans unsafe control characters as a final display safeguard.
- Live-account testing fixes duplicate Supabase clients, duplicate mobile/menu links, duplicate Study AI tabs, unnecessary homepage/Assistant database requests, and slow-loading feedback. Quiz generation now uses Cloudflare's Llama 3.3 70B fast model with semantic checks for near-duplicate questions, equivalent correct formulas, and incomplete numerical questions. Failed upstream generations are refunded rather than consuming a student's daily allowance.
- The resource-quality section is now a separate block **below** the resource details and preview, rather than accidentally inserted into the small row containing the Save button. Helpful / Not helpful / Report buttons wrap cleanly and the Study Assistant link has its own spaced row.
- Expanded discussion questions now show their replies and provide a reply form for signed-in users. Replies are sent to `post_replies` and posting errors are displayed. Signed-out visitors can read replies and are prompted to sign in to respond.
- Class creation is limited to **approved teachers and admins**. Other logged-in users can join a class or submit a teacher application with a teaching statement. Admins can approve or reject pending applications from the Admin page. The approval record is the teacher **rank**; applicants cannot approve their own application or assign themselves a classroom-teacher membership through the database.
- Added more forgiving line heights, wrapping, flex gaps, and mobile spacing across resource detail, discussion, course cards, study panels and headings. Existing style and layout structure are retained.
- Corrected server policies so replies cannot be written to a private class the user cannot access, and classroom ownership cannot be reassigned by non-admin users.

## Required Supabase migration

**Website code alone cannot change a live database.** In the Supabase SQL Editor for your AP Study Hub project, first confirm that your existing core schema (`profiles`, `subjects`, `courses`, `resources`, existing auth/storage policies and other tables used by the site) is installed. These base tables are prerequisites; a fresh project cannot be initialized from this ZIP alone.

If the previous **full product upgrade was already applied**, run **`teacher-approval.sql`** in the SQL Editor. If it was **not** applied, run **`full-product-upgrade.sql`**; this includes the teacher approval migration at the end. Both migration files are written to be repeatable. **Do not run `full-product-upgrade.sql` alone after teacher approval without running it to completion:** its last section reinstates the required security policies.

The migration requires a working `public.is_admin()` function and assumes existing admin accounts have `profiles.role = 'admin'`. An approved teacher is determined by `teacher_applications.status = 'approved'`; the existing `profiles.role` schema is deliberately *not* changed to an unverified `teacher` enum value. Admin approval occurs through the protected `review_teacher_application` RPC.

The older ZIP's README referred to a `schema-patch.sql` file that was **not included in the ZIP**. This package does not claim that file was run or silently recreate your original base database. If core `saved_resources`, profile write, storage delete or account-delete infrastructure is missing in your Supabase project, those features still require a schema review before launch. You can verify these in the Supabase dashboard or supply the current schema to complete a migration safely.

## Study AI deployment

The AI key is deliberately absent from the public website. Complete these server-side steps before publishing the new Assistant page:

1. Run `study-ai-setup.sql` in the Supabase SQL Editor. It creates only the daily AI usage table and its protected atomic quota/refund functions, and is safe to run repeatedly. Run the updated file again when upgrading from an earlier Study AI package so failed requests can be refunded securely.
2. In **Supabase → Edge Functions → Deploy a new function → Via Editor**, create a function named `study-ai`. Replace the template with `supabase/functions/study-ai/index.ts` and deploy it. Keep JWT verification enabled.
3. In **Supabase → Edge Functions → Secrets**, create:
   - `STUDY_AI_WORKER_URL` = `https://ap-study-hub-ai.rehan-nabeel19.workers.dev`
   - `STUDY_AI_API_KEY` = the same private `study_sk_...` key stored in Cloudflare
   - Optional `SITE_ORIGINS` = the exact published site origin. Omit it during initial testing to allow authenticated requests from any origin.
4. In Cloudflare, keep the `AI` binding and `STUDY_AI_API_KEY` secret. Deploy the hardened v3 `worker.js` from the separately supplied Cloudflare Worker package. This replacement is required to fix malformed equations, weak quiz distractors and one-attempt generation failures.

Never place `STUDY_AI_API_KEY`, a Supabase secret/service-role key or a Cloudflare token in `assets/config.js`, HTML or browser JavaScript. Only the existing Supabase publishable key belongs in browser code.

## Checks before public launch

1. Deploy the edited files, run the appropriate Supabase migrations, deploy the `study-ai` Edge Function, and configure its secrets; do not just upload the ZIP and expect server-side permissions to change.
2. Test real student, pending applicant, approved teacher, and admin accounts: students can join a class but cannot create one, approve their application or assign themselves teacher membership; approved teachers and admins can create classes; admin review changes application status.
3. Post a community question, reply with another account, refresh, and verify the reply is visible. Rate and report an approved resource. Check the resource layout at 320, 375, 430, 768 and 1280px widths.
4. Verify sign-up, login, password reset, Save, PDF upload/open/remove, profile edits and account deletion against the live Supabase project. Confirm private classroom posts and uploaded files cannot be accessed by unauthorized accounts.
5. Log in as a student and generate a summary, quiz and flashcard set. Confirm the sixth generation on the same UTC day is rejected, the private Cloudflare key is absent from browser source, and signed-out users cannot use the function.
6. Replace the placeholder support/copyright contact on `policies/index.html`, configure live support/moderation, and review all published practice questions and external-resource permissions.

**Verification limits:** JavaScript syntax, CSS parsing, HTML references and code paths can be checked offline. Live Supabase access, deployed GitHub Pages configuration, real authenticated permissions, payment or email delivery (if added separately), and actual production browser behavior cannot be guaranteed by inspection of a ZIP. Do not declare the live service production-ready until the above checks pass.
