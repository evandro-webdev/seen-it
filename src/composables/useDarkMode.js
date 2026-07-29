import { ref } from 'vue'

function getInitialTheme() {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    return savedTheme === 'dark'
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

const isDarkMode = ref(getInitialTheme())

if (typeof window !== 'undefined') {
  document.documentElement.classList.toggle('dark', isDarkMode.value)
}

export function useDarkMode() {
  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
    document.documentElement.classList.toggle('dark', isDarkMode.value)
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  }

  return { isDarkMode, toggleDarkMode }
}