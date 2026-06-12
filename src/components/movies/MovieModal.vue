<script setup>
import { onMounted, onUnmounted, ref, computed } from "vue";
import { useWatchedMoviesStore } from "../../stores/watchedMovies.js";
import { useSavedMoviesStore } from "../../stores/savedMovies.js";
import {
  formatRating,
  formatRuntime,
  truncateText,
} from "../../utils/formatters.js";

import SaveButton from "./buttons/SaveButton.vue";
import RateMovieButton from "./buttons/RateMovieButton.vue";
import EditRatedMovieButton from "./buttons/EditRatedMovieButton.vue";
import RemoveRatedMovieButton from "./buttons/RemoveRatedMovieButton.vue";
import MovieRateForm from "./MovieRateForm.vue";
import MovieRating from "./MovieRating.vue";
import MovieGenre from "./MovieGenre.vue";

import { ArrowLeft, EllipsisVertical, Star, UsersRound } from "@lucide/vue";

const watchedMoviesStore = useWatchedMoviesStore();
const savedMoviesStore = useSavedMoviesStore();

const props = defineProps({
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

const isAlreadyWatched = computed(() =>
  watchedMoviesStore.isAlreadyWatched(props.movie.id),
);
const isAlreadySaved = computed(() =>
  savedMoviesStore.isAlreadySaved(props.movie.id),
);

const showRateForm = ref(false);
const showFullOverview = ref(false);
</script>

<template>
  <div
    class="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex justify-center items-end"
  >
    <div
      class="w-full h-[100%] bg-white dark:bg-[#0F111D] rounded-t-2xl overflow-y-auto"
    >
      <div class="relative w-full overflow-hidden">
        <div class="relative w-full">
          <div
            class="skeleton absolute inset-0 bg-gray-300 animate-pulse"
          ></div>
          <img
            :src="
              props.movie.poster_path
                ? 'https://image.tmdb.org/t/p/w500' + props.movie.poster_path
                : '/placeholder-image.png'
            "
            :alt="props.movie.title"
            class="poster w-full h-full object-cover opacity-0 transition-opacity duration-300"
            onload="
              this.classList.add('opacity-100');
              this.previousElementSibling.remove();
            "
          />

          <div
            class="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-white dark:from-[#0F111D] to-transparent pointer-events-none"
          ></div>
          <div
            class="fixed top-0 left-0 w-full h-1/5 bg-gradient-to-b from-black to-transparent pointer-events-none"
          ></div>

          <div
            class="fixed top-0 left-0 w-full p-4 text-white flex justify-between"
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
              <h2 class="text-3xl font-semibold text-slate-800 dark:text-white">
                {{ props.movie.title }}
              </h2>
              <p
                class="text-[14px] font-light text-[#8C8C8C] dark:text-gray-200"
                v-if="!showRateForm"
              >
                {{ props.movie.tagline }}
              </p>
            </div>
            <div v-if="!showRateForm">
              <div
                class="mt-2 mb-4 text-xs text-[#5E5E5E] dark:text-white flex items-center flex-wrap gap-2"
              >
                <div class="flex gap-2">
                  <MovieGenre
                    v-for="genre in props.movie.genres"
                    :key="genre.id"
                    :genre="genre.name"
                  />
                </div>
                <span>·</span>
                <span>{{ props.movie.release_date.slice(0, 4) }}</span>
                <span>·</span>
                <span>{{ formatRuntime(props.movie.runtime) }}</span>
              </div>

              <div>
                <p
                  class="text-[16px] text-[#8C8C8C] dark:text-gray-200 font-light leading-[20px]"
                >
                  {{
                    showFullOverview
                      ? props.movie.overview
                      : truncateText(props.movie.overview, OVERVIEW_LIMIT)
                  }}
                </p>

                <button
                  v-if="props.movie.overview?.length > 250"
                  @click="showFullOverview = !showFullOverview"
                  class="mt-1 text-sm text-[#0088FF]"
                >
                  {{ showFullOverview ? "Ler menos" : "Ler mais" }}
                </button>
              </div>

              <div
                v-if="isAlreadyWatched && props.movie.ratings"
                class="p-2 mt-4 rounded-xl border border-gray-200 dark:border-[#2c3042] flex items-center gap-x-3 overflow-x-auto"
              >
                <MovieRating
                  v-for="[user, rating] in Object.entries(props.movie.ratings)"
                  :key="user"
                  :user="user"
                  :rating="rating"
                />

                <div
                  class="px-3 py-1 rounded-xl bg-[#edf3fc] dark:bg-[#356dd51e] flex flex-shrink-0 items-center gap-2"
                >
                  <div class="p-2 rounded-full border border-[#356dd5]">
                    <UsersRound
                      class="w-4 h-4 text-[#356dd5] dark:text-[#4787ff]"
                    />
                  </div>
                  <div>
                    <div class="flex items-center gap-1">
                      <Star
                        class="w-4 h-4 text-[#356dd5] dark:text-[#4787ff]"
                        fill="currentColor"
                      />
                      <span
                        class="block text-md font-medium text-[#356dd5] dark:text-[#4787ff]"
                        >{{ formatRating(props.movie.average_rating) }}</span
                      >
                    </div>
                    <span
                      class="text-xs capitalize text-[#356dd5] dark:text-[#4787ff] block"
                      >Média</span
                    >
                  </div>
                </div>

                <div
                  class="px-3 py-1 rounded-xl bg-[#e9f5f2] dark:bg-[#399c8d1e] flex flex-shrink-0 items-center gap-2"
                >
                  <div
                    class="p-2 rounded-full border border-[#399c8d] bg-[#0d2b42]"
                  >
                    <img
                      src="/img/tmdb.svg"
                      class="w-4 h-4"
                    />
                  </div>
                  <div>
                    <div class="flex items-center gap-1">
                      <Star
                        class="w-4 h-4 text-[#399c8d]"
                        fill="currentColor"
                      />
                      <span class="block text-md font-medium text-[#399c8d]">{{
                        formatRating(props.movie.vote_average)
                      }}</span>
                    </div>
                    <span class="text-xs capitalize text-[#399c8d] block"
                      >TMDB</span
                    >
                  </div>
                </div>
              </div>

              <div
                v-if="!isAlreadyWatched"
                class="mt-4 w-max"
              >
                <div
                  class="px-3 py-1 rounded-xl bg-[#e9f5f2] dark:bg-[#399c8d1e] flex flex-shrink-0 items-center gap-2"
                >
                  <div
                    class="p-2 rounded-full border border-[#399c8d] bg-[#0d2b42]"
                  >
                    <img
                      src="/img/tmdb.svg"
                      class="w-4 h-4"
                    />
                  </div>
                  <div>
                    <div class="flex items-center gap-1">
                      <Star
                        class="w-4 h-4 text-[#399c8d]"
                        fill="currentColor"
                      />
                      <span class="block text-md font-medium text-[#399c8d]">{{
                        formatRating(props.movie.vote_average)
                      }}</span>
                    </div>
                    <span class="text-xs capitalize text-[#399c8d] block"
                      >TMDB</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <MovieRateForm
              v-if="showRateForm"
              :movie="props.movie"
              @close="showRateForm = false"
            />
          </div>

          <div
            v-if="isAlreadyWatched"
            class="mt-6 flex items-center gap-4"
          >
            <RemoveRatedMovieButton
              @click="watchedMoviesStore.deleteWatchedMovie(props.movie.id)"
            />
            <EditRatedMovieButton />
          </div>

          <div
            v-if="!isAlreadyWatched && !showRateForm"
            class="mt-6 flex items-center gap-4"
          >
            <SaveButton
              :is-already-saved="isAlreadySaved"
              :movie="props.movie"
            />
            <RateMovieButton
              :movie="props.movie"
              @click="showRateForm = true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
