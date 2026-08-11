<script setup>
import { ref, computed } from "vue";
import { useWatchedMoviesStore } from "@/stores/watchedMovies.js";
import { useSavedMoviesStore } from "@/stores/savedMovies.js";
import { useGroupsStore } from "@/stores/groups";
import { useAuthStore } from "@/stores/auth.js";
import { useToastStore } from "@/stores/toast.js";
import { useModalHistory } from "@/composables/useModalHistory.js";

import { Sparkles, ArrowLeft, Check, X, SquarePen, Loader2 } from "@lucide/vue";

import MovieHeader from "./MovieHeader.vue";
import MovieMetadata from "./MovieMetadata.vue";
import MovieRatingsRow from "./MovieRatingsRow.vue";
import MovieCommentBox from "./MovieCommentBox.vue";
import MovieRateForm from "../rating/MovieRateForm.vue";

import SaveButton from "../ui/buttons/SaveButton.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import MovieTrailer from "./MovieTrailer.vue";
import MovieCredits from "./MovieCredits.vue";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal.vue";

const props = defineProps({
  movie: {
    type: [Object, null],
    required: false,
    default: null,
  },
});

const emit = defineEmits(["close"]);

const watchedMoviesStore = useWatchedMoviesStore();
const savedMoviesStore = useSavedMoviesStore();
const groupStore = useGroupsStore();
const authStore = useAuthStore();
const toastStore = useToastStore();

const isTrailerOpen = ref(false);
const showRateForm = ref(false);
const selectedReviewer = ref(null);
const rateFormRef = ref(null);
const isSubmitting = ref(false);

const isConfirmDeleteOpen = ref(false);
const isDeleting = ref(false);

async function handleConfirmDelete() {
  try {
    isDeleting.value = true;
    await watchedMoviesStore.removeMyRating(activeMovie.value.id);

    toastStore.success("Sua avaliação foi removida!");
    isConfirmDeleteOpen.value = false;
  } catch (error) {
    console.error("Erro ao remover avaliação:", error);
    toastStore.error("Não foi possível remover a avaliação.");
  } finally {
    isDeleting.value = false;
  }
}

const activeMovie = computed(() => {
  if (!props.movie) return null;

  const storeMovie = watchedMoviesStore.watchedMovies.find(
    (m) => String(m.id) === String(props.movie.id),
  );

  return storeMovie ? { ...props.movie, ...storeMovie } : props.movie;
});

const isModalOpen = computed(() => !!props.movie);
const { handleCloseClick } = useModalHistory(isModalOpen, () => emit("close"));

const isAlreadyWatched = computed(() =>
  props.movie ? watchedMoviesStore.isAlreadyWatched(props.movie.id) : false,
);

const isAlreadySaved = computed(() =>
  props.movie ? savedMoviesStore.isAlreadySaved(props.movie.id) : false,
);

const currentUser = computed(
  () => authStore.user || { displayName: "Usuário" },
);
const avatarUrl = computed(() => authStore.user?.avatar_url || "");

async function submitRating() {
  if (!rateFormRef.value || isSubmitting.value) return;

  const formData = rateFormRef.value.getFormData();

  try {
    isSubmitting.value = true;

    await watchedMoviesStore.saveWatchedMovie(props.movie, {
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

function lockScroll() {
  document.body.style.overflow = "hidden";
}

function unlockScroll() {
  document.body.style.overflow = "";
  isTrailerOpen.value = false;
}
</script>

<template>
  <Transition
    name="slide-full"
    appear
    @enter="lockScroll"
    @after-leave="
      unlockScroll();
      showRateForm = false;
      selectedReviewer = null;
    "
  >
    <div
      v-if="movie"
      class="fixed inset-0 z-50 bg-white dark:bg-[#0F111D] flex flex-col h-full w-full overflow-hidden"
    >
      <div class="flex-1 overflow-y-auto">
        <MovieHeader
          v-if="!showRateForm"
          :poster-path="movie.poster_path"
          :title="movie.title"
          @close="handleCloseClick"
        />

        <div
          v-else
          class="p-4 border-b border-gray-100 dark:border-[#1E2638] flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <BaseButton
              :icon="ArrowLeft"
              variant="ghost"
              size="sm"
              @click="showRateForm = false"
            />
            <div>
              <h3 class="text-sm font-semibold text-slate-800 dark:text-white">
                Avaliar Filme
              </h3>
              <p class="text-xs text-gray-500 truncate max-w-[200px]">
                {{ movie.title }}
              </p>
            </div>
          </div>
        </div>

        <div class="p-4 space-y-6">
          <div v-if="!showRateForm">
            <h2 class="text-3xl font-semibold text-slate-800 dark:text-white">
              {{ movie.title }}
            </h2>
            <p class="text-[14px] font-light text-[#8C8C8C] dark:text-gray-200">
              {{ movie.tagline }}
            </p>

            <MovieMetadata :movie="movie" />

            <MovieCredits :movie="movie" />

            <MovieTrailer
              v-if="movie?.trailerKey"
              :movie="movie"
              v-model:is-trailer-open="isTrailerOpen"
            />

            <MovieRatingsRow
              :movie="activeMovie"
              :members="
                groupStore.activeGroup ? groupStore.activeGroupMembers : null
              "
              v-model="selectedReviewer"
            />

            <MovieCommentBox
              v-if="
                selectedReviewer &&
                activeMovie.reviews[selectedReviewer]?.comment
              "
              :reviewer-name="
                groupStore.activeGroupMembers[selectedReviewer]?.name
              "
              :comment="activeMovie.reviews[selectedReviewer].comment"
              :user-color="
                groupStore.activeGroupMembers[selectedReviewer]?.color
              "
            />
          </div>

          <MovieRateForm
            v-else
            ref="rateFormRef"
            :movie="movie"
            :current-user="currentUser"
            :avatar-url="avatarUrl"
            @cancel="showRateForm = false"
            :rating="activeMovie?.reviews?.[authStore.user?.uid]?.rating ?? 5.0"
            :comment="
              activeMovie?.reviews?.[authStore.user?.uid]?.comment ?? ''
            "
          />
        </div>
      </div>

      <div
        class="shrink-0 p-4 bg-white/90 dark:bg-[#0F111D]/90 backdrop-blur-md border-t border-gray-100 dark:border-[#1E2638] z-30"
      >
        <div
          v-if="showRateForm"
          class="flex items-center gap-3 w-full"
        >
          <BaseButton
            label="Cancelar"
            :icon="ArrowLeft"
            variant="ghost"
            @click="showRateForm = false"
          />
          <BaseButton
            label="Confirmar Avaliação"
            :icon="Check"
            variant="primary"
            block
            :disabled="isSubmitting"
            @click="submitRating"
          >
            <template #icon>
              <Loader2
                v-if="isSubmitting"
                class="w-4 h-4 animate-spin"
              />
              <Check
                v-else
                class="w-4 h-4 transition-all"
              />
            </template>
          </BaseButton>
        </div>

        <template v-else>
          <div
            v-if="isAlreadyWatched"
            class="flex items-center gap-3 w-full"
          >
            <BaseButton
              @click="isConfirmDeleteOpen = true"
              label="Remover nota"
              :icon="X"
              size="md"
              variant="ghost"
            />
            <BaseButton
              @click="showRateForm = true"
              label="Editar avaliação"
              :icon="SquarePen"
              size="md"
              block
            />
          </div>

          <div
            v-else
            class="flex items-center gap-3 w-full"
          >
            <SaveButton
              :is-already-saved="isAlreadySaved"
              :movie="movie"
            />
            <BaseButton
              @click="showRateForm = true"
              label="Avaliar filme"
              :icon="Sparkles"
              size="md"
              block
            />
          </div>
        </template>
      </div>

      <ConfirmDeleteModal
        :is-open="isConfirmDeleteOpen"
        :is-loading="isDeleting"
        @close="isConfirmDeleteOpen = false"
        @confirm="handleConfirmDelete"
      />
    </div>
  </Transition>
</template>
