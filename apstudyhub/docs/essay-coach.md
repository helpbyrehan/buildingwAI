# Essay coach: operation, examples, and evaluation

The `/essay-coach/` page reviews application writing and returns advice. It does
not compose replacement essays or make admission decisions. Its six criteria
are prompt alignment, specific detail, reflection, voice, structure, and clarity.
Levels describe the draft under this rubric; there is no validated overall grade
or admission probability.

## Current implementation

`POST /api/essay-coach` verifies the Supabase session, reserves one request from
the existing five-per-UTC-day Study AI allowance, calls Cloudflare Workers AI,
validates the output, and refunds failed generation. It uses the existing server
credentials and quota SQL. The model defaults to
`@cf/meta/llama-3.3-70b-instruct-fp8-fast`; `ESSAY_COACH_MODEL` is an optional
server-only override for a compatible Cloudflare model. Do not change it without
checking structured output support and evaluation results.

The engine selects six teaching contrasts by essay type, review focus, and rubric
coverage. This is example-guided prompting. It does **not** change model weights,
train on each submission, or establish measured admissions accuracy. The current
library has 20 project-original synthetic contrasts (40 excerpts), with notes on
what changes and why. These are not student essays, accepted/rejected labels, or
human-validated training data. Synthetic weaker versions isolate craft issues;
they are not evidence about real rejected applicants.

The provider returns structured feedback. Server and browser checks require all
six criteria and short quotations anchored in the submitted draft; paragraph
quotes must belong to their named paragraph. One retry is allowed. Unknown
fields are stripped. These checks improve grounding and constrain common failure
modes; they cannot prove the critique is fair, correct, or immune to prompt
injection. A trusted human should assess actual feedback quality.

## Privacy and storage

- The user must choose **Get essay advice** to send the displayed draft and
  prompt to the Vercel endpoint and Cloudflare model. Merely saving an essay in
  College applications does not send it to AI.
- AP Study Hub's endpoint does not save or log draft text, prompts, feedback,
  credentials, or full provider errors. It records quota request IDs through the
  existing quota functions. Hosting/model services remain subject to their own
  processing and retention terms; this is not a zero-retention promise.
- The coach stores a working draft and feedback in tab-session storage, scoped
  to the account or guest. Session restoration depends on the browser. Download
  a copy before switching accounts or closing the session. Ordinary downloads
  include private draft text; keep them private.
- Tracker essays retain the tracker's existing local saving and optional private
  account sync. Coach edits do not automatically overwrite the tracker draft.
- User submissions never enter the teaching library automatically.

## Public reading references supplied by the owner

Reviewed 15 October 2026. The owner clarified these were publicly available
reading links, not separately permissioned reuse files. They are linked on the
page; their essay text and reviewer commentary are **not** stored in the example
library or sent as prompt context.

| Source | Reading purpose | Reuse status |
| --- | --- | --- |
| [College Essay Guy: personal statements](https://www.collegeessayguy.com/blog/personal-statement-examples) | US personal statements with discussion | Reading link only; no separate reuse permission supplied |
| [College Essay Guy: college essays](https://www.collegeessayguy.com/blog/college-essay-examples) | US essay examples | Reading link only; no separate reuse permission supplied |
| [Uni Compare: personal statements](https://universitycompare.com/personal-statement-examples) | UK, subject-oriented examples; distinguish from US application formats | Reading link only; no separate reuse permission supplied |
| [Johns Hopkins: Essays That Worked](https://apply.jhu.edu/college-planning-guide/essays-that-worked/) | Selected essays and admissions commentary | Reading link only; no separate reuse permission supplied |

The Hopkins collection presents selected successful applicants' work. This does
not establish that an essay caused admission, or that a rejected applicant's
writing is weak. The coach does not use admission outcome labels as quality
labels. [Yale's guidance](https://admissions.yale.edu/what-yale-looks-for)
emphasizes personal perspective; [its AI policy](https://admissions.yale.edu/ai-policy)
distinguishes general advice from substantive AI composition. Students must
check the policies applicable to their own colleges.

No blanket AI reuse license was established from the supplied pages.
[Uni Compare's terms](https://universitycompare.com/terms) limit copying and
reuse; [College Essay Guy's published terms](https://students.collegeessayguy.com/pages/terms)
describe personal use and written permission for wider reuse. Its main website
terms link returned 403 during this review. This implementation uses links and
original examples without relying on an uncertain license.

## Adding genuinely permissioned examples later

Keep original essays, author details, permission records, and reviewer records
in private owner-controlled storage, outside the public website and repository.
Permission for someone else's website to publish an essay is not automatically
permission for this app to use it. Confirm the intended use: server-side prompt
reference and transmission to Cloudflare; actual weight training is a separate
purpose. Apply privacy review and minimize identifiers before inclusion.

A reviewer should label concrete writing features, not people as good/bad:
identify the prompt, quote the relevant passage, explain its effect, specify a
useful revision action, and distinguish strengths from weaknesses. Human notes
should cover mixed-quality drafts, different contexts, ordinary experiences,
and differing voices. Do not manufacture an author's revision or call automated
labels human review. Where a teaching rewrite is created, label its authorship
and permission separately from the original student text.

Only approved, minimized contrast excerpts belong in
`server/essay-consented-examples.json` (currently `[]`). Each entry requires:

- `id`: unique lowercase ID; `kind`: personal/supplement/scholarship/other;
  `traits`: one or more rubric keys.
- `weaker`, `stronger`, `commentary`: bounded, reviewed teaching content.
- `origin: "permissioned_human"`, `rights: "written-permission"`,
  `usage: "prompt_reference"`.
- `consent_confirmed: true`, `privacy_reviewed: true`, `humanValidated: true`.
- Nonempty `permission_reference` and `reviewer_reference`: opaque references
  to private records, never contact details, signatures, or full consent forms.

Run `npm run check:essay-library`. This checks required metadata, bounds,
labels, and duplicates, **not** the truth of permissions or reviewer judgments.
Keep server files private in deployment; the build excludes `server/` from
static output. Update the library version and tests when approved data changes.

## Evaluation before claiming accuracy or training a custom model

No real training job or live-model quality evaluation was run for this release.
Automated tests use mocked provider responses, and the example UI uses prepared
feedback explicitly labeled as a demonstration.

1. Build a permissioned evaluation set with writing teachers/counselors: clear,
   weak, mixed, incomplete, multilingual, short supplemental, and off-prompt
   drafts. Include input attempts to request ghostwriting or override instructions.
2. Keep authors and alternate drafts in a single split; exclude evaluation essays
   and near-duplicates from examples/training. Hold the set fixed across versions.
3. Have two reviewers independently assess specific evidence, accurate criticism,
   useful actions, voice preservation, and unsupported judgments. Resolve material
   disagreements; do not use admitted/rejected outcomes as the answer key.
4. Compare the same model with rubric only versus rubric plus examples. Record
   model/library version, test cases, evidence validity, inappropriate output,
   latency, cost, and reviewer ratings. Require zero fabricated quote anchors or
   composed replacement passages in the release set, and meaningful improvement
   in reviewer-rated advice before adopting a change. Report failures honestly.
5. If prompt improvements plateau and enough reviewed data exists, choose a
   supported fine-tuning provider/model and prepare consented input/advice pairs.
   Split, deduplicate, train, and evaluate against the same untouched holdout.
   Weak/strong essays alone are not the desired training target; the target is
   the reviewer's evidence-grounded coaching response. Recheck consent scope,
   provider data handling, cost, and deployment compatibility before a paid job.

This repository contains no fine-tuning runner, automatic scraper, submission
harvester, or claim of a custom-trained admission model.
