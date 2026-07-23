<script setup>
import { ref, computed } from "vue";
import { useWatchedMoviesStore } from "@/stores/watchedMovies.js";
import { useSavedMoviesStore } from "@/stores/savedMovies.js";
import { useGroupsStore } from "@/stores/groups";

import MovieHeader from "./MovieHeader.vue";
import MovieMetadata from "./MovieMetadata.vue";
import MovieRatingsRow from "./MovieRatingsRow.vue";
import MovieCommentBox from "./MovieCommentBox.vue";
import MovieRateForm from "../rating/MovieRateForm.vue";

import SaveButton from "../ui/buttons/SaveButton.vue";
import RateMovieButton from "../ui/buttons/RateMovieButton.vue";
import EditRatedMovieButton from "../ui/buttons/EditRatedMovieButton.vue";
import RemoveRatedMovieButton from "../ui/buttons/RemoveRatedMovieButton.vue";

const watchedMoviesStore = useWatchedMoviesStore();
const savedMoviesStore = useSavedMoviesStore();
const groupStore = useGroupsStore();

const props = defineProps({
  movie: {
    type: [Object, null],
    required: false,
    default: null,
  },
});

function lockScroll() {
  document.body.style.overflow = "hidden";
}

function unlockScroll() {
  document.body.style.overflow = "";
}

const isAlreadyWatched = computed(() =>
  watchedMoviesStore.isAlreadyWatched(props.movie.id),
);

const isAlreadySaved = computed(() =>
  savedMoviesStore.isAlreadySaved(props.movie.id),
);

const showRateForm = ref(false);
const selectedReviewer = ref(null);
</script>

<template>
  <Transition
    name="slide-full"
    appear
    @enter="lockScroll"
    @after-leave="
      unlockScroll();
      showRateForm = false;
    "
  >
    <div
      v-if="movie"
      class="fixed inset-0 z-50 bg-white dark:bg-[#0F111D] flex flex-col h-full w-full overflow-hidden"
    >
      <div class="flex-1 overflow-y-auto">
        <MovieHeader
          :poster-path="movie.poster_path"
          :title="movie.title"
          @close="$emit('close')"
        />

        <div class="p-4 space-y-6">
          <div>
            <div>
              <h2 class="text-3xl font-semibold text-slate-800 dark:text-white">
                {{ movie.title }}
              </h2>
              <p
                v-if="!showRateForm"
                class="text-[14px] font-light text-[#8C8C8C] dark:text-gray-200"
              >
                {{ movie.tagline }}
              </p>
            </div>

            <Transition
              name="fade"
              mode="out-in"
            >
              <div v-if="!showRateForm">
                <MovieMetadata :movie="movie" />

                <MovieRatingsRow
                  :movie="movie"
                  :members="
                    isAlreadyWatched ? groupStore.activeGroupMembers : null
                  "
                  :is-already-watched="isAlreadyWatched"
                  v-model="selectedReviewer"
                />

                <MovieCommentBox
                  v-if="
                    selectedReviewer && movie.reviews[selectedReviewer]?.comment
                  "
                  :reviewer-name="movie.reviews[selectedReviewer].name"
                  :comment="movie.reviews[selectedReviewer].comment"
                />
              </div>

              <MovieRateForm
                v-else
                :movie="movie"
                @close="showRateForm = false"
              />
            </Transition>
          </div>
        </div>
      </div>

      <div
        v-if="!showRateForm"
        class="shrink-0 p-4 bg-white/90 dark:bg-[#0F111D]/90 backdrop-blur-md border-t border-gray-100 dark:border-[#1E2638] z-30"
      >
        <div
          v-if="isAlreadyWatched"
          class="flex items-center gap-3 w-full"
        >
          <RemoveRatedMovieButton
            @click="watchedMoviesStore.deleteWatchedMovie(movie.id)"
          />
          <EditRatedMovieButton class="flex-1" />
        </div>

        <div
          v-else
          class="flex items-center gap-3 w-full"
        >
          <SaveButton
            :is-already-saved="isAlreadySaved"
            :movie="movie"
          />
          <RateMovieButton
            class="flex-1"
            :movie="movie"
            @click="showRateForm = true"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>
