<script setup>
defineProps({
  genres: {
    type: Array,
    default: () => [],
  },
  selectedGenreId: {
    type: [Number, null],
    default: null,
  },
});

const emit = defineEmits(["select-genre"]);
</script>

<template>
  <div class="w-full overflow-x-auto no-scrollbar py-1">
    <div class="flex items-center gap-2 w-max">
      <button
        @click="emit('select-genre', null)"
        type="button"
        class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap border"
        :class="
          selectedGenreId === null
            ? 'bg-[#0088FF] text-white border-[#0088FF] shadow-xs'
            : 'bg-gray-100 dark:bg-[#161f30] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-[#242C3C]'
        "
      >
        Tudo
      </button>

      <button
        v-for="genre in genres"
        :key="genre.id"
        @click="emit('select-genre', genre.id)"
        type="button"
        class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap border"
        :class="
          selectedGenreId === genre.id
            ? 'bg-[#0088FF] text-white border-[#0088FF] shadow-xs'
            : 'bg-gray-100 dark:bg-[#161f30] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-[#242C3C]'
        "
      >
        {{ genre.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
