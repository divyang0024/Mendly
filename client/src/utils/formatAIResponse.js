export const formatAIResponse = (text) => {
  if (!text) return "";

  return text
    .replace(/\r\n/g, "\n") // Windows → normal
    .replace(/\n{3,}/g, "\n\n") // Remove excessive gaps
    .trim();
};
