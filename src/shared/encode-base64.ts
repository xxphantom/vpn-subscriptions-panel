export const encodeBase64 = (str: string): string => {
  const encoded = Buffer.from(str).toString("base64");
  return `base64:${encoded}`;
};
