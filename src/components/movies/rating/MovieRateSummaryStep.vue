<script setup>
import { X, Check, Quote } from "@lucide/vue";
import MovieRating from "../ui/MovieRating.vue";

defineProps({
  userId: String,
  userReview: Object,
  userColor: { type: String, default: "#338CD5" },
});

const emit = defineEmits(["cancel", "save"]);
</script>

<template>
  <div>
    <p class="text-[16px] font-light text-[#8C8C8C] dark:text-gray-300">
      Confirme sua avaliação:
    </p>

    <div
      class="p-4 mt-4 rounded-xl border border-gray-100 dark:border-[#242C3C] bg-gray-50/50 dark:bg-[#181F2F] flex flex-col gap-4"
    >
      <div
        class="flex items-center justify-between w-full"
        :class="{
          'p-3 border-b border-gray-100 dark:border-[#242C3C]':
            userReview?.comment,
        }"
      >
        <span class="text-sm text-gray-500 dark:text-gray-400">Sua Nota</span>

        <MovieRating
          v-if="userReview"
          :uid="userId"
          :review="userReview"
          :color="userColor"
          :has-comment="!!userReview?.comment"
        />
      </div>

      <div
        v-if="userReview?.comment"
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
          "{{ userReview.comment }}"
        </p>
      </div>
    </div>

    <div class="flex justify-between gap-4 mt-6">
      <button
        @click="emit('cancel')"
        class="py-2.5 px-4 rounded-xl text-gray-500 dark:text-gray-300 dark:hover:bg-gray-800 hover:bg-gray-100 flex items-center justify-center gap-2 transition-colors"
      >
        <X class="w-5 h-5" />
        <span class="font-medium text-sm">Cancelar</span>
      </button>

      <button
        @click="emit('save')"
        class="w-full py-2.5 px-4 rounded-xl text-white bg-[#0088FF] hover:bg-blue-600 flex justify-center items-center gap-2 transition-colors shadow-sm shadow-blue-500/10"
      >
        <Check class="w-5 h-5" />
        <span class="font-medium text-sm">Confirmar e Salvar</span>
      </button>
    </div>
  </div>
</template>
