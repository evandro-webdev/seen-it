<script setup>
import { computed, defineEmits } from "vue";
import { Search } from "@lucide/vue";

const props = defineProps({
  currentTab: {
    type: String,
    required: true,
  },
});

const placeholder = computed(() => {
  if (props.currentTab === "watched") return "Buscar filmes assistidos";
  if (props.currentTab === "saved") return "Buscar filmes salvos";
  return "Qual filme você está procurando?";
});

const searchQuery = defineModel();

const emit = defineEmits(["search"]);
</script>

<template>
  <form
    @submit.prevent="emit('search', searchQuery)"
    class="relative"
  >
    <input
      id="search-input"
      type="search"
      v-model="searchQuery"
      class="w-full p-4 rounded-2xl text-sm text-gray-700 dark:text-gray-300 bg-[#F7F7F7] dark:bg-[#282E4D] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      :class="{ 'pr-12': currentTab === 'discover' }"
      :placeholder="placeholder"
    />
    <button
      v-if="currentTab === 'discover'"
      class="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-xl text-white bg-linear-to-t from-[#194476] to-[#215DA2] transition-all"
    >
      <Search class="w-6 h-6 text-white" />
    </button>
  </form>
</template>
