/*
* Formats a date object as a relative string (e.g., "5 minutes ago")
* */
export function formatTimeAgo(date: Date): string {
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const cutoffs: { unit: Intl.RelativeTimeFormatUnit; secs: number }[] = [
    { unit: "year", secs: 31536000 },
    { unit: "month", secs: 2592000 },
    { unit: "week", secs: 604800 },
    { unit: "day", secs: 86400 },
    { unit: "hour", secs: 3600 },
    { unit: "minute", secs: 60 },
  ] as const;

  for (const cutoff of cutoffs) {
    if (Math.abs(seconds) >= cutoff.secs) {
      return rtf.format(Math.round(seconds / cutoff.secs), cutoff.unit);
    }
  }

  return rtf.format(seconds, "second");
}

/*
* Maps a score to a Tailwind background color class
* */
export function scoreToColor(score: number): string {
  if (score < 0) return "bg-(--negative-color)";
  if (score > 0) return "bg-(--positive-color)";
  return "bg-(--neutral-color)";
}

/*
* Formats a number as an ordinal (e.g., 1 -> 1st)
* */
export function formatPosition(number: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = number % 100;
  return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}
