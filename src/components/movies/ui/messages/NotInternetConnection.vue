<script setup>
import { WifiOff } from "@lucide/vue";
</script>

<template>
  <div
    v-if="!isOnline"
    class="flex flex-col items-center justify-center py-16 px-4 text-center space-y-3"
  >
    <div
      class="w-16 h-16 rounded-2xl border border-blue-50 dark:border-[#1a3154] bg-blue-50/50 dark:bg-[#162845]/30 flex items-center justify-center shadow-xs"
    >
      <WifiOff class="w-8 h-8 text-[#0088FF]" />
    </div>
    <div class="space-y-1.5">
      <h3 class="text-md font-semibold text-gray-800 dark:text-white">
        Sem conexão com a internet
      </h3>
      <p
        class="text-xs/5 [text-wrap:balance] text-gray-400 dark:text-[#8892b0]"
      >
        A aba Descobrir precisa de internet para buscar novos filmes. Verifique
        sua rede e tente novamente.
      </p>
    </div>
  </div>
</template>
