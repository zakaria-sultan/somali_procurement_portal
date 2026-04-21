export function formatPostedLabel(posted: Date): string {
  const now = new Date();
  const d0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d1 = new Date(
    posted.getFullYear(),
    posted.getMonth(),
    posted.getDate()
  );
  const diffDays = Math.round(
    (d0.getTime() - d1.getTime()) / (24 * 60 * 60 * 1000)
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return posted.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatExpiryLabel(expiry: Date): string {
  return expiry.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
