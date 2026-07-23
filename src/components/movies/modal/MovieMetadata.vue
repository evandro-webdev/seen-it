<script setup>
import { ref, computed } from "vue";
import { Info } from "@lucide/vue";
import MovieGenre from "../ui/MovieGenre.vue";

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const showFullOverview = ref(false);

const releaseYear = computed(() => {
  if (!props.movie?.release_date) return "Em breve";
  return props.movie.release_date.slice(0, 4);
});

const formattedRuntime = computed(() => {
  const runtime = props.movie?.runtime;
  if (!runtime || runtime === 0) return null;
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
});

function truncateText(text, limit) {
  if (!text) return "";
  if (text.length <= limit) return text;
  return text.slice(0, limit) + "...";
}
</script>

<template>
  <div class="space-y-4">
    <div
      class="mt-2 mb-3 text-xs text-[#5E5E5E] dark:text-gray-300 flex items-center flex-wrap gap-2"
    >
      <div
        v-if="movie.genres?.length"
        class="flex gap-1.5 flex-wrap"
      >
        <MovieGenre
          v-for="genre in movie.genres"
          :key="genre.id"
          :genre="genre.name"
        />
      </div>

      <span v-if="movie.genres?.length">·</span>
      <span>{{ releaseYear }}</span>

      <template v-if="formattedRuntime">
        <span>·</span>
        <span>{{ formattedRuntime }}</span>
      </template>
    </div>

    <div>
      <div v-if="movie.overview">
        <p
          class="text-[15px] text-gray-600 dark:text-gray-300 font-light leading-relaxed"
        >
          {{
            showFullOverview
              ? movie.overview
              : truncateText(movie.overview, 250)
          }}
        </p>

        <button
          v-if="movie.overview.length > 250"
          @click="showFullOverview = !showFullOverview"
          class="mt-1 text-sm font-medium text-[#0088FF]"
        >
          {{ showFullOverview ? "Ler menos" : "Ler mais" }}
        </button>
      </div>

      <div
        v-else
        class="p-4 rounded-xl bg-gray-100 dark:bg-[#161f30] border border-gray-200 dark:border-[#242C3C] flex items-start gap-3 text-gray-500 dark:text-gray-400"
      >
        <Info class="w-5 h-5 text-[#0088FF] shrink-0 mt-0.5" />
        <div class="text-xs leading-relaxed">
          <p class="font-semibold text-gray-700 dark:text-gray-200">
            Sinopse em breve
          </p>
          <p class="mt-0.5">
            Ainda não há uma sinopse oficial cadastrada para este filme. Novas
            informações devem ser atualizadas em breve.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
