/**
 * GRANTLY Security & Data Sanitization Suite
 * 
 * Client-side security utilities:
 * - HTML string sanitization to prevent XSS injection
 * - Safe JSON parsing with fallback recovery
 * - Input validation & boundary clamping (GPA, Currency, Text length)
 */

/**
 * Sanitizes user input string by stripping or escaping dangerous HTML characters.
 * Prevents stored XSS when persisting or rendering student profile/note fields.
 */
export function sanitizeText(input: unknown, maxLength: number = 500): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Strip leading/trailing whitespace
  let clean = input.trim();

  // Enforce maximum length
  if (clean.length > maxLength) {
    clean = clean.substring(0, maxLength);
  }

  // Replace HTML special characters with their safe entities
  return clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates and clamps a GPA value between 0.00 and 4.00.
 */
export function validateGPA(gpa: unknown): number {
  const parsed = typeof gpa === 'number' ? gpa : parseFloat(String(gpa));
  if (isNaN(parsed) || parsed < 0) {
    return 0.0;
  }
  if (parsed > 4.0) {
    return 4.0;
  }
  return Math.round(parsed * 100) / 100;
}

/**
 * Validates and clamps financial currency numbers (positive integers).
 */
export function validateCurrencyAmount(amount: unknown, max: number = 1000000): number {
  const parsed = typeof amount === 'number' ? amount : parseInt(String(amount), 10);
  if (isNaN(parsed) || parsed < 0) {
    return 0;
  }
  return Math.min(parsed, max);
}

/**
 * Safely parses JSON string with guaranteed fallback to prevent runtime crashes.
 */
export function safeJsonParse<T>(jsonString: string | null, fallback: T): T {
  if (!jsonString) return fallback;
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && typeof parsed === 'object') {
      return parsed as T;
    }
    return fallback;
  } catch {
    console.warn('[GRANTLY Security] Safe JSON Parse failed; applying fallback defaults.');
    return fallback;
  }
}
