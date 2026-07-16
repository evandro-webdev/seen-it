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
      class="fixed inset-0 z-50 bg-white dark:bg-[#0F111D] overflow-y-auto"
    >
      <MovieHeader
        :poster-path="props.movie.poster_path"
        :title="props.movie.title"
        @close="$emit('close')"
      />

      <div class="pt-2 pb-4 px-4">
        <div>
          <h2 class="text-3xl font-semibold text-slate-800 dark:text-white">
            {{ props.movie.title }}
          </h2>
          <p
            v-if="!showRateForm"
            class="text-[14px] font-light text-[#8C8C8C] dark:text-gray-200"
          >
            {{ props.movie.tagline }}
          </p>
        </div>

        <Transition
          name="fade"
          mode="out-in"
        >
          <div v-if="!showRateForm">
            <MovieMetadata :movie="props.movie" />

            <MovieRatingsRow
              v-if="isAlreadyWatched && props.movie.reviews"
              :movie="props.movie"
              :members="groupStore.activeGroupMembers"
              v-model="selectedReviewer"
            />

            <MovieCommentBox
              v-if="
                selectedReviewer &&
                props.movie.reviews[selectedReviewer]?.comment
              "
              :reviewer-name="props.movie.reviews[selectedReviewer].name"
              :comment="props.movie.reviews[selectedReviewer].comment"
            />
          </div>

          <MovieRateForm
            v-else
            :movie="props.movie"
            @close="showRateForm = false"
          />
        </Transition>
      </div>

      <div
        v-if="!showRateForm"
        class="px-4 pb-6 mt-6"
      >
        <div
          v-if="isAlreadyWatched"
          class="flex items-center gap-4"
        >
          <RemoveRatedMovieButton
            @click="watchedMoviesStore.deleteWatchedMovie(props.movie.id)"
          />
          <EditRatedMovieButton />
        </div>

        <div
          v-else
          class="flex items-center gap-4"
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
  </Transition>
</template>
