import sanitizeHtml from "sanitize-html";

export const DEFAULT_ALLOWED_TAGS = [
  "b",
  "i",
  "em",
  "strong",
  "a",
  "p",
  "br",
  "ul",
  "ol",
  "li",
  "span",
  "sub",
  "sup",
  "strike",
  "u",
  "code",
  "pre",
  "blockquote",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
];

export const DEFAULT_ALLOWED_ATTRIBUTES = {
  a: ["href", "target", "rel"],
  span: ["class", "style"],
  p: ["class", "style"],
  div: ["class", "style"],
};

/**
 * Sanitizes rich text HTML content to prevent XSS vulnerabilities.
 */
export function sanitizeRichText(
  html: string | null | undefined,
  options?: sanitizeHtml.IOptions,
): string {
  if (!html || typeof html !== "string") return "";

  return sanitizeHtml(html, {
    allowedTags: options?.allowedTags || DEFAULT_ALLOWED_TAGS,
    allowedAttributes: options?.allowedAttributes || DEFAULT_ALLOWED_ATTRIBUTES,
    ...options,
  });
}
