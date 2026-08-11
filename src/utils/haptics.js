
const isSupported = () => typeof window !== "undefined" && "vibrate" in navigator;

export const haptic = {
  light() {
    if (isSupported()) {
      navigator.vibrate(10);
    }
  },

  medium() {
    if (isSupported()) {
      navigator.vibrate(25);
    }
  },

  success() {
    if (isSupported()) {
      navigator.vibrate([15, 30, 15]);
    }
  },

  error() {
    if (isSupported()) {
      navigator.vibrate([40, 50, 40]);
    }
  },

  custom(pattern) {
    if (isSupported()) {
      navigator.vibrate(pattern);
    }
  }
};