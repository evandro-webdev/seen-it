export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatRuntime(minutes) {
  if (!minutes) return "—";
  
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  
  return `${h}h ${m}m`;
}

export function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function formatRating(rating) {
  return rating === 10 || rating === '10.0' ? '10' : Number(rating).toFixed(1)
}

export function truncateText(text, limit = 250) {
  if (!text) return "";
  if (text.length <= limit) return text;

  return text.slice(0, limit).replace(/\.+$/, "") + "...";
}