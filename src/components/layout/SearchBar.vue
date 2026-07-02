<script setup>
import { Search } from "@lucide/vue";

const searchQuery = defineModel();
</script>

<template>
  <form
    @submit.prevent
    class="relative"
  >
    <Search
      class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
    />
    <input
      type="search"
      v-model="searchQuery"
      enterkeyhint="search"
      class="w-full p-4 pl-11 rounded-2xl text-sm text-gray-700 dark:text-gray-300 bg-[#F7F7F7] dark:bg-[#282E4D] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      placeholder="Que filme você está procurando?"
    />
  </form>
</template>
