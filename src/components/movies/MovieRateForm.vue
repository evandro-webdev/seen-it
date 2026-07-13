<script setup>
import { ref, computed } from "vue";
import { useWatchedMoviesStore } from "@/stores/watchedMovies";
import { ArrowRight, X, Check } from "@lucide/vue";
import { useAuthStore } from "@/stores/auth";

import MovieRating from "./MovieRating.vue";

import { useDarkMode } from "@/composables/useDarkMode";
import { useGroupsStore } from "@/stores/groups.js";
const { isDarkMode } = useDarkMode();

const props = defineProps(["movie"]);
const emit = defineEmits(["close"]);

const authStore = useAuthStore();

const watchedMoviesStore = useWatchedMoviesStore();
const groupsStore = useGroupsStore();

const review = ref({});
const sliderValue = ref(5);
const comment = ref("");

const showSummary = ref(false);

function confirmRating() {
  review.value[authStore.user.uid] = {
    name: authStore.user.displayName.split(" ")[0],
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
          :src="`https://grfzzenmfxpdswksztzh.supabase.co/storage/v1/object/public/avatars/${authStore.user.uid}.jpg`"
          class="w-12 h-12 rounded-full object-cover"
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
      <p class="text-[16px] font-light text-[#8C8C8C] dark:text-gray-300">
        Confirme sua avaliação:
      </p>

      <!-- Container de Resumo -->
      <div
        class="p-4 mt-4 rounded-xl border border-gray-100 dark:border-[#242C3C] bg-gray-50/50 dark:bg-[#181F2F] flex flex-col gap-4"
      >
        <!-- Linha da Nota (Alinhada horizontalmente com destaque) -->
        <div
          class="flex items-center justify-between w-full pb-3 border-b border-gray-100 dark:border-[#242C3C]"
        >
          <span class="text-sm text-gray-500 dark:text-gray-400">Sua Nota</span>

          <!-- 
        1. Usamos ?. para evitar quebras se a review ainda não foi gerada 
        2. Passamos o uid para o MovieRating renderizar sua cor do grupo corretamente
      -->
          <MovieRating
            v-if="review?.[authStore.user.uid]"
            :uid="authStore.user.uid"
            :review="review[authStore.user.uid]"
            :color="
              groupsStore.activeGroupMembers[authStore.user.uid]?.color ||
              '#338CD5'
            "
            :has-comment="!!review[authStore.user.uid]?.comment"
          />
        </div>

        <!-- Seção de Comentário (Só aparece se o usuário digitou algo) -->
        <div
          v-if="review?.[authStore.user.uid]?.comment"
          class="relative p-3.5 bg-blue-50/30 dark:bg-[#1e2638] rounded-xl rounded-tl-none border border-blue-50/50 dark:border-[#2b3a55] overflow-hidden"
        >
          <Quote
            class="absolute -top-1 -right-1 w-8 h-8 text-[#0088FF]/10 dark:text-white/5"
          />

          <span
            class="text-[11px] font-bold text-[#0088FF] dark:text-[#38a3ff] uppercase tracking-wider block mb-1"
          >
            Seu Comentário
          </span>
          <p
            class="text-sm text-gray-700 dark:text-gray-200 leading-relaxed pl-1"
          >
            "{{ review[authStore.user.uid].comment }}"
          </p>
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="flex justify-between gap-4 mt-6">
        <button
          @click="emit('close')"
          class="py-2.5 px-4 rounded-xl text-gray-500 dark:text-gray-300 dark:hover:bg-gray-800 hover:bg-gray-100 flex items-center justify-center gap-2 transition-colors"
        >
          <X class="w-5 h-5" />
          <span class="font-medium text-sm">Cancelar</span>
        </button>

        <button
          @click="saveRating"
          class="w-full py-2.5 px-4 rounded-xl text-white bg-[#0088FF] hover:bg-blue-600 flex justify-center items-center gap-2 transition-colors shadow-sm shadow-blue-500/10"
        >
          <Check class="w-5 h-5" />
          <span class="font-medium text-sm">Confirmar e Salvar</span>
        </button>
      </div>
    </div>
  </Transition>
</template>
