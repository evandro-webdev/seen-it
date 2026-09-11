<script setup>
import { useSavedMoviesStore } from "@/stores/savedMovies.js";
import { computed, defineProps, ref } from "vue";
import { Bookmark, Loader2 } from "@lucide/vue";
import BaseButton from "@/components/ui/BaseButton.vue";

const savedMoviesStore = useSavedMoviesStore();

const props = defineProps({
  isAlreadySaved: {
    type: Boolean,
    required: true,
  },
  savedBy: {
    type: Object,
    required: false,
    default: null,
  },
  movie: {
    type: Object,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const isLoading = ref(false);

async function handleToggleSaved() {
  if (isLoading.value) return;

  isLoading.value = true;

  try {
    await savedMoviesStore.toggleSaved(props.movie);
  } catch (error) {
    console.error("Erro ao salvar/remover filme: ", error);
  } finally {
    isLoading.value = false;
  }
}

const buttonVariant = computed(() => {
  return props.isAlreadySaved ? "secondary" : "ghost";
});

const buttonIcon = computed(() => {
  return isLoading.value ? Loader2 : Bookmark;
});

const buttonLabel = computed(() => {
  if (props.isAlreadySaved && props.savedBy?.name) {
    const firstName = props.savedBy.name.split(" ")[0];
    return `Salvo por ${firstName}`;
  }
  return "Salvar";
});
</script>

<template>
  <BaseButton
    :label="buttonLabel"
    :icon="buttonIcon"
    :variant="buttonVariant"
    :disabled="isLoading"
    @click="handleToggleSaved"
  >
    <template #icon>
      <Loader2
        v-if="isLoading"
        class="w-4 h-4 animate-spin"
      />
      <Bookmark
        v-else
        class="w-4 h-4 transition-all"
        :fill="isAlreadySaved ? 'currentColor' : 'none'"
      />
    </template>
  </BaseButton>
</template>
