/* Public browser configuration only. Never place a Supabase service-role key here. */
window.AP_STUDY_HUB_CONFIG = {
  SUPABASE_URL: "https://ooueqdvguiiawfcmzkcr.supabase.co",
  SUPABASE_KEY: "sb_publishable_tCJc8-qyAWEekW_jWak-8Q_A-WV1oTA",
  PENDING_BUCKET: "ap-resources",
  PUBLIC_BUCKET: "ap-public-resources",
  MAX_UPLOAD_MB: 25,
  // GitHub Pages serves static files; Vercel runs the authenticated AI API.
  // Keep Vercel production/preview deployments on their own same-origin API.
  ESSAY_COACH_API_URL: window.location.hostname.endsWith(".github.io")
    ? "https://buildingwai-apstudyhub.vercel.app/api/essay-coach"
    : "/api/essay-coach",
  STUDY_AI_API_URL: window.location.hostname.endsWith(".github.io")
    ? "https://buildingwai-apstudyhub.vercel.app/api/study-ai"
    : "/api/study-ai",
};
