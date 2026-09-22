# AP Study Hub

A production-oriented AP resource library for GitHub Pages + Supabase, built around an editorial, minimal interface inspired by the visual principles of modern creative-agency sites.

## Full product upgrade

Run `full-product-upgrade.sql` once in the Supabase SQL Editor before publishing this version. It is idempotent, so it can be safely run again. It adds the complete data model, indexes, helper functions, Row Level Security policies, resource-quality metadata, and a starter practice question for:

- Personalized course dashboards and exam targets
- Unit confidence and progress tracking
- Weekly study tasks and generated starter plans
- Recent resources, practice history, accuracy, and study streaks
- Helpful votes and resource issue reports
- Public study collections and saved collections
- Practice questions with explanations
- Flashcard decks and spaced-review records
- Teacher/class spaces with join codes and shared resources
- Course discussions and replies

New pages are in `dashboard`, `planner`, `practice`, `assistant`, `community`, `classes`, and `policies`. The Study Assistant works entirely in the browser: pasted notes are not uploaded or saved.

Before a public launch, replace the placeholder contact paragraph on the policies page with a monitored support/copyright address. Add original or properly licensed practice questions in Supabase; do not copy protected exam questions.

## What was fixed in this pass

Change display name, delete-my-uploads, delete-account, and the Save/★ button for
logged-in users were all failing. The JavaScript for these was already correct —
the problem was entirely in the database: missing RLS policies, a missing table,
and a missing function that the frontend expected but were never created.

**Run `schema-patch.sql` once in the Supabase SQL editor before anything else.**
It adds:

- An UPDATE policy on `profiles` (display name saves were being silently rejected)
- A trigger that blocks a user from granting themselves admin through that same update
- A DELETE policy on `resources` (nobody — not even admins — could delete a resource before this)
- A DELETE policy on file storage (uploads couldn't be removed)
- The `delete_my_account()` function the Settings page calls (it didn't exist)
- The `saved_resources` table the Save/★ button needs (it didn't exist; Save was throwing a raw database error)

`assets/app.js` also had one real bug: the display-name save tried to write an
`updated_at` value to a column that doesn't exist on `profiles`. Removed.

## What is included

- Minimal landing page with large editorial typography
- Search, course, saved-resource, add-resource, profile, settings, login, signup, resource, and admin pages
- Responsive mobile/tablet/desktop layouts
- Light/dark theme
- Account display names
- Account-based saved resources
- User upload management
- Admin moderation workflow
- Intelligent AP search aliases such as `psych`, `physics`, `calc`, `chem`, `bio`, `csa`, `csp`, `apush`, `world`, `macro`, `micro`, `gov`, `lang`, `lit`, `seminar`, `research`, and `precalc`
- Input validation and HTML escaping
- PDF-only uploads with a 25 MB client-side limit
- HTTP/HTTPS-only external resource links
- Supabase Row Level Security and Storage policies
- Password reset, password change, display-name change, and account deletion
- GitHub Pages-friendly structure with `.nojekyll` and a 404 page

## Important Supabase setup

Run `schema-patch.sql` (in this folder) in the Supabase SQL Editor. It's written
to be safe against your actual current schema — it only adds what's missing.

After creating your own account, make it an admin once:

```sql
UPDATE public.profiles SET role='admin' WHERE id='YOUR-AUTH-USER-UUID';
```

Do not place a service-role key in `assets/config.js`. The browser configuration must only contain the Supabase project URL and publishable/anon key.

## Storage

`assets/config.js` lists two bucket names (`PENDING_BUCKET` / `PUBLIC_BUCKET`),
but the current frontend code only actually uses one bucket, `ap-resources`,
for everything (both pending and approved files stay in place; only the
database `status` column changes on approval — no file copy happens). The
second bucket name is unused right now. If you want the two-bucket
pending/public split described here, that's a real feature to build, not
just a config change — say the word and it can be scoped properly rather
than half-wired.

A pending upload is stored inside a user-owned `pending/<user-id>/...` path. Storage policies prevent another student from reading or deleting that pending file (except admins, who can delete any file).

## Search behavior

The search system normalizes capitalization and punctuation, expands common AP abbreviations, and ranks matches by title, course, subject, unit, resource type, and text relevance.

Examples:

- `psych` → AP Psychology
- `physics` / `phys` → AP Physics
- `calc` → AP Calculus
- `chem` → AP Chemistry
- `csa` → AP Computer Science A
- `csp` → AP Computer Science Principles
- `apush` → AP U.S. History
- `world` → AP World History
- `macro` / `micro` → AP Economics

## Security model

The frontend never treats hidden buttons as security. Authorization is enforced with Supabase RLS and Storage policies.

Users can only:

- update their own profile (role changes are blocked by trigger unless you're already an admin)
- save/delete their own saved-resource records
- submit resources under their own account
- remove their own resources
- delete their own account (removes their files, resources, profile, and auth login)

Admins can moderate resources, delete any resource, and delete any file.

## Validation

Display names are restricted to 2–30 letters/spaces/simple punctuation. Resource titles and descriptions reject HTML-like input. External links are limited to HTTP/HTTPS. Uploads must be PDFs and cannot exceed the configured size limit.

## GitHub Pages

Publish the contents of this `apstudyhub` folder as the site root. `.nojekyll` is included so the directory structure and asset paths are served directly.
