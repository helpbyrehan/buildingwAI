/* Numeric scoring facts and attributed independent reference curves. See SCORE-CALCULATOR.md. */
(function(root){
  const data={
  "reviewed": "2026-10-13",
  "subjects": [
    {
      "id": "2-d-art-and-design",
      "name": "AP 2-D Art and Design",
      "category": "Arts",
      "officialUrl": "https://apcentral.collegeboard.org/media/pdf/ap-art-and-design-course-and-exam-description.pdf",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · weighted composite",
          "kind": "composite",
          "source": "College Board component weights",
          "sourceUrl": "https://apcentral.collegeboard.org/media/pdf/ap-art-and-design-course-and-exam-description.pdf",
          "scale": 100,
          "rounding": "none",
          "fields": [
            {
              "id": "s0",
              "label": "Sustained investigation",
              "max": 100,
              "weight": 0.6,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s1",
              "label": "Selected works",
              "max": 100,
              "weight": 0.4,
              "step": 0.1,
              "unit": "percent"
            }
          ],
          "cutoffs": null,
          "note": "No reliable public 1–5 conversion was verified for this assessment. Calculate the weighted composite, or enter cutoffs from a matching teacher-provided scoring worksheet. Task percentages are earned rubric points ÷ available rubric points × 100."
        }
      ]
    },
    {
      "id": "3-d-art-and-design",
      "name": "AP 3-D Art and Design",
      "category": "Arts",
      "officialUrl": "https://apcentral.collegeboard.org/media/pdf/ap-art-and-design-course-and-exam-description.pdf",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · weighted composite",
          "kind": "composite",
          "source": "College Board component weights",
          "sourceUrl": "https://apcentral.collegeboard.org/media/pdf/ap-art-and-design-course-and-exam-description.pdf",
          "scale": 100,
          "rounding": "none",
          "fields": [
            {
              "id": "s0",
              "label": "Sustained investigation",
              "max": 100,
              "weight": 0.6,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s1",
              "label": "Selected works",
              "max": 100,
              "weight": 0.4,
              "step": 0.1,
              "unit": "percent"
            }
          ],
          "cutoffs": null,
          "note": "No reliable public 1–5 conversion was verified for this assessment. Calculate the weighted composite, or enter cutoffs from a matching teacher-provided scoring worksheet. Task percentages are earned rubric points ÷ available rubric points × 100."
        }
      ]
    },
    {
      "id": "african-american-studies",
      "name": "AP African American Studies",
      "category": "History & Social Sciences",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-african-american-studies/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · Projected curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-african-american-studies-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Individual Student Project - Exam Day Validation Question",
              "max": 1,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Short-Answer Question, Visual Source",
              "max": 3,
              "weight": 2.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Short-Answer Question, Text-Based Source",
              "max": 4,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Short Answer Question, No Source",
              "max": 3,
              "weight": 2.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Document-Based Question",
              "max": 7,
              "weight": 1.7142857142857144,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Individual Student Project",
              "max": 12,
              "weight": 0.7083333333333334,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            35,
            55,
            68,
            80
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · Projected",
          "kind": "projected",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-african-american-studies",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Individual Student Project - Exam Day Validation Question",
              "max": 1,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Short-Answer Question, Visual Source",
              "max": 3,
              "weight": 2,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Short-Answer Question, Text-Based Source",
              "max": 4,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Short Answer Question, No Source",
              "max": 3,
              "weight": 2,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Document-Based Question",
              "max": 7,
              "weight": 1.715,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Individual Student Project",
              "max": 12,
              "weight": 0.708,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            35,
            55,
            68,
            80
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "art-history",
      "name": "AP Art History",
      "category": "Arts",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-art-history/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2022 curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-art-history-score-calculator/",
          "scale": 200,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 80,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Comparison",
              "max": 8,
              "weight": 2.9411764705882355,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Visual/Contextual Analysis",
              "max": 6,
              "weight": 2.9411764705882355,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Visual Analysis",
              "max": 5,
              "weight": 2.9411764705882355,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Contextual Analysis",
              "max": 5,
              "weight": 2.9411764705882355,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Attribution",
              "max": 5,
              "weight": 2.9411764705882355,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Continuity and Change",
              "max": 5,
              "weight": 2.9411764705882355,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            72,
            90,
            113,
            142
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-art-history-score-calculator/",
          "scale": 200,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 80,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Comparison",
              "max": 8,
              "weight": 2.941176471,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Visual/Contextual Analysis",
              "max": 6,
              "weight": 2.941176471,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Visual Analysis",
              "max": 5,
              "weight": 2.941176471,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Contextual Analysis",
              "max": 5,
              "weight": 2.941176471,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Attribution",
              "max": 5,
              "weight": 2.941176471,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Continuity and Change",
              "max": 5,
              "weight": 2.941176471,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            72,
            90,
            113,
            142
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-art-history",
          "scale": 200,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 80,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Comparison",
              "max": 8,
              "weight": 2.941176471,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Visual/Contextual Analysis",
              "max": 6,
              "weight": 2.941176471,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Visual Analysis",
              "max": 5,
              "weight": 2.941176471,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Contextual Analysis",
              "max": 5,
              "weight": 2.941176471,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Attribution",
              "max": 5,
              "weight": 2.941176471,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Continuity and Change",
              "max": 5,
              "weight": 2.941176471,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            72,
            90,
            113,
            142
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "biology",
      "name": "AP Biology",
      "category": "Sciences",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-biology/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2027 (Projected) curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-biology-score-calculator/",
          "scale": 120,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Q1 - Long",
              "max": 9,
              "weight": 1.7647058823529411,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q2 - Long",
              "max": 9,
              "weight": 1.7647058823529411,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q3 - Scientific Investigation",
              "max": 4,
              "weight": 1.7647058823529411,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Q4 - Conceptual Analysis",
              "max": 4,
              "weight": 1.7647058823529411,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Q5 - Analysis of Model or Visual Representation",
              "max": 4,
              "weight": 1.7647058823529411,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Q6 - Analysis of Data",
              "max": 4,
              "weight": 1.7647058823529411,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            28,
            51,
            74,
            93
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2027 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-biology-score-calculator/",
          "scale": 120,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Q1 - Long",
              "max": 9,
              "weight": 1.7647059,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q2 - Long",
              "max": 9,
              "weight": 1.7647059,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q3 - Scientific Investigation",
              "max": 4,
              "weight": 1.7647059,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Q4 - Conceptual Analysis",
              "max": 4,
              "weight": 1.7647059,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Q5 - Analysis of Model or Visual Representation",
              "max": 4,
              "weight": 1.7647059,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Q6 - Analysis of Data",
              "max": 4,
              "weight": 1.7647059,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            28,
            51,
            74,
            93
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "albert-1",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-biology-score-calculator/",
          "scale": 120,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Q1 - Long",
              "max": 10,
              "weight": 1.666666667,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q2 - Long",
              "max": 10,
              "weight": 1.666666667,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q3 - Scientific Investigation",
              "max": 4,
              "weight": 1.666666667,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Q4 - Conceptual Analysis",
              "max": 4,
              "weight": 1.666666667,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Q5 - Analysis of Model or Visual Representation",
              "max": 4,
              "weight": 1.666666667,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Q6 - Analysis of Data",
              "max": 4,
              "weight": 1.666666667,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            28,
            51,
            74,
            93
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-biology",
          "scale": 120,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Q1 - Long",
              "max": 10,
              "weight": 1.666666667,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q2 - Long",
              "max": 10,
              "weight": 1.666666667,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q3 - Scientific Investigation",
              "max": 4,
              "weight": 1.666666667,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Q4 - Conceptual Analysis",
              "max": 4,
              "weight": 1.666666667,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Q5 - Analysis of Model or Visual Representation",
              "max": 4,
              "weight": 1.666666667,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Q6 - Analysis of Data",
              "max": 4,
              "weight": 1.666666667,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            28,
            51,
            74,
            93
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "business-personal-finance",
      "name": "AP Business with Personal Finance",
      "category": "Career Kickstart",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-business-personal-finance/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2027 (Projected) curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-business-personal-finance-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Business Canvas Project Exam-Day Validation",
              "max": 10,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2: Personal Finance",
              "max": 3,
              "weight": 1.7857142857142858,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3: Business Concept Application",
              "max": 3,
              "weight": 1.7857142857142858,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 4: Business Decision",
              "max": 8,
              "weight": 1.7857142857142858,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            35,
            55,
            68,
            80
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction. First exam in 2027: this curve has no past exam results to calibrate against."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2027 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-business-personal-finance-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Business Canvas Project Exam-Day Validation",
              "max": 10,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2: Personal Finance",
              "max": 3,
              "weight": 1.7857143,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3: Business Concept Application",
              "max": 3,
              "weight": 1.7857143,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 4: Business Decision",
              "max": 8,
              "weight": 1.7857143,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            35,
            55,
            68,
            80
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "calculus-ab",
      "name": "AP Calculus AB",
      "category": "Math & Computer Science",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-calculus-ab/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2027 (Projected) curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-calculus-ab-score-calculator/",
          "scale": 108,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 42,
              "weight": 1.2857142857142856,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 9,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 9,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 9,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 4",
              "max": 9,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Question 5",
              "max": 9,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Question 6",
              "max": 9,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            37,
            45,
            57,
            69
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2027 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-calculus-ab-score-calculator/",
          "scale": 108,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 42,
              "weight": 1.2857143,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 4",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Question 5",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Question 6",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            37,
            45,
            57,
            69
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "albert-1",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-calculus-ab-score-calculator/",
          "scale": 108,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 45,
              "weight": 1.2,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 4",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Question 5",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Question 6",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            37,
            45,
            57,
            69
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-calculus-ab",
          "scale": 108,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 45,
              "weight": 1.2,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 4",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Question 5",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Question 6",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            37,
            45,
            57,
            69
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "calculus-bc",
      "name": "AP Calculus BC",
      "category": "Math & Computer Science",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-calculus-bc/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2027 (Projected) curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-calculus-bc-score-calculator/",
          "scale": 108,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 42,
              "weight": 1.2857142857142856,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 9,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 9,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 9,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 4",
              "max": 9,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Question 5",
              "max": 9,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Question 6",
              "max": 9,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            35,
            41,
            52,
            62
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2027 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-calculus-bc-score-calculator/",
          "scale": 108,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 42,
              "weight": 1.2857143,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 4",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Question 5",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Question 6",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            35,
            41,
            52,
            62
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "albert-1",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-calculus-bc-score-calculator/",
          "scale": 108,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 45,
              "weight": 1.2,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 4",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Question 5 (AB Part)",
              "max": 5,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Question 5 (BC Part)",
              "max": 4,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s7",
              "label": "Question 6",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            35,
            41,
            52,
            62
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-calculus-bc",
          "scale": 108,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 45,
              "weight": 1.2,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 4",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Question 5 (AB Part)",
              "max": 5,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Question 5 (BC Part)",
              "max": 4,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s7",
              "label": "Question 6",
              "max": 9,
              "weight": 1,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            35,
            41,
            52,
            62
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "chemistry",
      "name": "AP Chemistry",
      "category": "Sciences",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-chemistry/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2022 curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-chemistry-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 0.8333333333333334,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 10,
              "weight": 1.0869565217391304,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 10,
              "weight": 1.0869565217391304,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 10,
              "weight": 1.0869565217391304,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 4",
              "max": 4,
              "weight": 1.0869565217391304,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Question 5",
              "max": 4,
              "weight": 1.0869565217391304,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Question 6",
              "max": 4,
              "weight": 1.0869565217391304,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s7",
              "label": "Question 7",
              "max": 4,
              "weight": 1.0869565217391304,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            27,
            42,
            58,
            72
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-chemistry-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 0.833333333,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 10,
              "weight": 1.086956522,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 10,
              "weight": 1.086956522,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 10,
              "weight": 1.086956522,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 4",
              "max": 4,
              "weight": 1.086956522,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Question 5",
              "max": 4,
              "weight": 1.086956522,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Question 6",
              "max": 4,
              "weight": 1.086956522,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s7",
              "label": "Question 7",
              "max": 4,
              "weight": 1.086956522,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            27,
            42,
            58,
            72
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-chemistry",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 0.833333333,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 10,
              "weight": 1.086956522,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 10,
              "weight": 1.086956522,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 10,
              "weight": 1.086956522,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 4",
              "max": 4,
              "weight": 1.086956522,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Question 5",
              "max": 4,
              "weight": 1.086956522,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Question 6",
              "max": 4,
              "weight": 1.086956522,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s7",
              "label": "Question 7",
              "max": 4,
              "weight": 1.086956522,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            27,
            42,
            58,
            72
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "chinese-language-and-culture",
      "name": "AP Chinese Language and Culture",
      "category": "World Languages",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-chinese-language-and-culture/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · weighted composite",
          "kind": "composite",
          "source": "College Board component weights",
          "sourceUrl": "https://apcentral.collegeboard.org/courses/ap-chinese-language-and-culture/exam",
          "scale": 100,
          "rounding": "none",
          "fields": [
            {
              "id": "s0",
              "label": "Project presentation",
              "max": 100,
              "weight": 0.2,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s1",
              "label": "Project Q&A",
              "max": 100,
              "weight": 0.15,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s2",
              "label": "Story narration",
              "max": 100,
              "weight": 0.075,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s3",
              "label": "Email response",
              "max": 100,
              "weight": 0.075,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s4",
              "label": "Listening: multiple choice",
              "max": 25,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Reading: multiple choice",
              "max": 30,
              "weight": 0.8333333333333334,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": null,
          "note": "No reliable public 1–5 conversion was verified for this assessment. Calculate the weighted composite, or enter cutoffs from a matching teacher-provided scoring worksheet. Task percentages are earned rubric points ÷ available rubric points × 100."
        }
      ]
    },
    {
      "id": "comparative-government-and-politics",
      "name": "AP Comparative Government and Politics",
      "category": "History & Social Sciences",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-comparative-government-and-politics/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2022 curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-comparative-government-score-calculator/",
          "scale": 120,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 55,
              "weight": 1.090909090909091,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Conceptual Analysis",
              "max": 4,
              "weight": 3.3,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Quantitative Analysis",
              "max": 5,
              "weight": 3.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Comparative Analysis",
              "max": 5,
              "weight": 3.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Argument Essay",
              "max": 5,
              "weight": 3.36,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            43,
            60,
            72,
            84
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-comparative-government-score-calculator/",
          "scale": 120,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 55,
              "weight": 1.0909,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Conceptual Analysis",
              "max": 4,
              "weight": 3.3,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Quantitative Analysis",
              "max": 5,
              "weight": 3,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Comparative Analysis",
              "max": 5,
              "weight": 3,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Argument Essay",
              "max": 5,
              "weight": 3.36,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            43,
            60,
            72,
            84
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-comparative-government",
          "scale": 120,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 55,
              "weight": 1.0909,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Conceptual Analysis",
              "max": 4,
              "weight": 3.3,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Quantitative Analysis",
              "max": 5,
              "weight": 3,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Comparative Analysis",
              "max": 5,
              "weight": 3,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Argument Essay",
              "max": 5,
              "weight": 3.36,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            43,
            60,
            72,
            84
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "computer-science-a",
      "name": "AP Computer Science A",
      "category": "Math & Computer Science",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-computer-science-a/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2026 (Projected) curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-computer-science-a-score-calculator/",
          "scale": 80,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 42,
              "weight": 1.0476190476190477,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 7,
              "weight": 1.44,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 7,
              "weight": 1.44,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 5,
              "weight": 1.44,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 4",
              "max": 6,
              "weight": 1.44,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            29,
            37,
            47,
            62
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2026 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-computer-science-a-score-calculator/",
          "scale": 80,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 42,
              "weight": 1.047619048,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 7,
              "weight": 1.44,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 7,
              "weight": 1.44,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 5,
              "weight": 1.44,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 4",
              "max": 6,
              "weight": 1.44,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            29,
            37,
            47,
            62
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · Projected (2026)",
          "kind": "projected",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-computer-science-a",
          "scale": 80,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 42,
              "weight": 1.047619048,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 7,
              "weight": 1.44,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 7,
              "weight": 1.44,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 5,
              "weight": 1.44,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 4",
              "max": 6,
              "weight": 1.44,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            29,
            37,
            47,
            62
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "computer-science-principles",
      "name": "AP Computer Science Principles",
      "category": "Math & Computer Science",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-computer-science-principles/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2022 curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-computer-science-principles-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 70,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Create task and written responses",
              "max": 100,
              "weight": 0.3,
              "step": 0.1,
              "unit": "percent"
            }
          ],
          "cutoffs": [
            45,
            62,
            81,
            90
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction. Includes Create and exam-day written responses. The curve is a historical reference, not a calibration of the revised task."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-computer-science-principles-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 70,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Create Performance Task",
              "max": 6,
              "weight": 5,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            45,
            62,
            81,
            90
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-computer-science-principles",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 70,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Create Performance Task",
              "max": 6,
              "weight": 5,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            45,
            62,
            81,
            90
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "cybersecurity",
      "name": "AP Cybersecurity",
      "category": "Career Kickstart",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-cybersecurity/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2027 (Projected) curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-cybersecurity-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 1.1666666666666667,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Device Security Analysis",
              "max": 14,
              "weight": 2.142857142857143,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            35,
            55,
            68,
            80
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction. First exam in 2027: this curve has no past exam results to calibrate against."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2027 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-cybersecurity-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 1.1666667,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Device Security Analysis",
              "max": 14,
              "weight": 2.1428571,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            35,
            55,
            68,
            80
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "drawing",
      "name": "AP Drawing",
      "category": "Arts",
      "officialUrl": "https://apcentral.collegeboard.org/media/pdf/ap-art-and-design-course-and-exam-description.pdf",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · weighted composite",
          "kind": "composite",
          "source": "College Board component weights",
          "sourceUrl": "https://apcentral.collegeboard.org/media/pdf/ap-art-and-design-course-and-exam-description.pdf",
          "scale": 100,
          "rounding": "none",
          "fields": [
            {
              "id": "s0",
              "label": "Sustained investigation",
              "max": 100,
              "weight": 0.6,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s1",
              "label": "Selected works",
              "max": 100,
              "weight": 0.4,
              "step": 0.1,
              "unit": "percent"
            }
          ],
          "cutoffs": null,
          "note": "No reliable public 1–5 conversion was verified for this assessment. Calculate the weighted composite, or enter cutoffs from a matching teacher-provided scoring worksheet. Task percentages are earned rubric points ÷ available rubric points × 100."
        }
      ]
    },
    {
      "id": "english-language-and-composition",
      "name": "AP English Language and Composition",
      "category": "English",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-english-language-and-composition/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2025 Curve curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-english-language-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice: Reading",
              "max": 45,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Q1 - Synthesis",
              "max": 6,
              "weight": 3.0555555555555554,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q2 - Rhetorical Analysis",
              "max": 6,
              "weight": 3.0555555555555554,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q3 - Argument",
              "max": 6,
              "weight": 3.0555555555555554,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            42,
            59,
            69,
            79
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2025 Curve",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-english-language-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice: Reading",
              "max": 45,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Q1 - Synthesis",
              "max": 6,
              "weight": 3.0555,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q2 - Rhetorical Analysis",
              "max": 6,
              "weight": 3.0555,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q3 - Argument",
              "max": 6,
              "weight": 3.0555,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            42,
            59,
            69,
            79
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2025 Curve",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-english-language",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice: Reading",
              "max": 45,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Q1 - Synthesis",
              "max": 6,
              "weight": 3.0555,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q2 - Rhetorical Analysis",
              "max": 6,
              "weight": 3.0555,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q3 - Argument",
              "max": 6,
              "weight": 3.0555,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            42,
            59,
            69,
            79
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "english-literature-and-composition",
      "name": "AP English Literature and Composition",
      "category": "English",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-english-literature-and-composition/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2022 curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-english-literature-score-calculator/",
          "scale": 150,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 55,
              "weight": 1.2272727272727275,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Q1 - Poetry Analysis",
              "max": 6,
              "weight": 4.583333333333332,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q2 - Prose Fiction Analysis",
              "max": 6,
              "weight": 4.583333333333332,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q3 - Literary Argument",
              "max": 6,
              "weight": 4.583333333333332,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            53,
            81,
            98,
            114
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-english-literature-score-calculator/",
          "scale": 150,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 55,
              "weight": 1.227272727,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Q1 - Poetry Analysis",
              "max": 6,
              "weight": 4.583333333,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q2 - Prose Fiction Analysis",
              "max": 6,
              "weight": 4.583333333,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q3 - Literary Argument",
              "max": 6,
              "weight": 4.583333333,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            53,
            81,
            98,
            114
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-english-literature",
          "scale": 150,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 55,
              "weight": 1.227272727,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Q1 - Poetry Analysis",
              "max": 6,
              "weight": 4.583333333,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q2 - Prose Fiction Analysis",
              "max": 6,
              "weight": 4.583333333,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q3 - Literary Argument",
              "max": 6,
              "weight": 4.583333333,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            53,
            81,
            98,
            114
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "environmental-science",
      "name": "AP Environmental Science",
      "category": "Sciences",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-environmental-science/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2022 curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-environmental-science-score-calculator/",
          "scale": 130,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 80,
              "weight": 0.975,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 10,
              "weight": 1.733333333333333,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 10,
              "weight": 1.733333333333333,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 10,
              "weight": 1.733333333333333,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            50,
            68,
            77,
            96
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-environmental-science-score-calculator/",
          "scale": 130,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 80,
              "weight": 0.975,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 10,
              "weight": 1.7333,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 10,
              "weight": 1.7333,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 10,
              "weight": 1.7333,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            50,
            68,
            77,
            96
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-environmental-science",
          "scale": 130,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 80,
              "weight": 0.975,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 10,
              "weight": 1.7333,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 10,
              "weight": 1.7333,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 10,
              "weight": 1.7333,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            50,
            68,
            77,
            96
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "european-history",
      "name": "AP European History",
      "category": "History & Social Sciences",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-european-history/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2022 curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-european-history-score-calculator/",
          "scale": 130,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 55,
              "weight": 0.9454545454545454,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Short-answer section",
              "max": 100,
              "weight": 0.26,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s2",
              "label": "Document-based question",
              "max": 100,
              "weight": 0.325,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s3",
              "label": "Long essay",
              "max": 100,
              "weight": 0.195,
              "step": 0.1,
              "unit": "percent"
            }
          ],
          "cutoffs": [
            44,
            63,
            80,
            97
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction. For the revised 2027 written tasks, enter percentages from the scoring rubric. Choose the 2022 reference for older raw-point rubrics."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-european-history-score-calculator/",
          "scale": 130,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 55,
              "weight": 0.945454545454545,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Short-Answer Question 1",
              "max": 3,
              "weight": 2.888888889,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Short-Answer Question 2",
              "max": 3,
              "weight": 2.888888889,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Short-Answer Question 3",
              "max": 3,
              "weight": 2.888888889,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Document-Based Question (DBQ)",
              "max": 7,
              "weight": 4.642857143,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Long-Essay Question (LEQ)",
              "max": 6,
              "weight": 3.25,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            44,
            63,
            80,
            97
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-european-history",
          "scale": 130,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 55,
              "weight": 0.945454545454545,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Short-Answer Question 1",
              "max": 3,
              "weight": 2.888888889,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Short-Answer Question 2",
              "max": 3,
              "weight": 2.888888889,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Short-Answer Question 3",
              "max": 3,
              "weight": 2.888888889,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Document-Based Question (DBQ)",
              "max": 7,
              "weight": 4.642857143,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Long-Essay Question (LEQ)",
              "max": 6,
              "weight": 3.25,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            44,
            63,
            80,
            97
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "french-language-and-culture",
      "name": "AP French Language and Culture",
      "category": "World Languages",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-french-language-and-culture/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2027 (Projected) curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-french-language-score-calculator/",
          "scale": 160,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Project Presentation",
              "max": 11,
              "weight": 2.909090909090909,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Project Q&A",
              "max": 9,
              "weight": 2.6666666666666665,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Argumentative Essay",
              "max": 10,
              "weight": 2.4,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Multiple choice - Part A (Listening)",
              "max": 25,
              "weight": 1.6,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Multiple choice - Part B (Reading)",
              "max": 30,
              "weight": 1.3333333333333333,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            72,
            90,
            113,
            128
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2027 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-french-language-score-calculator/",
          "scale": 160,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Project Presentation",
              "max": 11,
              "weight": 2.9090909,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Project Q&A",
              "max": 9,
              "weight": 2.6666667,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Argumentative Essay",
              "max": 10,
              "weight": 2.4,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Multiple choice - Part A (Listening)",
              "max": 25,
              "weight": 1.6,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Multiple choice - Part B (Reading)",
              "max": 30,
              "weight": 1.3333333,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            72,
            90,
            113,
            128
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "albert-1",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-french-language-score-calculator/",
          "scale": 160,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice - Part A",
              "max": 30,
              "weight": 1.233333333,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Multiple choice - Part B",
              "max": 35,
              "weight": 1.228571429,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Interpersonal Writing",
              "max": 5,
              "weight": 4,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Presentational Writing",
              "max": 5,
              "weight": 4,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Interpersonal Speaking",
              "max": 5,
              "weight": 4,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Presentational Speaking",
              "max": 5,
              "weight": 4,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            72,
            90,
            113,
            128
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-french-language",
          "scale": 160,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice - Part A",
              "max": 30,
              "weight": 1.233333333,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Multiple choice - Part B",
              "max": 35,
              "weight": 1.228571429,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Interpersonal Writing",
              "max": 5,
              "weight": 4,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Presentational Writing",
              "max": 5,
              "weight": 4,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Interpersonal Speaking",
              "max": 5,
              "weight": 4,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Presentational Speaking",
              "max": 5,
              "weight": 4,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            72,
            90,
            113,
            128
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "german-language-and-culture",
      "name": "AP German Language and Culture",
      "category": "World Languages",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-german-language-and-culture/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2027 (Projected) curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-german-language-score-calculator/",
          "scale": 200,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Project Presentation",
              "max": 11,
              "weight": 3.636363636363636,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Project Q&A",
              "max": 9,
              "weight": 3.3333333333333335,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Argumentative Essay",
              "max": 10,
              "weight": 3.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Multiple choice - Part A (Listening)",
              "max": 25,
              "weight": 2.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Multiple choice - Part B (Reading)",
              "max": 30,
              "weight": 1.6666666666666667,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            89,
            117,
            146,
            172
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2027 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-german-language-score-calculator/",
          "scale": 200,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Project Presentation",
              "max": 11,
              "weight": 3.6363636,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Project Q&A",
              "max": 9,
              "weight": 3.3333333,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Argumentative Essay",
              "max": 10,
              "weight": 3,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Multiple choice - Part A (Listening)",
              "max": 25,
              "weight": 2,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Multiple choice - Part B (Reading)",
              "max": 30,
              "weight": 1.6666667,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            89,
            117,
            146,
            172
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "albert-1",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-german-language-score-calculator/",
          "scale": 200,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 30,
              "weight": 1.533333333,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Multiple choice with Audio",
              "max": 35,
              "weight": 1.542857143,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Interpersonal Writing",
              "max": 5,
              "weight": 5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Presentational Writing",
              "max": 5,
              "weight": 5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Interpersonal Speaking",
              "max": 5,
              "weight": 5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Presentational Speaking",
              "max": 5,
              "weight": 5,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            89,
            117,
            146,
            172
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-german-language",
          "scale": 200,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 30,
              "weight": 1.533333333,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Multiple choice with Audio",
              "max": 35,
              "weight": 1.542857143,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Interpersonal Writing",
              "max": 5,
              "weight": 5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Presentational Writing",
              "max": 5,
              "weight": 5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Interpersonal Speaking",
              "max": 5,
              "weight": 5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Presentational Speaking",
              "max": 5,
              "weight": 5,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            89,
            117,
            146,
            172
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "human-geography",
      "name": "AP Human Geography",
      "category": "History & Social Sciences",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-human-geography/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2022 curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-human-geography-score-calculator/",
          "scale": 120,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 7,
              "weight": 2.857142857142857,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 7,
              "weight": 2.857142857142857,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 7,
              "weight": 2.857142857142857,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            47,
            58,
            70,
            84
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-human-geography-score-calculator/",
          "scale": 120,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 7,
              "weight": 2.857142857,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 7,
              "weight": 2.857142857,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 7,
              "weight": 2.857142857,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            47,
            58,
            70,
            84
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-human-geography",
          "scale": 120,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 7,
              "weight": 2.857142857,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 7,
              "weight": 2.857142857,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 7,
              "weight": 2.857142857,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            47,
            58,
            70,
            84
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "italian-language-and-culture",
      "name": "AP Italian Language and Culture",
      "category": "World Languages",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-italian-language-and-culture/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · weighted composite",
          "kind": "composite",
          "source": "College Board component weights",
          "sourceUrl": "https://apcentral.collegeboard.org/courses/ap-italian-language-and-culture/exam",
          "scale": 100,
          "rounding": "none",
          "fields": [
            {
              "id": "s0",
              "label": "Project presentation",
              "max": 100,
              "weight": 0.2,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s1",
              "label": "Project Q&A",
              "max": 100,
              "weight": 0.15,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s2",
              "label": "Argumentative essay",
              "max": 100,
              "weight": 0.15,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s3",
              "label": "Listening: multiple choice",
              "max": 25,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Reading: multiple choice",
              "max": 30,
              "weight": 0.8333333333333334,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": null,
          "note": "No reliable public 1–5 conversion was verified for this assessment. Calculate the weighted composite, or enter cutoffs from a matching teacher-provided scoring worksheet. Task percentages are earned rubric points ÷ available rubric points × 100."
        }
      ]
    },
    {
      "id": "japanese-language-and-culture",
      "name": "AP Japanese Language and Culture",
      "category": "World Languages",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-japanese-language-and-culture/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · weighted composite",
          "kind": "composite",
          "source": "College Board component weights",
          "sourceUrl": "https://apcentral.collegeboard.org/courses/ap-japanese-language-and-culture/exam",
          "scale": 100,
          "rounding": "none",
          "fields": [
            {
              "id": "s0",
              "label": "Project presentation",
              "max": 100,
              "weight": 0.2,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s1",
              "label": "Project Q&A",
              "max": 100,
              "weight": 0.15,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s2",
              "label": "Story narration",
              "max": 100,
              "weight": 0.075,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s3",
              "label": "Email response",
              "max": 100,
              "weight": 0.075,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s4",
              "label": "Listening: multiple choice",
              "max": 25,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Reading: multiple choice",
              "max": 30,
              "weight": 0.8333333333333334,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": null,
          "note": "No reliable public 1–5 conversion was verified for this assessment. Calculate the weighted composite, or enter cutoffs from a matching teacher-provided scoring worksheet. Task percentages are earned rubric points ÷ available rubric points × 100."
        }
      ]
    },
    {
      "id": "latin",
      "name": "AP Latin",
      "category": "World Languages",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-latin/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2027 (Projected) curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-latin-score-calculator/",
          "scale": 120,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 52,
              "weight": 1.153846153846154,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Q1 - Short Answer",
              "max": 8,
              "weight": 1.4999999895833334,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q2 - Translation",
              "max": 15,
              "weight": 0.7999999944444446,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q3 - Short Essay",
              "max": 8,
              "weight": 1.4999999895833334,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Q4 - Project Prose Passage Short Essay",
              "max": 11,
              "weight": 0.9818181931818181,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Q5 - Project Poetry Passage Short Essay",
              "max": 11,
              "weight": 0.9818181931818181,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Course Project: In-Class Checkpoints (teacher-scored)",
              "max": 5,
              "weight": 0.48,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            44,
            57,
            73,
            83
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2027 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-latin-score-calculator/",
          "scale": 120,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 52,
              "weight": 1.1538462,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Q1 - Short Answer",
              "max": 8,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q2 - Translation",
              "max": 15,
              "weight": 0.8,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q3 - Short Essay",
              "max": 8,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Q4 - Project Prose Passage Short Essay",
              "max": 11,
              "weight": 0.9818182,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Q5 - Project Poetry Passage Short Essay",
              "max": 11,
              "weight": 0.9818182,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Course Project: In-Class Checkpoints (teacher-scored)",
              "max": 5,
              "weight": 0.48,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            44,
            57,
            73,
            83
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "macroeconomics",
      "name": "AP Macroeconomics",
      "category": "History & Social Sciences",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-macroeconomics/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2022 curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-macroeconomics-score-calculator/",
          "scale": 90,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Q1 - Long",
              "max": 10,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q2 - Short",
              "max": 5,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q3 - Short",
              "max": 5,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            38,
            49,
            57,
            73
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-macroeconomics-score-calculator/",
          "scale": 90,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Q1 - Long",
              "max": 10,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q2 - Short",
              "max": 5,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q3 - Short",
              "max": 5,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            38,
            49,
            57,
            73
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-macroeconomics",
          "scale": 90,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Q1 - Long",
              "max": 10,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q2 - Short",
              "max": 5,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q3 - Short",
              "max": 5,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            38,
            49,
            57,
            73
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "microeconomics",
      "name": "AP Microeconomics",
      "category": "History & Social Sciences",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-microeconomics/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2022 curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-microeconomics-score-calculator/",
          "scale": 90,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Q1 - Long",
              "max": 10,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q2 - Short",
              "max": 5,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q3 - Short",
              "max": 5,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            39,
            50,
            62,
            75
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-microeconomics-score-calculator/",
          "scale": 90,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Q1 - Long",
              "max": 10,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q2 - Short",
              "max": 5,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q3 - Short",
              "max": 5,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            39,
            50,
            62,
            75
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-microeconomics",
          "scale": 90,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 60,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Q1 - Long",
              "max": 10,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q2 - Short",
              "max": 5,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q3 - Short",
              "max": 5,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            39,
            50,
            62,
            75
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "music-theory",
      "name": "AP Music Theory",
      "category": "Arts",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-music-theory/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2022 curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-music-theory-score-calculator/",
          "scale": 200,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice - Aural",
              "max": 42,
              "weight": 1.0714285714285714,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Multiple choice - Nonaural",
              "max": 33,
              "weight": 1.3636363636363638,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Melodic Dictation Q1",
              "max": 9,
              "weight": 1.000015273238232,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Melodic Dictation Q2",
              "max": 9,
              "weight": 1.000015273238232,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Harmonic Dictation Q1",
              "max": 24,
              "weight": 0.37496890805074207,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Harmonic Dictation Q2",
              "max": 24,
              "weight": 0.37496890805074207,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Part Writing from Figured Bass Q5",
              "max": 25,
              "weight": 0.719991359710943,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s7",
              "label": "Part Writing from Roman Numerals Q6",
              "max": 18,
              "weight": 0.750036001204404,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s8",
              "label": "Harmonization of a Melody Q7",
              "max": 9,
              "weight": 2.5000872756470396,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s9",
              "label": "Sight-singing Q1",
              "max": 9,
              "weight": 1.1111111111111112,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s10",
              "label": "Sight-singing Q2",
              "max": 9,
              "weight": 1.1111111111111112,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            63,
            91,
            115,
            140
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction. Written response contributes 45%; sight singing contributes 10%. Subscores are not calculated."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-music-theory-score-calculator/",
          "scale": 200,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice - Aural",
              "max": 42,
              "weight": 1.0714,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Multiple choice - Nonaural",
              "max": 33,
              "weight": 1.3636,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Melodic Dictation Q1",
              "max": 9,
              "weight": 1.0185,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Melodic Dictation Q2",
              "max": 9,
              "weight": 1.0185,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Harmonic Dictation Q1",
              "max": 24,
              "weight": 0.3819,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Harmonic Dictation Q2",
              "max": 24,
              "weight": 0.3819,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Part Writing from Figured Bass Q5",
              "max": 25,
              "weight": 0.7333,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s7",
              "label": "Part Writing from Roman Numerals Q6",
              "max": 18,
              "weight": 0.7639,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s8",
              "label": "Harmonization of a Melody Q7",
              "max": 9,
              "weight": 2.5463,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s9",
              "label": "Sight-singing Q1",
              "max": 9,
              "weight": 1.0185,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s10",
              "label": "Sight-singing Q2",
              "max": 9,
              "weight": 1.0185,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            63,
            91,
            115,
            140
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-music-theory",
          "scale": 200,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice - Aural",
              "max": 42,
              "weight": 1.0714,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Multiple choice - Nonaural",
              "max": 33,
              "weight": 1.3636,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Melodic Dictation Q1",
              "max": 9,
              "weight": 1.0185,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Melodic Dictation Q2",
              "max": 9,
              "weight": 1.0185,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Harmonic Dictation Q1",
              "max": 24,
              "weight": 0.3819,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Harmonic Dictation Q2",
              "max": 24,
              "weight": 0.3819,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Part Writing from Figured Bass Q5",
              "max": 25,
              "weight": 0.7333,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s7",
              "label": "Part Writing from Roman Numerals Q6",
              "max": 18,
              "weight": 0.7639,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s8",
              "label": "Harmonization of a Melody Q7",
              "max": 9,
              "weight": 2.5463,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s9",
              "label": "Sight-singing Q1",
              "max": 9,
              "weight": 1.0185,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s10",
              "label": "Sight-singing Q2",
              "max": 9,
              "weight": 1.0185,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            63,
            91,
            115,
            140
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "physics-1",
      "name": "AP Physics 1: Algebra-Based",
      "category": "Sciences",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-physics-1/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2027 (Projected) curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-physics-1-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 42,
              "weight": 1.1904761904761905,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Mathematical Routines",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Translation Between Representations",
              "max": 12,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Experimental Design and Analysis",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Qualitative/Quantitative Translation",
              "max": 8,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            25,
            40,
            54,
            70
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2027 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-physics-1-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 42,
              "weight": 1.1904762,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Mathematical Routines",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Translation Between Representations",
              "max": 12,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Experimental Design and Analysis",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Qualitative/Quantitative Translation",
              "max": 8,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            25,
            40,
            54,
            70
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "albert-1",
          "label": "Albert · 2025 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-physics-1-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 40,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Mathematical Routines",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Translation Between Representations",
              "max": 12,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Experimental Design and Analysis",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Qualitative/Quantitative Translation",
              "max": 8,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            25,
            40,
            54,
            70
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "albert-2",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-physics-1-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 50,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Free-Response (Experimental Design)",
              "max": 12,
              "weight": 1.111111111,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Free-Response (Qualitative/Quantitative Translation)",
              "max": 12,
              "weight": 1.111111111,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Free-Response (Paragraph Argument)",
              "max": 7,
              "weight": 1.111111111,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Free-Response (Short Answer 1)",
              "max": 7,
              "weight": 1.111111111,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Free-Response (Short Answer 1)",
              "max": 7,
              "weight": 1.111111111,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            25,
            40,
            54,
            70
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2025 (Projected)",
          "kind": "projected",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-physics-1",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 40,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Mathematical Routines",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Translation Between Representations",
              "max": 12,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Experimental Design and Analysis",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Qualitative/Quantitative Translation",
              "max": 8,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            25,
            40,
            54,
            70
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "physics-2",
      "name": "AP Physics 2: Algebra-Based",
      "category": "Sciences",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-physics-2/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2027 (Projected) curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-physics-2-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 42,
              "weight": 1.1904761904761905,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Mathematical Routines",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Translation Between Representations",
              "max": 12,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Experimental Design and Analysis",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Qualitative/Quantitative Translation",
              "max": 8,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            22,
            41,
            60,
            72
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2027 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-physics-2-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 42,
              "weight": 1.1904762,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Mathematical Routines",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Translation Between Representations",
              "max": 12,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Experimental Design and Analysis",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Qualitative/Quantitative Translation",
              "max": 8,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            22,
            41,
            60,
            72
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "albert-1",
          "label": "Albert · 2025 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-physics-2-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 40,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Mathematical Routines",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Translation Between Representations",
              "max": 12,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Experimental Design and Analysis",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Qualitative/Quantitative Translation",
              "max": 8,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            22,
            41,
            60,
            72
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "albert-2",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-physics-2-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 50,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": ", Free-Response (Experimental Design)",
              "max": 12,
              "weight": 1.136363636,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": ", Free-Response (Quantitative/Qualitative Translation)",
              "max": 12,
              "weight": 1.136363636,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": ", Free-Response (Paragraph Argument)",
              "max": 10,
              "weight": 1.136363636,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": ", Free-Response (Short Answer)",
              "max": 10,
              "weight": 1.136363636,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            22,
            41,
            60,
            72
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2025 (Projected)",
          "kind": "projected",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-physics-2",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 40,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Mathematical Routines",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Translation Between Representations",
              "max": 12,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Experimental Design and Analysis",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Qualitative/Quantitative Translation",
              "max": 8,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            22,
            41,
            60,
            72
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "physics-c-electricity-and-magnetism",
      "name": "AP Physics C: Electricity and Magnetism",
      "category": "Sciences",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-physics-c-electricity-and-magnetism/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2027 (Projected) curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-physics-c-e-and-m-score-calculator/",
          "scale": 90,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 42,
              "weight": 1.0714285714285714,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Mathematical Routines",
              "max": 10,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Translation Between Representations",
              "max": 12,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Experimental Design and Analysis",
              "max": 10,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Qualitative/Quantitative Translation",
              "max": 8,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            20,
            32,
            39,
            53
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2027 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-physics-c-e-and-m-score-calculator/",
          "scale": 90,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 42,
              "weight": 1.0714286,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Mathematical Routines",
              "max": 10,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Translation Between Representations",
              "max": 12,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Experimental Design and Analysis",
              "max": 10,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Qualitative/Quantitative Translation",
              "max": 8,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            20,
            32,
            39,
            53
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "albert-1",
          "label": "Albert · 2025 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-physics-c-e-and-m-score-calculator/",
          "scale": 90,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 40,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Mathematical Routines",
              "max": 10,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Translation Between Representations",
              "max": 12,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Experimental Design and Analysis",
              "max": 10,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Qualitative/Quantitative Translation",
              "max": 8,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            20,
            32,
            39,
            53
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "albert-2",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-physics-c-e-and-m-score-calculator/",
          "scale": 90,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 35,
              "weight": 1.285714286,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 15,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 15,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 15,
              "weight": 1,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            20,
            32,
            39,
            53
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2025 (Projected)",
          "kind": "projected",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-physics-c-e-and-m",
          "scale": 90,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 40,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Mathematical Routines",
              "max": 10,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Translation Between Representations",
              "max": 12,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Experimental Design and Analysis",
              "max": 10,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Qualitative/Quantitative Translation",
              "max": 8,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            20,
            32,
            39,
            53
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "physics-c-mechanics",
      "name": "AP Physics C: Mechanics",
      "category": "Sciences",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-physics-c-mechanics/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2027 (Projected) curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-physics-c-mechanics-score-calculator/",
          "scale": 90,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 42,
              "weight": 1.0714285714285714,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Mathematical Routines",
              "max": 10,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Translation Between Representations",
              "max": 12,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Experimental Design and Analysis",
              "max": 10,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Qualitative/Quantitative Translation",
              "max": 8,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            23,
            31,
            39,
            50
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2027 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-physics-c-mechanics-score-calculator/",
          "scale": 90,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 42,
              "weight": 1.0714286,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Mathematical Routines",
              "max": 10,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Translation Between Representations",
              "max": 12,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Experimental Design and Analysis",
              "max": 10,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Qualitative/Quantitative Translation",
              "max": 8,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            23,
            31,
            39,
            50
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "albert-1",
          "label": "Albert · 2025 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-physics-c-mechanics-score-calculator/",
          "scale": 90,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 40,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Mathematical Routines",
              "max": 10,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Translation Between Representations",
              "max": 12,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Experimental Design and Analysis",
              "max": 10,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Qualitative/Quantitative Translation",
              "max": 8,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            23,
            31,
            39,
            50
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "albert-2",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-physics-c-mechanics-score-calculator/",
          "scale": 90,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 35,
              "weight": 1.2857,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 15,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 15,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 15,
              "weight": 1,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            23,
            31,
            39,
            50
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2025 (Projected)",
          "kind": "projected",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-physics-c-mechanics",
          "scale": 90,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 40,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Mathematical Routines",
              "max": 10,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Translation Between Representations",
              "max": 12,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Experimental Design and Analysis",
              "max": 10,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Qualitative/Quantitative Translation",
              "max": 8,
              "weight": 1.125,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            23,
            31,
            39,
            50
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "precalculus",
      "name": "AP Precalculus",
      "category": "Math & Computer Science",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-precalculus/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2027 (Projected) curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-precalculus-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice - Part A",
              "max": 29,
              "weight": 1.5086206896551722,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Multiple choice - Part B",
              "max": 13,
              "weight": 1.4423076923076923,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 1",
              "max": 6,
              "weight": 1.5625,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 2",
              "max": 6,
              "weight": 1.5625,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 3",
              "max": 6,
              "weight": 1.5625,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Question 4",
              "max": 6,
              "weight": 1.5625,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            31,
            42,
            54,
            67
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction. MCQ Part A and Part B are weighted separately (43.75% and 18.75%)."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2027 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-precalculus-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice - Part A",
              "max": 29,
              "weight": 1.4880952,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Multiple choice - Part B",
              "max": 13,
              "weight": 1.4880952,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 1",
              "max": 6,
              "weight": 1.5625,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 2",
              "max": 6,
              "weight": 1.5625,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 3",
              "max": 6,
              "weight": 1.5625,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Question 4",
              "max": 6,
              "weight": 1.5625,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            31,
            42,
            54,
            67
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "albert-1",
          "label": "Albert · 2024",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-precalculus-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice - Part A",
              "max": 28,
              "weight": 1.565,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Multiple choice - Part B",
              "max": 12,
              "weight": 1.565,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 1",
              "max": 6,
              "weight": 1.565,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 2",
              "max": 6,
              "weight": 1.565,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 3",
              "max": 6,
              "weight": 1.565,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Question 4",
              "max": 6,
              "weight": 1.565,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            31,
            42,
            54,
            67
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2024",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-precalculus",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice - Part A",
              "max": 28,
              "weight": 1.565,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Multiple choice - Part B",
              "max": 12,
              "weight": 1.565,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 1",
              "max": 6,
              "weight": 1.565,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 2",
              "max": 6,
              "weight": 1.565,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 3",
              "max": 6,
              "weight": 1.565,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Question 4",
              "max": 6,
              "weight": 1.565,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            31,
            42,
            54,
            67
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "psychology",
      "name": "AP Psychology",
      "category": "History & Social Sciences",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-psychology/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2025 (Projected) curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-psychology-score-calculator/",
          "scale": 120,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 75,
              "weight": 1.0666666666666669,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Article Analysis Question",
              "max": 7,
              "weight": 2.857142857142857,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Evidence-Based Question",
              "max": 7,
              "weight": 2.857142857142857,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            48,
            71,
            85,
            101
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2025 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-psychology-score-calculator/",
          "scale": 120,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 75,
              "weight": 1.0667,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Article Analysis Question",
              "max": 7,
              "weight": 2.8571,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Evidence-Based Question",
              "max": 7,
              "weight": 2.8571,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            48,
            71,
            85,
            101
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "albert-1",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-psychology-score-calculator/",
          "scale": 150,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 100,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 7,
              "weight": 3.571428571,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 7,
              "weight": 3.571428571,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            65,
            77,
            93,
            113
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2025 (Projected)",
          "kind": "projected",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-psychology",
          "scale": 150,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 75,
              "weight": 1.334,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Article Analysis Question",
              "max": 7,
              "weight": 3.56785,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Evidence-Based Question",
              "max": 7,
              "weight": 3.56785,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            65,
            77,
            93,
            113
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "research",
      "name": "AP Research",
      "category": "Capstone",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-research/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · weighted composite",
          "kind": "composite",
          "source": "College Board component weights",
          "sourceUrl": "https://apcentral.collegeboard.org/courses/ap-research/exam",
          "scale": 100,
          "rounding": "none",
          "fields": [
            {
              "id": "s0",
              "label": "Academic paper",
              "max": 100,
              "weight": 0.75,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s1",
              "label": "Presentation and oral defense",
              "max": 100,
              "weight": 0.25,
              "step": 0.1,
              "unit": "percent"
            }
          ],
          "cutoffs": null,
          "note": "No reliable public 1–5 conversion was verified for this assessment. Calculate the weighted composite, or enter cutoffs from a matching teacher-provided scoring worksheet. Task percentages are earned rubric points ÷ available rubric points × 100."
        }
      ]
    },
    {
      "id": "seminar",
      "name": "AP Seminar",
      "category": "Capstone",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-seminar/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · weighted composite",
          "kind": "composite",
          "source": "College Board component weights",
          "sourceUrl": "https://apcentral.collegeboard.org/courses/ap-seminar/exam",
          "scale": 100,
          "rounding": "none",
          "fields": [
            {
              "id": "s0",
              "label": "Individual research report",
              "max": 100,
              "weight": 0.1,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s1",
              "label": "Team presentation and defense",
              "max": 100,
              "weight": 0.1,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s2",
              "label": "Individual written argument",
              "max": 100,
              "weight": 0.245,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s3",
              "label": "Individual multimedia presentation",
              "max": 100,
              "weight": 0.07,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s4",
              "label": "Oral defense",
              "max": 100,
              "weight": 0.035,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s5",
              "label": "End-of-course Part A",
              "max": 100,
              "weight": 0.135,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s6",
              "label": "End-of-course Part B",
              "max": 100,
              "weight": 0.315,
              "step": 0.1,
              "unit": "percent"
            }
          ],
          "cutoffs": null,
          "note": "No reliable public 1–5 conversion was verified for this assessment. Calculate the weighted composite, or enter cutoffs from a matching teacher-provided scoring worksheet. Task percentages are earned rubric points ÷ available rubric points × 100."
        }
      ]
    },
    {
      "id": "spanish-language-and-culture",
      "name": "AP Spanish Language and Culture",
      "category": "World Languages",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-spanish-language-and-culture/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2027 (Projected) curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-spanish-language-score-calculator/",
          "scale": 150,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Project Presentation",
              "max": 11,
              "weight": 2.7272727272727275,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Project Q&A",
              "max": 9,
              "weight": 2.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Argumentative Essay",
              "max": 10,
              "weight": 2.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Multiple choice - Part A (Listening)",
              "max": 25,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Multiple choice - Part B (Reading)",
              "max": 30,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            71,
            86,
            99,
            117
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2027 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-spanish-language-score-calculator/",
          "scale": 150,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Project Presentation",
              "max": 11,
              "weight": 2.7272727,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Project Q&A",
              "max": 9,
              "weight": 2.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Argumentative Essay",
              "max": 10,
              "weight": 2.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Multiple choice - Part A (Listening)",
              "max": 25,
              "weight": 1.5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Multiple choice - Part B (Reading)",
              "max": 30,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            71,
            86,
            99,
            117
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "albert-1",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-spanish-language-score-calculator/",
          "scale": 150,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice - Section 1A",
              "max": 30,
              "weight": 1.166666667,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Multiple choice - Section 1B",
              "max": 35,
              "weight": 1.171428571,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Interpersonal Writing",
              "max": 5,
              "weight": 3.7,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Presentational Writing",
              "max": 5,
              "weight": 3.7,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Interpersonal Speaking",
              "max": 5,
              "weight": 3.7,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Presentational Speaking",
              "max": 5,
              "weight": 3.7,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            71,
            86,
            99,
            117
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-spanish-language",
          "scale": 150,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice - Section 1A",
              "max": 30,
              "weight": 1.166666667,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Multiple choice - Section 1B",
              "max": 35,
              "weight": 1.171428571,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Interpersonal Writing",
              "max": 5,
              "weight": 3.7,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Presentational Writing",
              "max": 5,
              "weight": 3.7,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Interpersonal Speaking",
              "max": 5,
              "weight": 3.7,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Presentational Speaking",
              "max": 5,
              "weight": 3.7,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            71,
            86,
            99,
            117
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "spanish-literature-and-culture",
      "name": "AP Spanish Literature and Culture",
      "category": "World Languages",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-spanish-literature-and-culture/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2022 curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-spanish-literature-score-calculator/",
          "scale": 150,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice - Interpretive Listening",
              "max": 15,
              "weight": 1.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Multiple choice - Print and Texts",
              "max": 50,
              "weight": 1.2,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q1 - SAQ - Text Explanation",
              "max": 6,
              "weight": 1.875,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q2 - SAQ - Text Explanation",
              "max": 6,
              "weight": 1.875,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Q3 - Essay - Analysis of a Single Text",
              "max": 10,
              "weight": 2.625,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Q4 - Essay - Text Comparison",
              "max": 10,
              "weight": 2.625,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            78,
            87,
            102,
            114
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-spanish-literature-score-calculator/",
          "scale": 150,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice - Interpretive Listening",
              "max": 15,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Multiple choice - Print and Texts",
              "max": 50,
              "weight": 1.2,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q1 - SAQ - Text Explanation",
              "max": 6,
              "weight": 1.875,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q2 - SAQ - Text Explanation",
              "max": 6,
              "weight": 1.875,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Q3 - Essay - Analysis of a Single Text",
              "max": 10,
              "weight": 2.625,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Q4 - Essay - Text Comparison",
              "max": 10,
              "weight": 2.625,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            78,
            87,
            102,
            114
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-spanish-literature",
          "scale": 150,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice - Interpretive Listening",
              "max": 15,
              "weight": 1,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Multiple choice - Print and Texts",
              "max": 50,
              "weight": 1.2,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Q1 - SAQ - Text Explanation",
              "max": 6,
              "weight": 1.875,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Q2 - SAQ - Text Explanation",
              "max": 6,
              "weight": 1.875,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Q3 - Essay - Analysis of a Single Text",
              "max": 10,
              "weight": 2.625,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Q4 - Essay - Text Comparison",
              "max": 10,
              "weight": 2.625,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            78,
            87,
            102,
            114
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "statistics",
      "name": "AP Statistics",
      "category": "Math & Computer Science",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-statistics/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2027 (Projected) curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-statistics-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 42,
              "weight": 1.1904761904761905,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 4",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            29,
            37,
            49,
            63
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2027 (Projected)",
          "kind": "projected",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-statistics-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 42,
              "weight": 1.1904762,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 4",
              "max": 10,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            29,
            37,
            49,
            63
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "albert-1",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-statistics-score-calculator/",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 40,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 4,
              "weight": 1.875,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 4,
              "weight": 1.875,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 4,
              "weight": 1.875,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 4",
              "max": 4,
              "weight": 1.875,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Question 5",
              "max": 4,
              "weight": 1.875,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Question 6 - Investigative Task",
              "max": 4,
              "weight": 3.125,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            29,
            37,
            49,
            63
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-statistics",
          "scale": 100,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 40,
              "weight": 1.25,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Question 1",
              "max": 4,
              "weight": 1.875,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Question 2",
              "max": 4,
              "weight": 1.875,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Question 3",
              "max": 4,
              "weight": 1.875,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Question 4",
              "max": 4,
              "weight": 1.875,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Question 5",
              "max": 4,
              "weight": 1.875,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s6",
              "label": "Question 6 - Investigative Task",
              "max": 4,
              "weight": 3.125,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            29,
            37,
            49,
            63
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "united-states-government-and-politics",
      "name": "AP United States Government and Politics",
      "category": "History & Social Sciences",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-united-states-government-and-politics/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2022 curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-us-government-score-calculator/",
          "scale": 120,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 55,
              "weight": 1.090909090909091,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "FRQ 1: Concept Application",
              "max": 3,
              "weight": 5.0,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "FRQ 2: Quantitative Analysis",
              "max": 4,
              "weight": 3.75,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "FRQ 3: SCOTUS Comparison",
              "max": 4,
              "weight": 3.75,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "FRQ 4: Argument Essay",
              "max": 6,
              "weight": 2.5,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            53,
            73,
            91,
            99
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-us-government-score-calculator/",
          "scale": 120,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 55,
              "weight": 1.0909,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "FRQ 1: Concept Application",
              "max": 3,
              "weight": 5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "FRQ 2: Quantitative Analysis",
              "max": 4,
              "weight": 3.75,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "FRQ 3: SCOTUS Comparison",
              "max": 4,
              "weight": 3.75,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "FRQ 4: Argument Essay",
              "max": 6,
              "weight": 2.5,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            53,
            73,
            91,
            99
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-us-government",
          "scale": 120,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 55,
              "weight": 1.0909,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "FRQ 1: Concept Application",
              "max": 3,
              "weight": 5,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "FRQ 2: Quantitative Analysis",
              "max": 4,
              "weight": 3.75,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "FRQ 3: SCOTUS Comparison",
              "max": 4,
              "weight": 3.75,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "FRQ 4: Argument Essay",
              "max": 6,
              "weight": 2.5,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            53,
            73,
            91,
            99
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "united-states-history",
      "name": "AP United States History",
      "category": "History & Social Sciences",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-united-states-history/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2022 curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-us-history-score-calculator/",
          "scale": 130,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 55,
              "weight": 0.9454545454545454,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Short-answer section",
              "max": 100,
              "weight": 0.26,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s2",
              "label": "Document-based question",
              "max": 100,
              "weight": 0.325,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s3",
              "label": "Long essay",
              "max": 100,
              "weight": 0.195,
              "step": 0.1,
              "unit": "percent"
            }
          ],
          "cutoffs": [
            44,
            63,
            80,
            97
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction. For the revised 2027 written tasks, enter percentages from the scoring rubric. Choose the 2022 reference for older raw-point rubrics."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-us-history-score-calculator/",
          "scale": 130,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 55,
              "weight": 0.9454545455,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Short-Answer Question 1",
              "max": 3,
              "weight": 2.888888889,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Short-Answer Question 2",
              "max": 3,
              "weight": 2.888888889,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Short-Answer Question 3",
              "max": 3,
              "weight": 2.888888889,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Document-Based Question (DBQ)",
              "max": 7,
              "weight": 4.642857143,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Long-Essay Question (LEQ)",
              "max": 6,
              "weight": 3.25,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            44,
            63,
            80,
            97
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-us-history",
          "scale": 130,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 55,
              "weight": 0.9454545455,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Short-Answer Question 1",
              "max": 3,
              "weight": 2.888888889,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Short-Answer Question 2",
              "max": 3,
              "weight": 2.888888889,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Short-Answer Question 3",
              "max": 3,
              "weight": 2.888888889,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Document-Based Question (DBQ)",
              "max": 7,
              "weight": 4.642857143,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Long-Essay Question (LEQ)",
              "max": 6,
              "weight": 3.25,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            44,
            63,
            80,
            97
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    },
    {
      "id": "world-history-modern",
      "name": "AP World History: Modern",
      "category": "History & Social Sciences",
      "officialUrl": "https://apcentral.collegeboard.org/courses/ap-world-history/exam",
      "profiles": [
        {
          "id": "current",
          "label": "2027 format · 2022 curve",
          "kind": "projected",
          "source": "College Board format + Albert curve",
          "sourceUrl": "https://www.albert.io/blog/ap-world-history-score-calculator/",
          "scale": 130,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 55,
              "weight": 0.9454545454545454,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Short-answer section",
              "max": 100,
              "weight": 0.26,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s2",
              "label": "Document-based question",
              "max": 100,
              "weight": 0.325,
              "step": 0.1,
              "unit": "percent"
            },
            {
              "id": "s3",
              "label": "Long essay",
              "max": 100,
              "weight": 0.195,
              "step": 0.1,
              "unit": "percent"
            }
          ],
          "cutoffs": [
            44,
            63,
            80,
            97
          ],
          "note": "Published section weights with an independent reference curve. The 1–5 result is an estimate, not a College Board prediction. For the revised 2027 written tasks, enter percentages from the scoring rubric. Choose the 2022 reference for older raw-point rubrics."
        },
        {
          "id": "albert-0",
          "label": "Albert · 2022",
          "kind": "reference",
          "source": "Albert",
          "sourceUrl": "https://www.albert.io/blog/ap-world-history-score-calculator/",
          "scale": 130,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 55,
              "weight": 0.9454545455,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Short-Answer Question 1",
              "max": 3,
              "weight": 2.888888889,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Short-Answer Question 2",
              "max": 3,
              "weight": 2.888888889,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Short-Answer Question 3",
              "max": 3,
              "weight": 2.888888889,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Document-Based Question (DBQ)",
              "max": 7,
              "weight": 4.642857143,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Long-Essay Question (LEQ)",
              "max": 6,
              "weight": 3.25,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            44,
            63,
            80,
            97
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        },
        {
          "id": "oneprep-0",
          "label": "OnePrep · 2022",
          "kind": "reference",
          "source": "OnePrep",
          "sourceUrl": "https://www.oneprep.com/ap-score-calculator/ap-world-history",
          "scale": 130,
          "rounding": "nearest",
          "fields": [
            {
              "id": "s0",
              "label": "Multiple choice",
              "max": 55,
              "weight": 0.9454545455,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s1",
              "label": "Short-Answer Question 1",
              "max": 3,
              "weight": 2.888888889,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s2",
              "label": "Short-Answer Question 2",
              "max": 3,
              "weight": 2.888888889,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s3",
              "label": "Short-Answer Question 3",
              "max": 3,
              "weight": 2.888888889,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s4",
              "label": "Document-Based Question (DBQ)",
              "max": 7,
              "weight": 4.642857143,
              "step": 1,
              "unit": "points"
            },
            {
              "id": "s5",
              "label": "Long-Essay Question (LEQ)",
              "max": 6,
              "weight": 3.25,
              "step": 1,
              "unit": "points"
            }
          ],
          "cutoffs": [
            44,
            63,
            80,
            97
          ],
          "note": "A named calculator reference, not an official future exam curve. Use the matching practice-exam format."
        }
      ]
    }
  ]
};
  if(typeof module==="object"&&module.exports)module.exports=data;
  else root.APScoreModels=data;
})(typeof window==="object"?window:this);
