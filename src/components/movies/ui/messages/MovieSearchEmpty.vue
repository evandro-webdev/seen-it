<script setup>
import { SearchX } from "@lucide/vue";

defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
});

defineEmits(["clear"]);
</script>

<template>
  <div class="px-6 py-12 text-center flex-1 flex flex-col items-center justify-center animate-fade-in">
    <div class="max-w-xs space-y-4">
      <div class="w-16 h-16 mx-auto rounded-2xl border border-gray-100 dark:border-[#242C3C] bg-gray-50 dark:bg-[#161f30] flex items-center justify-center shadow-xs">
        <SearchX class="w-8 h-8 text-gray-400 dark:text-[#52627a]" />
      </div>
      <div class="space-y-1">
        <h3 class="text-md font-semibold text-gray-800 dark:text-white">
          Nenhum resultado encontrado
        </h3>
        <p class="text-xs/5 [text-wrap:balance] text-gray-400 dark:text-[#8892b0]">
          Não encontramos nada para "<span class="font-medium text-gray-600 dark:text-gray-300">{{ searchQuery }}</span>". Verifique a grafia ou tente outro título.
        </p>
      </div>
      
      <button
        @click="$emit('clear')"
        type="button"
        class="text-xs font-semibold hover:underline inline-flex items-center text-[#0088FF]"
      >
        Limpar pesquisa
      </button>
    </div>
  </div>
</template>