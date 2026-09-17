# AP Study Hub

Static GitHub Pages-compatible frontend for AP Study Hub, designed around the supplied project specification.

## Files

- `index.html` — homepage
- `browse/index.html` — search + filters
- `courses/index.html` — course directory
- `course/index.html?slug=...` — course detail page
- `resource/index.html?id=...` — resource detail / PDF viewer
- `add/index.html` — authenticated resource submission
- `login/index.html` — Supabase email/password login
- `admin/index.html` — admin moderation UI
- `about/index.html` — about page
- `assets/styles.css` — shared responsive styling
- `assets/app.js` — shared application logic
- `assets/config.js` — Supabase project configuration

## Connect Supabase

Open `assets/config.js` and replace:

- `YOUR_SUPABASE_URL`
- `YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY`

Keep `DEMO_MODE: true` while testing the UI without a database. Set `DEMO_MODE: false` after your tables, RLS, Auth, and Storage are ready.

Never put a Supabase service-role key in frontend code.

## Expected tables

The frontend expects the MVP tables:

- `subjects`
- `courses`
- `resources`
- `profiles`

Expected resource fields include title, slug, description, subject_id, course_id, year, unit_number, unit_name, resource_type, file_path, file_name, file_size, mime_type, external_url, submitted_by, status, featured, view_count, download_count, created_at, updated_at.

The app works with integer IDs (`int8`) as long as foreign-key columns use the matching type.

## Storage

Expected bucket: `ap-resources`.

Uploaded PDFs use a path similar to:

`pending/<auth-user-id>/<timestamp>-<filename>.pdf`

For production, use Storage RLS policies that permit authenticated contributors to upload only where appropriate and permit approved resources to be opened safely.

## GitHub Pages

Upload the whole folder contents to the repository root. Do not upload only the root `index.html`; the nested page folders and `assets` directory are required.

Because the links are relative, the site works from a GitHub Pages repository URL such as `username.github.io/repository-name/`.

## Important backend note

RLS is part of the security model. Public browsing should expose only `resources.status = 'approved'`. Authenticated users should be able to submit their own pending resources. Admin authorization must be enforced by Supabase policies/server-side checks, not just by hiding an admin link in the frontend.
