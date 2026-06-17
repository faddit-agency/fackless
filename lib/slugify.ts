export function createArticleSlug(title: string) {
  const trimmed = title.trim();
  const base = trimmed
    .toLowerCase()
    .replace(/[^\w\uAC00-\uD7A3\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);

  const suffix = Date.now().toString(36).slice(-5);
  return base ? `${base}-${suffix}` : `article-${suffix}`;
}
