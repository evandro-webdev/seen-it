<script setup>
import { ref } from "vue";
import { useWatchedMoviesStore } from "@/stores/watchedMovies";
import { useAuthStore } from "@/stores/auth";
import { useGroupsStore } from "@/stores/groups";

import MovieRateStep from "./MovieRateStep.vue";
import MovieRateSummaryStep from "./MovieRateSummaryStep.vue";

const props = defineProps(["movie"]);
const emit = defineEmits(["close"]);

const authStore = useAuthStore();
const watchedMoviesStore = useWatchedMoviesStore();
const groupsStore = useGroupsStore();

const review = ref({});
const showSummary = ref(false);

const currentUser = authStore.user;
const avatarUrl = `https://grfzzenmfxpdswksztzh.supabase.co/storage/v1/object/public/avatars/${currentUser.uid}.jpg`;

const memberColor =
  groupsStore.activeGroupMembers[currentUser.uid]?.color || "#338CD5";

function handleConfirmRating({ rating, comment }) {
  review.value[currentUser.uid] = {
    name: currentUser.displayName.split(" ")[0],
    rating: Number(rating),
    comment: comment,
  };

  showSummary.value = true;
}

async function saveRating() {
  await watchedMoviesStore.saveWatchedMovie(props.movie, review.value);
  emit("close");
}
</script>

<template>
  <Transition
    name="fade"
    mode="out-in"
  >
    <MovieRateStep
      v-if="!showSummary"
      :display-name="currentUser.displayName"
      :avatar-url="avatarUrl"
      @confirm="handleConfirmRating"
    />

    <MovieRateSummaryStep
      v-else
      :user-id="currentUser.uid"
      :user-review="review[currentUser.uid]"
      :user-color="memberColor"
      @cancel="emit('close')"
      @save="saveRating"
    />
  </Transition>
</template>
