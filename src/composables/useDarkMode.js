import { ref } from 'vue'

const isDarkMode = ref(localStorage.getItem('theme') === 'dark')

if (isDarkMode.value) document.documentElement.classList.add('dark')

export function useDarkMode() {
  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
    document.documentElement.classList.toggle('dark', isDarkMode.value)
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  }

  return { isDarkMode, toggleDarkMode }
}