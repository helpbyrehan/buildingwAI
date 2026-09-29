function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validText(value, maximum) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maximum &&
    !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value);
}

function isValidWorkerResult(payload, mode, count) {
  if (!isRecord(payload) || !isRecord(payload.result) || payload.result.mode !== mode) return false;
  const result = payload.result;
  if (!validText(result.title, 140)) return false;

  if (mode === "summary") {
    return validText(result.summary, 4_000) && Array.isArray(result.key_terms) &&
      result.key_terms.length <= 12 && result.key_terms.every((item) => isRecord(item) &&
        validText(item.term, 100) && validText(item.definition, 500)) &&
      Array.isArray(result.warnings) && result.warnings.length <= 3 &&
      result.warnings.every((warning) => validText(warning, 500));
  }

  if (mode === "quiz") {
    return Array.isArray(result.questions) && result.questions.length === count &&
      result.questions.every((item) => isRecord(item) && validText(item.question, 500) &&
        Array.isArray(item.choices) && item.choices.length === 4 &&
        item.choices.every((choice) => validText(choice, 300)) &&
        Number.isInteger(item.correct_index) && Number(item.correct_index) >= 0 &&
        Number(item.correct_index) <= 3 && validText(item.explanation, 1_000));
  }

  return Array.isArray(result.cards) && result.cards.length === count &&
    result.cards.every((item) => isRecord(item) && validText(item.front, 400) && validText(item.back, 1_200));
}


module.exports = { isRecord, validText, isValidWorkerResult };
