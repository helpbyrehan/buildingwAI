# AP score calculator

The static calculator is at `calculator/` on GitHub Pages and Vercel. It needs no new environment variables, API endpoint, database table, or AI service. Inputs are calculated locally and are not stored or sent to the Study AI API. Shared navigation and the homepage now link to it.

## Accuracy and scope

All 42 subjects in College Board's October 2026 course directory are included, including the two Career Kickstart courses first examined in 2027. There are 123 named models. The default is the 2027 exam format, with current published section weights and an explicitly attributed independent reference curve when available. This is an AP exam-score estimator, not a school-grade calculator.

A computed composite is a weighted calculation of the entered practice marks. A 1–5 prediction is model-dependent: College Board equates exam forms, and an independent calculator cannot promise the future official score. No accuracy percentage, statistical probability, or universal AP curve is claimed. Near-boundary results are identified as sensitive to the selected curve.

34 subjects have a default independent curve. Eight assessments (2-D Art and Design, 3-D Art and Design, Drawing, Research, Seminar, Chinese, Italian, Japanese) calculate verified component-weighted percentages without inventing a default 1–5 conversion. A student can apply a matching teacher-provided scoring worksheet to any subject, with validated increasing cutoffs and the worksheet's rounding rule. Portfolio/Capstone component percentages are planning inputs based on rubric feedback, not a reconstruction of College Board's reader adjudication.

Historical source models are labeled with their source and year and retain that source's input format. Source models are not relabeled as official College Board conversion charts. Only matching input structures are compared; different curves are displayed separately, never averaged. Changing to an incompatible format clears the inputs to prevent applying points to the wrong rubric.

## Method

- Each raw input contributes `points × multiplier`; percentage fields contribute their published share of the composite. Final composite totals are capped at the model scale to absorb tiny source-coefficient rounding errors.
- Default current formats use exact published section proportions instead of rounded calculator coefficients. For most reference models, the sum is rounded once at the end before applying lower-bound cutoffs. Teacher worksheets may choose no rounding.
- Cutoffs are stored as the minimum for scores 2, 3, 4, and 5, creating continuous bands. A transcription gap in a source range cannot make a higher composite fall back to a 1.
- Precalculus separately weights 2027 MCQ Part A (43.75%) and Part B (18.75%); it does not spread 62.5% uniformly across all 42 MCQ.
- Music Theory keeps 45% MCQ, 45% written response, and 10% sight singing. Per-question proportions within the written group follow the named reference model. Aural/nonaural subscores are not estimated.
- Histories keep the 40/20/25/15 section split. For revised 2027 written tasks, percentages are used instead of assuming older raw rubric maxima; historical references keep their own rubrics.
- CSP includes Create plus exam-day written responses at 30%; a current task percentage avoids applying the obsolete six-point 2022 task rubric as a current raw-point maximum. Its historical conversion remains a labeled projection.
- Calculus BC estimates only the overall score; it cannot infer an AB subscore from aggregate BC points.
- Business and Cybersecurity curves are uncalibrated 2027 planning projections from Albert, clearly identified on the page.
- A target plan searches each component's valid score increments and returns the smallest attainable increase with other components held fixed. It reports when no single component can reach the target.

## Source review

Reviewed 13 October 2026. Numerical exam facts and calculator cutoffs were independently transcribed into our own data schema. No external calculator implementation, graphics, charts, distributions, or marketing copy is included. College Board is authoritative for formats/weights. Albert and OnePrep are the primary publishers of their independent calculator models. Knowt was inspected as a comparator; its displayed Physics 1 input maximum did not match the current official exam, so it was not used as the current format source.

General sources:

- [College Board: all 42 courses](https://apstudents.collegeboard.org/courses)
- [College Board: scoring and equating](https://apcentral.collegeboard.org/help-center/what-equating-processes-does-ap-use)
- [Albert calculator directory](https://www.albert.io/blog/category/score-calculators/)
- [OnePrep calculator directory](https://www.oneprep.com/ap-score-calculator)
- [2026 Comparative Government rubric](https://apcentral.collegeboard.org/media/pdf/ap26-sg-comp-gov-pol.pdf)
- [Art and Design component weights](https://apcentral.collegeboard.org/media/pdf/ap-art-and-design-course-and-exam-description.pdf)

| Subject | Official format/assessment | Independent current curve |
| --- | --- | --- |
| AP 2-D Art and Design | [College Board](https://apcentral.collegeboard.org/media/pdf/ap-art-and-design-course-and-exam-description.pdf) | No default curve; teacher worksheet supported |
| AP 3-D Art and Design | [College Board](https://apcentral.collegeboard.org/media/pdf/ap-art-and-design-course-and-exam-description.pdf) | No default curve; teacher worksheet supported |
| AP African American Studies | [College Board](https://apcentral.collegeboard.org/courses/ap-african-american-studies/exam) | [Albert reference](https://www.albert.io/blog/ap-african-american-studies-score-calculator/) |
| AP Art History | [College Board](https://apcentral.collegeboard.org/courses/ap-art-history/exam) | [Albert reference](https://www.albert.io/blog/ap-art-history-score-calculator/) |
| AP Biology | [College Board](https://apcentral.collegeboard.org/courses/ap-biology/exam) | [Albert reference](https://www.albert.io/blog/ap-biology-score-calculator/) |
| AP Business with Personal Finance | [College Board](https://apcentral.collegeboard.org/courses/ap-business-personal-finance/exam) | [Albert reference](https://www.albert.io/blog/ap-business-personal-finance-score-calculator/) |
| AP Calculus AB | [College Board](https://apcentral.collegeboard.org/courses/ap-calculus-ab/exam) | [Albert reference](https://www.albert.io/blog/ap-calculus-ab-score-calculator/) |
| AP Calculus BC | [College Board](https://apcentral.collegeboard.org/courses/ap-calculus-bc/exam) | [Albert reference](https://www.albert.io/blog/ap-calculus-bc-score-calculator/) |
| AP Chemistry | [College Board](https://apcentral.collegeboard.org/courses/ap-chemistry/exam) | [Albert reference](https://www.albert.io/blog/ap-chemistry-score-calculator/) |
| AP Chinese Language and Culture | [College Board](https://apcentral.collegeboard.org/courses/ap-chinese-language-and-culture/exam) | No default curve; teacher worksheet supported |
| AP Comparative Government and Politics | [College Board](https://apcentral.collegeboard.org/courses/ap-comparative-government-and-politics/exam) | [Albert reference](https://www.albert.io/blog/ap-comparative-government-score-calculator/) |
| AP Computer Science A | [College Board](https://apcentral.collegeboard.org/courses/ap-computer-science-a/exam) | [Albert reference](https://www.albert.io/blog/ap-computer-science-a-score-calculator/) |
| AP Computer Science Principles | [College Board](https://apcentral.collegeboard.org/courses/ap-computer-science-principles/exam) | [Albert reference](https://www.albert.io/blog/ap-computer-science-principles-score-calculator/) |
| AP Cybersecurity | [College Board](https://apcentral.collegeboard.org/courses/ap-cybersecurity/exam) | [Albert reference](https://www.albert.io/blog/ap-cybersecurity-score-calculator/) |
| AP Drawing | [College Board](https://apcentral.collegeboard.org/media/pdf/ap-art-and-design-course-and-exam-description.pdf) | No default curve; teacher worksheet supported |
| AP English Language and Composition | [College Board](https://apcentral.collegeboard.org/courses/ap-english-language-and-composition/exam) | [Albert reference](https://www.albert.io/blog/ap-english-language-score-calculator/) |
| AP English Literature and Composition | [College Board](https://apcentral.collegeboard.org/courses/ap-english-literature-and-composition/exam) | [Albert reference](https://www.albert.io/blog/ap-english-literature-score-calculator/) |
| AP Environmental Science | [College Board](https://apcentral.collegeboard.org/courses/ap-environmental-science/exam) | [Albert reference](https://www.albert.io/blog/ap-environmental-science-score-calculator/) |
| AP European History | [College Board](https://apcentral.collegeboard.org/courses/ap-european-history/exam) | [Albert reference](https://www.albert.io/blog/ap-european-history-score-calculator/) |
| AP French Language and Culture | [College Board](https://apcentral.collegeboard.org/courses/ap-french-language-and-culture/exam) | [Albert reference](https://www.albert.io/blog/ap-french-language-score-calculator/) |
| AP German Language and Culture | [College Board](https://apcentral.collegeboard.org/courses/ap-german-language-and-culture/exam) | [Albert reference](https://www.albert.io/blog/ap-german-language-score-calculator/) |
| AP Human Geography | [College Board](https://apcentral.collegeboard.org/courses/ap-human-geography/exam) | [Albert reference](https://www.albert.io/blog/ap-human-geography-score-calculator/) |
| AP Italian Language and Culture | [College Board](https://apcentral.collegeboard.org/courses/ap-italian-language-and-culture/exam) | No default curve; teacher worksheet supported |
| AP Japanese Language and Culture | [College Board](https://apcentral.collegeboard.org/courses/ap-japanese-language-and-culture/exam) | No default curve; teacher worksheet supported |
| AP Latin | [College Board](https://apcentral.collegeboard.org/courses/ap-latin/exam) | [Albert reference](https://www.albert.io/blog/ap-latin-score-calculator/) |
| AP Macroeconomics | [College Board](https://apcentral.collegeboard.org/courses/ap-macroeconomics/exam) | [Albert reference](https://www.albert.io/blog/ap-macroeconomics-score-calculator/) |
| AP Microeconomics | [College Board](https://apcentral.collegeboard.org/courses/ap-microeconomics/exam) | [Albert reference](https://www.albert.io/blog/ap-microeconomics-score-calculator/) |
| AP Music Theory | [College Board](https://apcentral.collegeboard.org/courses/ap-music-theory/exam) | [Albert reference](https://www.albert.io/blog/ap-music-theory-score-calculator/) |
| AP Physics 1: Algebra-Based | [College Board](https://apcentral.collegeboard.org/courses/ap-physics-1/exam) | [Albert reference](https://www.albert.io/blog/ap-physics-1-score-calculator/) |
| AP Physics 2: Algebra-Based | [College Board](https://apcentral.collegeboard.org/courses/ap-physics-2/exam) | [Albert reference](https://www.albert.io/blog/ap-physics-2-score-calculator/) |
| AP Physics C: Electricity and Magnetism | [College Board](https://apcentral.collegeboard.org/courses/ap-physics-c-electricity-and-magnetism/exam) | [Albert reference](https://www.albert.io/blog/ap-physics-c-e-and-m-score-calculator/) |
| AP Physics C: Mechanics | [College Board](https://apcentral.collegeboard.org/courses/ap-physics-c-mechanics/exam) | [Albert reference](https://www.albert.io/blog/ap-physics-c-mechanics-score-calculator/) |
| AP Precalculus | [College Board](https://apcentral.collegeboard.org/courses/ap-precalculus/exam) | [Albert reference](https://www.albert.io/blog/ap-precalculus-score-calculator/) |
| AP Psychology | [College Board](https://apcentral.collegeboard.org/courses/ap-psychology/exam) | [Albert reference](https://www.albert.io/blog/ap-psychology-score-calculator/) |
| AP Research | [College Board](https://apcentral.collegeboard.org/courses/ap-research/exam) | No default curve; teacher worksheet supported |
| AP Seminar | [College Board](https://apcentral.collegeboard.org/courses/ap-seminar/exam) | No default curve; teacher worksheet supported |
| AP Spanish Language and Culture | [College Board](https://apcentral.collegeboard.org/courses/ap-spanish-language-and-culture/exam) | [Albert reference](https://www.albert.io/blog/ap-spanish-language-score-calculator/) |
| AP Spanish Literature and Culture | [College Board](https://apcentral.collegeboard.org/courses/ap-spanish-literature-and-culture/exam) | [Albert reference](https://www.albert.io/blog/ap-spanish-literature-score-calculator/) |
| AP Statistics | [College Board](https://apcentral.collegeboard.org/courses/ap-statistics/exam) | [Albert reference](https://www.albert.io/blog/ap-statistics-score-calculator/) |
| AP United States Government and Politics | [College Board](https://apcentral.collegeboard.org/courses/ap-united-states-government-and-politics/exam) | [Albert reference](https://www.albert.io/blog/ap-us-government-score-calculator/) |
| AP United States History | [College Board](https://apcentral.collegeboard.org/courses/ap-united-states-history/exam) | [Albert reference](https://www.albert.io/blog/ap-us-history-score-calculator/) |
| AP World History: Modern | [College Board](https://apcentral.collegeboard.org/courses/ap-world-history/exam) | [Albert reference](https://www.albert.io/blog/ap-world-history-score-calculator/) |

## Checks and deployment

`npm test` runs 41 tests, including all subjects/models, full-score normalization, source fixture reproduction, rounding boundaries, bad input, exact/custom worksheets, source disagreement, and minimal target gains. `npm run build` includes the new calculator page and all assets in `public/`. Browser checks cover all 42 subject pages, source comparison, custom cutoffs, input validation, and phone layout. The existing Study AI tests continue to pass.

Commit and push the changed `apstudyhub` files, including the calculator directory and five new calculator assets, on the branch connected to GitHub Pages and Vercel. Both hosts can serve this feature as static files. Open `/buildingwAI/apstudyhub/calculator/` on GitHub Pages or `/calculator/` on Vercel after deployment. No server settings or SQL changes are required.

When refreshing a model, inspect the current official format and rubric before updating the independent curve. Update source URLs and review date; keep historical profiles distinct. Re-run the tests and browser checks when format maxima, weights, or cutoffs change.
