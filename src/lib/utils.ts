export function formatTimeAgo(date: Date): string {
  const diffInSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const cutoffs = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
  ] as const;

  for (const { unit, seconds } of cutoffs) {
    if (Math.abs(diffInSeconds) >= seconds) {
      return rtf.format(Math.round(diffInSeconds / seconds), unit);
    }
  }

  return rtf.format(diffInSeconds, "second");
}

export function scoreToColor(score: number): string {
  if (score < 0) return "bg-(--negative-color)";
  if (score > 0) return "bg-(--positive-color)";
  return "bg-(--neutral-color)";
}

export function formatPosition(number: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = number % 100;
  return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}
