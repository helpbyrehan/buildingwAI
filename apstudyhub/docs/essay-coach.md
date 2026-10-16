# Essay coach: operation, examples, and evaluation

The `/essay-coach/` page reviews application writing and returns advice. It does
not compose replacement essays or make admission decisions. Its six criteria
are prompt alignment, specific detail, reflection, voice, structure, and clarity.
Levels describe the draft under this rubric; there is no validated overall grade
or admission probability.

## Optional local Qwen model (fast first version)

The local training project provides a Qwen3-14B QLoRA adapter and an authenticated
loopback server (`website-api.py`, launched by **Start Website AI.cmd**). The first
version uses 100 training examples: 50 UK and 50 US, including 64 factual Q&A
examples and 36 essay reviews. Six validation examples and six test examples are
separate, with scenario families kept together. All examples are synthetic; this
is not an 8,000-essay dataset, human expert training, or measured admissions accuracy.
See the training project's `fast-data-audit.json` and output-review report for its
actual completion and evaluation status.

The connection is: GitHub Pages browser → existing Vercel `/api/essay-coach` →
HTTPS tunnel → local `127.0.0.1:8765/api/review` → trained Qwen model. Existing
Supabase login, shared daily quota, CORS and failed-request refunds still apply.
GitHub Pages hosts static files; it does not run the model. The PC must remain on.
The local server handles one review at a time and rejects concurrent requests
with 429; the Vercel endpoint refunds the reserved request when generation fails.
It processes drafts in memory and does not save request bodies or feedback.
Hosting and tunnel providers still process traffic under their respective terms.
The coach's existing browser session saving remains unchanged.

After completing the local run, start **Start Website AI.cmd**. On first start it
creates a private access key in `work/website-api-token.txt` in the training
workspace (ignored by Git). Expose only this model API through an HTTPS tunnel.
Set these **server-only Vercel environment variables**, then redeploy:

```
ESSAY_COACH_PROVIDER=local
ESSAY_COACH_LOCAL_URL=https://YOUR-TUNNEL-HOST/api/review
ESSAY_COACH_LOCAL_KEY=<the private local access key>
```

Keep the existing Supabase variables. Cloudflare AI credentials are not required
for essay reviews in local mode; Study AI can keep its existing provider. Never
put the local key in `assets/config.js`, HTML, client JavaScript or Git. Do not use
`localhost` as the Vercel URL: it would refer to Vercel's computer, not yours.

For a free temporary development connection, install `cloudflared` from its
[official downloads](https://developers.cloudflare.com/tunnel/downloads/) and run
`cloudflared tunnel --url http://127.0.0.1:8765`. Use the printed HTTPS hostname in
the URL above. [Quick Tunnels](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/)
need no account or domain, but their hostname changes on restart, they have no
uptime guarantee, and Cloudflare describes them as development/test connections.
A stable public deployment needs a stable tunnel hostname and suitable hosting
accounts. No public tunnel or deployment is created just by running the trainer.
Local model inference has no per-request AI fee; electricity and any hosting or
network plan limits still apply.

Local feedback uses `local-essay-advice-v1`: plain-text advice escaped for display,
with a distinct experimental label. It is not silently converted into six rubric
ratings or passed off as quote-validated structured feedback. Cloudflare mode
retains the original evidence-checked rubric contract. If the PC is offline,
local mode fails and refunds the request; it never silently switches providers.

UCAS has separate complete-response and excerpt options. The word-limit field
does not apply to these options. The local model uses the verified three-question
format from 2026 entry onwards; the entry year/course should be supplied with the
prompt. The editor's character count includes typed headings, so the applicant
must check counts in the actual application fields.

## Cloudflare implementation

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
  prompt to the Vercel endpoint and selected model (Cloudflare or the locally hosted coach). Merely saving an essay in
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

The original Cloudflare release did not include a training job or live-model quality evaluation. The separate local training project now supplies the optional adapter; its reports describe the small run and its limitations.
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

Model weights, training data, API secrets and the local training runner stay outside this public website repository. No submitted essays are harvested for training.
