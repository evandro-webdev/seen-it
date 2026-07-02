<script setup>
import { formatRuntime } from "@/utils/formatters.js";
import MovieGenre from "./MovieGenre.vue";

defineProps({
  movie: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="flex items-center gap-4 cursor-pointer">
    <div
      class="min-w-[125px] w-[125px] h-[185px] aspect-[185/280] rounded-lg overflow-hidden relative"
    >
      <img
        :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
        :alt="movie.title"
        alt="Poster do filme"
        class="w-full rounded-lg flex-shrink-0"
      />
      <div
        class="absolute bottom-2 right-2 pl-[2px] pr-[4px] rounded-full text-xs font-medium text-white bg-linear-to-r from-[#082B42] from-50% to-[#3F808C] flex items-center gap-1"
      >
        <img
          src="/img/tmdb.jpg"
          alt="TMDB Logo"
          class="w-[20px] h-[20px] rounded-full"
        />
        <span class="text-xs font-black contents">{{
          movie.vote_average.toFixed(1)
        }}</span>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="space-y-1">
        <h3 class="text-sm font-semibold text-[#3C3C3C] dark:text-white">
          {{ movie.title }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-300">
          {{
            movie.release_date.slice(0, 4) +
            " · " +
            formatRuntime(movie.runtime)
          }}
        </p>
      </div>
      <div class="space-y-1">
        <p class="text-xs text-gray-500 dark:text-gray-300">
          Diretor:
          <span class="text-[#0088FF] dark:text-[#0088FF]">{{
            movie.credits.crew.find((p) => p.job === "Director")?.name ||
            "Desconhecido"
          }}</span>
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-300">
          Elenco:
          <span class="text-[#0088FF] dark:text-[#0088FF]">{{
            movie.credits.cast
              .slice(0, 2)
              .map((p) => p.name)
              .join(", ")
          }}</span>
        </p>
      </div>
      <div class="flex flex-wrap gap-1 mt-1">
        <MovieGenre
          v-for="genre in movie.genres.slice(0, 3)"
          :key="genre.id"
          :genre="genre.name"
        />
      </div>
    </div>
  </div>
</template>
