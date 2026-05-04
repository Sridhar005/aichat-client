export const sanitize = (value: string) => {
  return value
    .trim()
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};