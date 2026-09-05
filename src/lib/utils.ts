import { RELATIVE_TIME_CUTOFFS } from "@/lib/constants";

/*
 * Formats a timestamp into human-readable relative time (e.g., "5 minutes ago")
 * */
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
export function formatTimeAgo(timestamp: string): string {
  const delta = Math.round((Date.parse(timestamp) - Date.now()) / 1000);

  for (const cutoff of RELATIVE_TIME_CUTOFFS) {
    if (Math.abs(delta) >= cutoff.seconds) {
      return rtf.format(Math.round(delta / cutoff.seconds), cutoff.unit);
    }
  }

  return rtf.format(delta, "second");
}

/*
 * Returns the ordinal suffix for a number (e.g., 1 -> st, 2 -> nd)
 * */
const pluralRules = new Intl.PluralRules("en", { type: "ordinal" });
export function getOrdinalSuffix(number: number): string {
  const suffixes: Record<string, string> = {
    one: "st",
    two: "nd",
    few: "rd",
    other: "th",
  };

  return suffixes[pluralRules.select(number)];
}

/*
 * Returns a new array with the same items in a random order
 * */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/*
 * Normalizes text by removing whitespace and converting to lowercase for string comparison
 * */
export function normalizeText(text: string): string {
  return text.replace(/\s+/g, "").toLowerCase();
}

/*
 * Safely extract and trim a string value from FormData
 */
export function parseFormString(
  formData: FormData,
  key: string,
): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") return null;

  return value.trim() || null;
}
