# AP Study Hub

A production-oriented AP resource library frontend for GitHub Pages + Supabase.

## Design

The interface uses a minimal editorial direction: oversized typography, strong whitespace, short copy, subtle motion, dark/light themes, and separate focused pages rather than putting the entire product on the homepage.

## Main pages

- `/` — landing page + search entry
- `/browse/` — intelligent search and filters
- `/courses/` — AP course directory
- `/course/?slug=...` — course library
- `/resource/?id=...` — resource viewer
- `/saved/` — authenticated saved resources
- `/add/` — authenticated submissions
- `/login/` — login
- `/signup/` — signup + display name
- `/profile/` — profile + uploads
- `/settings/` — display name, password, account deletion
- `/admin/` — admin moderation
- `/about/` — short product explanation

## Account behavior

Signup asks for a display name. That name is used throughout the interface instead of exposing the user's email.

The profile menu provides:

- Profile
- Saved
- My uploads
- Settings
- Admin (admins only)
- Log out

Saved resources are account-based and persist across devices.

Users can remove their own uploads. Database RLS prevents users from modifying another user's account or resources.

## Search

Search normalizes capitalization and punctuation and understands common AP abbreviations such as:

- psych
- physics / phys
- calc
- chem
- bio
- csa / csp
- stats
- apush
- world
- euro
- gov
- macro / micro
- lang / lit
- seminar / research
- precalc

Results are relevance-ranked by title, course, subject, unit, resource type, and text.

## Security

Run `schema.sql` in the Supabase SQL Editor.

The SQL adds:

- profile display names
- student/admin roles
- saved resources
- signup profile trigger
- account deletion RPC
- Row Level Security
- private pending uploads
- a separate public bucket for approved resources
- admin-only publishing/deletion of public files

Never put a Supabase service-role key in `assets/config.js`.

## Supabase configuration

`assets/config.js` contains only the browser-safe Supabase URL and publishable key, plus bucket names.

The expected buckets are:

- `ap-resources` — private pending uploads
- `ap-public-resources` — public approved PDFs

The admin workflow moves approved PDFs from the private bucket into the public bucket.

## Important

The frontend cannot make database security safe by itself. RLS and Storage policies are required.

After running `schema.sql`, create your own account and use the commented admin SQL statement at the bottom of the file to assign yourself the admin role.

Before launch, test account isolation, uploads, deletion, moderation, password reset, mobile layouts, invalid URLs/files, empty results, and failed network requests.
