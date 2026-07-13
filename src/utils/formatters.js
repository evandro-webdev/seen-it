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
  return rating === 10 || rating === "10.0" ? "10" : Number(rating).toFixed(1);
}

export function truncateText(text, limit = 250) {
  if (!text) return "";
  if (text.length <= limit) return text;

  return text.slice(0, limit).replace(/\.+$/, "") + "...";
}

export function formatRelativeTime(dateInput) {
  if (!dateInput) return "";

  let date;
  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (dateInput?.seconds) {
    date = new Date(dateInput.seconds * 1000);
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((date - now) / 1000);

  if (Math.abs(diffInSeconds) < 15) {
    return "Agora";
  }

  const divisions = [
    { amount: 60, name: "seconds" },
    { amount: 60, name: "minutes" },
    { amount: 24, name: "hours" },
    { amount: 7, name: "days" },
    { amount: 4.34524, name: "weeks" },
    { amount: 12, name: "months" },
    { amount: Number.POSITIVE_INFINITY, name: "years" },
  ];

  let rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "always" });
  let duration = diffInSeconds;

  for (let i = 0; i < divisions.length; i++) {
    const division = divisions[i];
    if (Math.abs(duration) < division.amount) {
      let result = rtf.format(Math.round(duration), division.name);

      if (result.includes("0")) return "Agora";

      return result;
    }
    duration /= division.amount;
  }
}
