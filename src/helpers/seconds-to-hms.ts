export const secondsToHms = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 3600 % 60);

  const parts = [];
  if (h > 0) {
    parts.push(h + ' час.');
  }

  if (m > 0) {
    parts.push(m + ' мин.');
  }

  if (s > 0) {
    parts.push(s + ' сек.');
  }

  return parts.join(', ');
};
