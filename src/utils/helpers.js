export function formatReadingTime(minutes) {
  let count = Math.round(minutes / 10);
  return `${
    count <= 1
      ? '📰'
      : count <= 3
      ? '📙'
      : new Array(count || 1).fill('📚️').join('')
  } ${minutes} min read`;
}

export function formatPostDate(date) {
  if (typeof Date.prototype.toLocaleDateString !== 'function') {
    return date;
  }

  return new Date(date).toLocaleDateString({
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
