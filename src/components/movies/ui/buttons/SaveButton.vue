<script setup>
import { computed, ref } from "vue";
import { useSavedMoviesStore } from "@/stores/savedMovies.js";
import { useGroupsStore } from "@/stores/groups";
import { useMovieDetailsStore } from "@/stores/movieDetails";
import { useAuthStore } from "@/stores/auth";

import { Bookmark, BookmarkCheck } from "@lucide/vue";
import BaseButton from "@/components/ui/BaseButton.vue";

const savedMoviesStore = useSavedMoviesStore();
const groupsStore = useGroupsStore();
const authStore = useAuthStore();
const movieDetailsStore = useMovieDetailsStore();

const movie = computed(() => movieDetailsStore.selectedMovie);
const isLoading = ref(false);

const isAlreadySaved = computed(() => {
  if (!movie.value?.id) return false;
  return savedMoviesStore.isAlreadySaved(movie.value.id);
});

const savedBy = computed(() => {
  if (!movie.value?.saved_by) return null;
  return groupsStore.activeGroupMembers?.[movie.value.saved_by] || null;
});

const isDisabled = computed(() => {
  if (isLoading.value) return true;
  if (!movie.value?.saved_by) return false;

  return movie.value.saved_by !== authStore.user?.uid;
});

async function handleToggleSaved() {
  if (isDisabled.value || !movie.value) return;

  isLoading.value = true;

  try {
    await savedMoviesStore.toggleSaved(movie.value);
  } catch (error) {
    console.error("Erro ao salvar/remover filme: ", error);
  } finally {
    isLoading.value = false;
  }
}

const buttonIcon = computed(() => {
  return isAlreadySaved.value ? BookmarkCheck : Bookmark;
});

const buttonVariant = computed(() => {
  return isAlreadySaved.value ? "secondary" : "ghost";
});

const buttonLabel = computed(() => {
  if (!isAlreadySaved.value) return "Salvar";

  const firstName = savedBy.value?.name?.trim().split(" ")[0];

  if (groupsStore.activeGroup && firstName) {
    return `Salvo por ${firstName}`;
  }

  return "Salvo";
});
</script>

<template>
  <BaseButton
    :icon="buttonIcon"
    :loading="isLoading"
    :label="buttonLabel"
    :variant="buttonVariant"
    :disabled="isDisabled"
    @click="handleToggleSaved"
  />
</template>
