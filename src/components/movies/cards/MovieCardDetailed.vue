<script setup>
import { formatRuntime } from "@/utils/formatters.js";
import MovieGenre from "../ui/MovieGenre.vue";

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
      class="min-w-[125px] w-[125px] h-[185px] aspect-[185/280] rounded-lg overflow-hidden relative bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-center"
    >
      <img
        v-if="movie.poster_path"
        :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
        :alt="movie.title"
        class="w-full h-full object-cover rounded-lg flex-shrink-0"
      />
      <div
        v-else
        class="p-2 flex flex-col items-center justify-center"
      >
        <span
          class="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase leading-tight"
        >
          Sem Imagem
        </span>
      </div>

      <div
        v-if="movie.vote_average !== undefined && movie.vote_average !== null"
        class="absolute bottom-2 right-2 pl-[2px] pr-[4px] rounded-full text-xs font-medium text-white bg-linear-to-r from-[#082B42] from-50% to-[#3F808C] flex items-center gap-1"
      >
        <img
          src="/img/tmdb.jpg"
          alt="TMDB Logo"
          class="w-[20px] h-[20px] rounded-full"
        />
        <span class="text-xs font-black contents">
          {{ movie.vote_average > 0 ? movie.vote_average.toFixed(1) : "N/A" }}
        </span>
      </div>
    </div>

    <div class="flex flex-col gap-2 flex-1 min-w-0">
      <div class="space-y-1">
        <h3
          class="text-sm font-semibold text-[#3C3C3C] dark:text-white truncate"
        >
          {{ movie.title || "Título Desconhecido" }}
        </h3>

        <p class="text-xs text-gray-500 dark:text-gray-300">
          <span>{{
            movie.release_date ? movie.release_date.slice(0, 4) : "Ano N/A"
          }}</span>
          <span> · </span>
          <span>{{
            movie.runtime ? formatRuntime(movie.runtime) : "Duração N/A"
          }}</span>
        </p>
      </div>

      <div class="space-y-1">
        <p class="text-xs text-gray-500 dark:text-gray-300 truncate">
          Diretor:
          <span class="text-[#0088FF] dark:text-[#0088FF]">{{
            movie.credits?.crew?.find((p) => p.job === "Director")?.name ||
            "Desconhecido"
          }}</span>
        </p>

        <p class="text-xs text-gray-500 dark:text-gray-300 truncate">
          Elenco:
          <span class="text-[#0088FF] dark:text-[#0088FF]">{{
            movie.credits?.cast && movie.credits.cast.length > 0
              ? movie.credits.cast
                  .slice(0, 2)
                  .map((p) => p.name)
                  .join(", ")
              : "Não disponível"
          }}</span>
        </p>
      </div>

      <div
        v-if="movie.genres && movie.genres.length > 0"
        class="flex flex-wrap gap-1 mt-1"
      >
        <MovieGenre
          v-for="genre in movie.genres.slice(0, 3)"
          :key="genre.id"
          :genre="genre.name"
        />
      </div>
    </div>
  </div>
</template>
