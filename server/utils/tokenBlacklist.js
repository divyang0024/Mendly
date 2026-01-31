const blacklist = new Set();

export const addToBlacklist = (token) => {
  if (!token) return;
  blacklist.add(token);
};

export const isBlacklisted = (token) => {
  if (!token) return false;
  return blacklist.has(token);
};
