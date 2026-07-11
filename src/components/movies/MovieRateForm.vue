<script setup>
import { ref, computed } from "vue";
import { useWatchedMoviesStore } from "@/stores/watchedMovies";
import { ArrowRight, X, Check } from "@lucide/vue";
import { useAuthStore } from "@/stores/auth";

import MovieRating from "./MovieRating.vue";

import { useDarkMode } from "@/composables/useDarkMode";
const { isDarkMode } = useDarkMode();

const props = defineProps(["movie"]);
const emit = defineEmits(["close"]);

const authStore = useAuthStore();

const watchedMoviesStore = useWatchedMoviesStore();

const review = ref({});
const sliderValue = ref(5);
const comment = ref("");

const showSummary = ref(false);

function confirmRating() {
  review.value[authStore.user.uid] = {
    name: authStore.user.displayName.split(' ')[0],
    rating: Number(sliderValue.value),
    comment: comment.value,
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
    <div v-if="!showSummary">
      <p class="text-[16px] font-light text-[#8C8C8C] dark:text-gray-200">
        {{ authStore.user.displayName }}, que nota você dá para esse filme?
      </p>

      <div class="mt-8 flex items-center gap-4">
        <img
          :src="`/img/${authStore.user.displayName.split(' ')[0].toLowerCase()}.jpg`"
          class="w-13 rounded-full"
        />

        <div class="w-full space-y-4 mt-4">
          <div class="relative">
            <div
              class="absolute top-1/2 w-full h-[10px] bg-[#DEE9F8] dark:bg-[#1D3555] rounded-full -translate-y-1/2"
            ></div>
            <div
              class="absolute top-1/2 h-[10px] bg-[#338CD5] dark:bg-[#1765A4] rounded-l-full -translate-y-1/2 transition-all duration-150"
              :style="{ width: (sliderValue / 10) * 100 + '%' }"
            ></div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              v-model="sliderValue"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
              class="absolute top-1/2 w-[6px] h-[35px] bg-[#338CD5] dark:bg-[#1765A4] rounded-sm -translate-y-1/2 -translate-x-1/2 transition-all duration-150 pointer-events-none"
              :style="{
                left: (sliderValue / 10) * 100 + '%',
                boxShadow: isDarkMode
                  ? '-4px 0 0 0 #0F111D, 4px 0 0 0 #0F111D'
                  : '-4px 0 0 0 white, 4px 0 0 0 white',
              }"
            >
              <span
                class="absolute -top-8 left-1/2 -translate-x-1/2 py-1 px-2 rounded-md text-[14px] bg-[#338CD5] dark:bg-[#1765A4] text-white"
              >
                {{ sliderValue }}
              </span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            v-model="sliderValue"
            class="hidden"
          />
        </div>
      </div>

      <textarea
        v-model="comment"
        class="w-full my-4 p-3 rounded-md border text-[14px] text-gray-600 dark:text-gray-300 dark:border-[#1D3555] resize-none focus:outline-none focus:ring-2 focus:ring-[#338CD5] focus:border-transparent"
        rows="2"
        placeholder="Algum comentário?"
      ></textarea>

      <button
        @click="confirmRating"
        class="ml-auto py-2 px-4 rounded-lg text-white bg-[#0088FF] hover:bg-blue-600 flex justify-center items-center gap-2"
      >
        <span class="font-medium">Próximo</span>
        <ArrowRight class="w-5 h-5" />
      </button>
    </div>

    <div v-else>
      <p class="text-[16px] font-light text-[#8C8C8C]">
        Confira o resumo das notas:
      </p>

      <div
        class="p-2 mt-4 rounded-xl border border-gray-200 dark:border-[#2c3042] flex flex-col items-start gap-3 overflow-x-auto"
      >
        <MovieRating
          :user="authStore.user.displayName.split(' ')[0].toLowerCase()"
          :rating="review[authStore.user.uid].rating"
          :has-comment="review[authStore.user.uid].comment ? true : false"
        />
      </div>

      <div class="flex justify-center gap-4 mt-6">
        <button
          @click="emit('close')"
          class="py-2 px-3 rounded-lg text-gray-500 dark:text-gray-300 dark:hover:bg-gray-600 hover:bg-gray-100 flex items-center gap-2"
        >
          <X class="w-5 h-5" />
          <span class="font-medium">Cancelar</span>
        </button>

        <button
          @click="saveRating"
          class="w-full py-2 px-3 rounded-lg text-white bg-[#0088FF] hover:bg-blue-600 flex justify-center items-center gap-2"
        >
          <Check class="w-5 h-5" />
          <span class="font-medium">Salvar avaliação</span>
        </button>
      </div>
    </div>
  </Transition>
</template>
