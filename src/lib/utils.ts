export function formatTimeAgo(date: Date): string {
  const time = date.getTime();
  const now = Date.now();

  const diffInSeconds = Math.round((time - now) / 1000);
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

export function parseSearch(query: string): Record<string, string> {
  const result: Record<string, string> = {};
  const regex = /(\w+)=(?:"([^"]*)"|([^\s"]+))/g;

  for (const match of query.matchAll(regex)) {
    const key = match[1];
    result[key] = match[2] ?? match[3];
  }

  return result;
}

export function scoreToColor(score: number): string {
  if (score < 0) return "bg-red-700";
  if (score > 0) return "bg-green-700";
  return "bg-yellow-600";
}
