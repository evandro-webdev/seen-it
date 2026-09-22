<script setup>
import { ref, computed, watch } from "vue";
import { useWatchedMoviesStore } from "@/stores/watchedMovies.js";
import { useToastStore } from "@/stores/toast.js";
import { useMovieDetailsStore } from "@/stores/movieDetails.js";
import { useModalHistory } from "@/composables/useModalHistory.js";

import MovieHeader from "./components/header/MovieHeader.vue";
import MovieRateHeader from "./components/header/MovieRateHeader.vue";
import MovieTitle from "./components/details/MovieTitle.vue";
import MovieMetadata from "./components/details/MovieMetadata.vue";
import MovieCredits from "./components/details/MovieCredits.vue";
import MovieTrailer from "./components/details/MovieTrailer.vue";
import MovieRatingsRow from "./components/ratings/MovieRatingsRow.vue";
import MovieCommentBox from "./components/ratings/MovieCommentBox.vue";
import MovieRateForm from "./components/ratings/MovieRateForm.vue";
import MovieFooterActions from "./components/footer/MovieFooterActions.vue";

import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal.vue";

const movieDetailsStore = useMovieDetailsStore();
const watchedMoviesStore = useWatchedMoviesStore();
const toastStore = useToastStore();

const movie = computed(() => movieDetailsStore.selectedMovie);

const showRateForm = ref(false);
const rateFormRef = ref(null);
const isSubmitting = ref(false);
const selectedReviewer = ref(null);

const showConfirmDeleteModal = ref(false);
const isDeleting = ref(false);

const isModalOpen = computed(() => movieDetailsStore.isModalOpen);

useModalHistory(isModalOpen, movieDetailsStore.closeModal);

async function submitRating() {
  if (!rateFormRef.value || isSubmitting.value) return;

  isSubmitting.value = true;

  const formData = rateFormRef.value.getFormData();

  try {
    await watchedMoviesStore.saveWatchedMovie(movie.value, {
      rating: formData.rating,
      comment: formData.comment,
    });

    showRateForm.value = false;
    toastStore.success("Avaliação salva com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error);
    toastStore.error("Ocorreu um erro ao salvar sua avaliação.");
  } finally {
    isSubmitting.value = false;
  }
}

async function handleConfirmDelete() {
  try {
    isDeleting.value = true;
    await watchedMoviesStore.removeMyRating(movie.value.id);

    toastStore.success("Sua avaliação foi removida!");
    showConfirmDeleteModal.value = false;
  } catch (error) {
    console.error("Erro ao remover avaliação:", error);
    toastStore.error("Não foi possível remover a avaliação.");
  } finally {
    isDeleting.value = false;
  }
}

watch(
  isModalOpen,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  },
  { immediate: true },
);

function handleAfterLeave() {
  showRateForm.value = false;
  selectedReviewer.value = null;
}
</script>

<template>
  <Teleport to="body">
    <Transition
      name="slide-full"
      appear
      @after-leave="handleAfterLeave"
    >
      <div
        v-if="isModalOpen && movie"
        class="fixed inset-0 z-50 bg-white dark:bg-[#0F111D] flex flex-col h-full w-full overflow-hidden"
      >
        <div class="flex-1 overflow-y-auto">
          <MovieHeader v-if="!showRateForm" />

          <MovieRateHeader
            v-else
            @hideRateForm="showRateForm = false"
          />

          <div class="p-4 space-y-6">
            <div v-if="!showRateForm">
              <MovieTitle />
              <MovieMetadata />
              <MovieCredits />
              <MovieTrailer />
              <MovieRatingsRow v-model:selectedReviewer="selectedReviewer" />
              <MovieCommentBox :reviewer="selectedReviewer" />
            </div>

            <MovieRateForm
              v-else
              ref="rateFormRef"
              @cancel="showRateForm = false"
            />
          </div>
        </div>

        <MovieFooterActions
          v-model:showRateForm="showRateForm"
          :is-submitting="isSubmitting"
          @submit-rating="submitRating"
          @open-confirm-delete="showConfirmDeleteModal = true"
        />

        <ConfirmDeleteModal
          @close="showConfirmDeleteModal = false"
          @confirm="handleConfirmDelete"
          :is-open="showConfirmDeleteModal"
          :is-loading="isDeleting"
          title="Remover avaliação?"
          description="Sua nota e comentário serão excluídos permanentemente."
        />
      </div>
    </Transition>
  </Teleport>
</template>
