<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useWatchedMoviesStore } from "../../stores/watchedMovies.js";
import { useSavedMoviesStore } from "../../stores/savedMovies.js";
import { formatRuntime } from "../../utils/formatters.js";

import SaveButton from "../buttons/SaveButton.vue";
import RateMovieButton from "../buttons/RateMovieButton.vue";
import EditRatedMovieButton from "../buttons/EditRatedMovieButton.vue";
import RemoveRatedMovieButton from "../buttons/RemoveRatedMovieButton.vue";
import MovieRateForm from "./MovieRateForm.vue";

import { ArrowLeft, EllipsisVertical } from "@lucide/vue";

const watchedMoviesStore = useWatchedMoviesStore();
const savedMoviesStore = useSavedMoviesStore();

defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

onMounted(() => {
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.body.style.overflow = "";
});

const showRateForm = ref(false);

const reviewerColors = {
  evandro: "bg-[#338CD5]",
  tauane: "bg-[#BF4345]",
  kauane: "bg-[#6941BA]",
};

</script>

<template>
  <div
    class="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex justify-center items-end"
  >
    <div class="w-full h-[100%] bg-white rounded-t-2xl overflow-y-auto">
      <div class="relative w-full overflow-hidden">
        <div class="relative w-full">
          <div
            class="skeleton absolute inset-0 bg-gray-300 animate-pulse"
          ></div>
          <img
            :src="
              movie.poster_path
                ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path
                : '/placeholder-image.png'
            "
            :alt="movie.title"
            class="poster w-full h-full object-cover opacity-0 transition-opacity duration-300"
            onload="
              this.classList.add('opacity-100');
              this.previousElementSibling.remove();
            "
          />

          <div
            class="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-white to-transparent pointer-events-none"
          ></div>
          <div
            class="fixed top-0 left-0 w-full h-1/5 bg-gradient-to-b from-black to-transparent pointer-events-none"
          ></div>

          <div
            class="fixed top-0 left-0 w-full px-2 py-3 text-white flex justify-between"
          >
            <button @click="$emit('close')">
              <ArrowLeft class="w-6 h-6" />
            </button>
            <button>
              <EllipsisVertical class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="pt-2 pb-4 px-4">
          <div>
            <div>
              <h2 class="text-3xl font-semibold text-slate-800">
                {{ movie.title }}
              </h2>
              <p class="text-[14px] font-light text-[#8C8C8C]" v-if="!showRateForm">
                {{ movie.tagline }}
              </p>
            </div>
            <div v-if="!showRateForm">
              <div
                class="mt-2 mb-4 text-xs text-[#5E5E5E] flex items-center flex-wrap gap-2"
              >
                <div class="flex gap-2">
                  <span
                    v-for="genre in movie.genres"
                    :key="genre.id"
                    class="px-2 py-[2px] rounded-full font-medium text-nowrap bg-[#EDEDED]"
                    >{{ genre.name }}</span
                  >
                </div>
                <span>·</span>
                <span>{{ movie.release_date.slice(0, 4) }}</span>
                <span>·</span>
                <span>{{ formatRuntime(movie.runtime) }}</span>
              </div>

              <p
                class="text-[16px] text-[#8C8C8C] font-light leading-[20px] line-clamp-6"
              >
                {{ movie.overview }}
              </p>

              <div
                v-if="
                  watchedMoviesStore.isAlreadyWatched(movie.id) && movie.ratings
                "
                class="mt-4 flex items-center gap-2"
              >
                <div
                  v-for="[user, nota] in Object.entries(movie.ratings)"
                  class="pr-2 rounded-full text-white flex items-center gap-2"
                  :class="reviewerColors[user]"
                >
                  <img
                    :src="'../img/' + user + '.jpg'"
                    class="w-6 rounded-full"
                  />
                  <span class="block text-sm font-bold">{{ nota }}</span>
                </div>

                <div
                  class="pr-2 rounded-full text-white bg-[#3A5A7E] flex items-center gap-2"
                >
                  <img
                    src="../../../img/average.jpg"
                    class="w-6 rounded-full"
                  />
                  <span class="block text-sm font-bold">{{
                    movie.average_rating
                  }}</span>
                </div>
                <div
                  class="pr-2 rounded-full text-white bg-[#4EBBC5] flex items-center gap-2"
                >
                  <img
                    src="../../../img/tmdb.jpg"
                    class="w-6 rounded-full"
                  />
                  <span class="block text-sm font-bold">{{
                    movie.tmdb_rating ? movie.tmdb_rating.toFixed(1) : "N/A"
                  }}</span>
                </div>
              </div>

              <div
                v-if="!watchedMoviesStore.isAlreadyWatched(movie.id)"
                class="mt-4 flex items-center gap-2"
              >
                <div
                  class="pr-2 rounded-full text-white bg-[#4EBBC5] flex items-center gap-2"
                >
                  <img
                    src="../../../img/tmdb.jpg"
                    class="w-6 rounded-full"
                  />
                  <span class="block text-sm font-bold">{{
                    movie.vote_average.toFixed(1)
                  }}</span>
                </div>
              </div>
            </div>

            <MovieRateForm v-if="showRateForm" :movie="movie" @close="showRateForm = false" />
          </div>

          <div
            v-if="watchedMoviesStore.isAlreadyWatched(movie.id)"
            class="mt-6 flex items-center gap-4"
          >
            <RemoveRatedMovieButton @click="watchedMoviesStore.deleteWatchedMovie(movie.docId)"/>
            <EditRatedMovieButton />
          </div>

          <div
            v-if="!watchedMoviesStore.isAlreadyWatched(movie.id) && !showRateForm"
            class="mt-6 flex items-center gap-4"
          >
            <SaveButton
              :is-already-saved="savedMoviesStore.isAlreadySaved(movie.id)"
              :movie="movie"
            />
            <RateMovieButton :movie="movie" @click="showRateForm = true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
