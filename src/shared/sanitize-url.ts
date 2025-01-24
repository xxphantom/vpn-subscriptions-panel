export function sanitizeUrl(str: string): string {
  const replacedSpaces = str.replace(/\s+/g, "-");
  return replacedSpaces.replace(/[^a-zA-Z0-9-_]/g, "").toLowerCase();
}
