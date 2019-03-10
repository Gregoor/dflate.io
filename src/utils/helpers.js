export function formatReadingTime(minutes) {
  let books = Math.round(minutes / 10);
  return `${new Array(books || 1).fill('📚️').join('')} ${minutes} min read`;
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
