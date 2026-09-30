<script setup>
import { useRouter } from "vue-router";

import { Lock, ArrowRight, BookHeart, Bookmark } from "@lucide/vue";

import BaseButton from "@/components/ui/BaseButton.vue";

const props = defineProps({
  context: {
    type: String,
    validator: (v) => ["watched", "saved"].includes(v),
  },
});

const router = useRouter();

const config = {
  watched: {
    icon: BookHeart,
    title: "Sua coleção de assistidos",
    description:
      "Faça login para avaliar os filmes que você já viu e comparar com a galera do grupo.",
  },
  saved: {
    icon: Bookmark,
    title: "Sua lista de interesses",
    description:
      "Faça login para salvar os filmes que deseja assistir mais tarde.",
  },
};

function goToProfile() {
  router.push("/profile");
}
</script>

<template>
  <div
    class="min-h-[calc(100dvh-150px)] w-full px-8 text-center flex flex-1 flex-col items-center justify-center"
  >
    <div class="max-w-xs space-y-2">
      <div
        class="w-16 h-16 mx-auto rounded-2xl border border-gray-100 dark:border-[#242C3C] bg-gray-50 dark:bg-[#161f30] flex items-center justify-center shadow-xs relative"
      >
        <component
          :is="config[context].icon"
          class="w-8 h-8 text-gray-400 dark:text-[#52627a]"
        />
        <div
          class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white ring-2 ring-white dark:ring-[#0D131F]"
        >
          <Lock class="w-2.5 h-2.5" />
        </div>
      </div>

      <div class="space-y-1">
        <h3 class="text-md font-semibold text-gray-800 dark:text-white">
          {{ config[context].title }}
        </h3>
        <p
          class="text-xs/5 [text-wrap:balance] text-gray-400 dark:text-[#8892b0]"
        >
          {{ config[context].description }}
        </p>
      </div>

      <div class="pt-2">
        <BaseButton
          @click="goToProfile"
          variant="primary"
          label="Entrar na minha conta"
          size="sm"
          block
        >
          <template #icon>
            <ArrowRight class="w-4 h-4 ml-1" />
          </template>
        </BaseButton>
      </div>
    </div>
  </div>
</template>
