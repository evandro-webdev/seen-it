<script setup>
import { computed } from "vue";
import { formatRuntime } from "@/utils/formatters.js";
import MovieGenre from "../ui/MovieGenre.vue";

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const releaseYear = computed(() => {
  return props.movie.release_date
    ? props.movie.release_date.slice(0, 4)
    : "Ano N/A";
});

const formattedRuntime = computed(() => {
  return props.movie.runtime ? formatRuntime(props.movie.runtime) : null;
});

const directorName = computed(() => {
  if (!props.movie.credits?.crew) return "Desconhecido";
  const director = props.movie.credits.crew.find((p) => p.job === "Director");
  return director ? director.name : "Desconhecido";
});

const castNames = computed(() => {
  const cast = props.movie.credits?.cast;
  if (!cast || cast.length === 0) return "Não disponível";
  return cast
    .slice(0, 2)
    .map((p) => p.name)
    .join(", ");
});

const formattedRating = computed(() => {
  const vote = props.movie.vote_average;
  if (vote === undefined || vote === null || vote === 0) return "N/A";
  return vote.toFixed(1);
});
</script>

<template>
  <div class="flex items-center gap-3.5 cursor-pointer group">
    <div
      class="relative shrink-0 w-[120px] h-[180px] rounded-xl overflow-hidden bg-gray-200 dark:bg-slate-800 flex items-center justify-center text-center shadow-sm"
    >
      <img
        v-if="movie.poster_path"
        :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
        :alt="movie.title"
        loading="lazy"
        class="w-full h-full object-cover rounded-xl transition-transform duration-300"
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
        class="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white bg-gradient-to-r from-[#082B42] to-[#3F808C] shadow-md flex items-center gap-1 backdrop-blur-xs border border-white/10"
      >
        <img
          src="/img/tmdb.jpg"
          alt="TMDB"
          class="w-3.5 h-3.5 rounded-full object-cover shrink-0"
        />
        <span>{{ formattedRating }}</span>
      </div>
    </div>

    <div class="flex flex-col justify-center gap-1.5 flex-1 min-w-0">
      <div class="space-y-0.5">
        <h3
          class="text-sm font-bold text-gray-800 dark:text-white truncate transition-colors"
        >
          {{ movie.title || "Título Desconhecido" }}
        </h3>

        <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
          <span>{{ releaseYear }}</span>
          <template v-if="formattedRuntime">
            <span> · </span>
            <span>{{ formattedRuntime }}</span>
          </template>
        </p>
      </div>

      <div class="space-y-0.5 text-xs">
        <p class="text-gray-500 dark:text-gray-400 truncate">
          <span class="font-medium text-gray-400 dark:text-gray-500"
            >Direção:</span
          >
          <span class="ml-1 text-gray-700 dark:text-gray-200 font-medium">{{
            directorName
          }}</span>
        </p>

        <p class="text-gray-500 dark:text-gray-400 truncate">
          <span class="font-medium text-gray-400 dark:text-gray-500"
            >Elenco:</span
          >
          <span class="ml-1 text-gray-700 dark:text-gray-200 font-medium">{{
            castNames
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
