# AP Study Hub

A production-oriented AP resource library for GitHub Pages + Supabase, redesigned around an editorial, minimal interface inspired by the visual principles of modern creative-agency sites.

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

Run `schema.sql` in the Supabase SQL Editor before using authentication, saved resources, uploads, or moderation.

The migration is designed around the existing AP Study Hub tables and adds missing columns used by the new frontend, including resource status, ownership, file metadata, resource type, units, featured state, and timestamps.

After creating your own account, make it an admin once:

```sql
UPDATE public.profiles SET role='admin' WHERE id='YOUR-AUTH-USER-UUID';
```

Do not place a service-role key in `assets/config.js`. The browser configuration must only contain the Supabase project URL and publishable/anon key.

## Storage

Two buckets are used:

- `ap-resources` — private pending uploads
- `ap-public-resources` — public files after admin approval

A pending upload is stored inside a user-owned `pending/<user-id>/...` path. Storage policies prevent another student from reading or deleting that pending file.

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

- update their own profile
- save/delete their own saved-resource records
- submit resources under their own account
- remove their own resources

Admins can moderate resources and publish approved files.

## Validation

Display names are restricted to 2–30 letters/spaces/simple punctuation. Resource titles and descriptions reject HTML-like input. External links are limited to HTTP/HTTPS. Uploads must be PDFs and cannot exceed the configured size limit.

## GitHub Pages

Publish the contents of this `apstudyhub` folder as the site root. `.nojekyll` is included so the directory structure and asset paths are served directly.


## Account settings

Change password uses Supabase Auth. To enable Delete account, run `supabase/account.sql` once in the Supabase SQL Editor. The function deletes the signed-in user's resource rows, profile row, and Auth account. Storage files are not deleted by this SQL function.
