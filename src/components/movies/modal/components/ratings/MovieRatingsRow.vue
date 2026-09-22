<script setup>
import { computed } from "vue";
import { useMovieDetailsStore } from "@/stores/movieDetails.js";

import { UsersRound } from "@lucide/vue";

import MovieRatingMember from "./MovieRatingMember.vue";
import MovieRating from "./MovieRating.vue";

const props = defineProps({
  selectedReviewer: {
    type: [String, null],
    default: null,
  },
});

const emit = defineEmits(["update:selectedReviewer"]);

const movieDetailsStore = useMovieDetailsStore();
const movie = computed(() => movieDetailsStore.selectedMovie);
</script>

<template>
  <div
    class="mt-4 flex items-center gap-x-3 overflow-x-auto"
    :class="{
      'p-2 rounded-xl border border-gray-200 dark:border-[#2c3042]':
        movie?.reviews,
    }"
  >
    <template v-if="movie?.reviews">
      <template
        v-for="(review, uid) in movie.reviews"
        :key="uid"
      >
        <MovieRatingMember
          :uid="uid"
          :review="review"
          @click="emit('update:selectedReviewer', uid)"
        />
      </template>
    </template>

    <MovieRating
      v-if="movie?.reviews && Object.keys(movie.reviews).length > 1"
      variant="blue"
      label="Média"
      :rating="movie.average_rating"
    >
      <template #icon>
        <UsersRound class="w-4 h-4 text-[#356dd5] dark:text-[#4787ff]" />
      </template>
    </MovieRating>

    <MovieRating
      variant="teal"
      :label="movie?.vote_average > 0 ? 'TMDB' : 'Sem avaliações'"
      :rating="movie?.vote_average"
    >
      <template #icon>
        <img
          src="/img/tmdb.svg"
          class="w-4 h-4"
          alt="TMDB Logo"
        />
      </template>
    </MovieRating>
  </div>
</template>
