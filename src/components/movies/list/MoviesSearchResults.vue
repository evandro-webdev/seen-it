<script setup>
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import MovieCardDetailed from "../cards/MovieCardDetailed.vue";
import MovieSearchEmpty from "../ui/messages/MovieSearchEmpty.vue";

defineProps({
  searchResults: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isLoadingMore: {
    type: Boolean,
    default: false,
  },
  searchQuery: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["open-movie-modal", "clear-search"]);
</script>

<template>
  <div class="space-y-4">
    <LoadingSpinner
      v-if="isLoading"
      full-screen
    />

    <template v-else>
      <MovieSearchEmpty
        v-if="searchResults.length === 0"
        :search-query="searchQuery"
        @clear="emit('clear-search')"
      />

      <MovieCardDetailed
        v-else
        v-for="movie in searchResults"
        :key="movie.id"
        :movie="movie"
        @click="emit('open-movie-modal', movie.id)"
      />

      <LoadingSpinner
        v-if="isLoadingMore"
        size="sm"
      />
    </template>
  </div>
</template>
