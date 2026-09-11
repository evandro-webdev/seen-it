<script setup>
import { useToastStore } from "@/stores/toast.js";
import { CheckCircle2, AlertCircle, Info, X } from "@lucide/vue";

const toastStore = useToastStore();
</script>

<template>
  <div
    class="fixed bottom-18 left-0 right-0 z-50 flex flex-col gap-2.5 px-4 pointer-events-none"
  >
    <TransitionGroup
      name="toast"
      tag="div"
      class="flex flex-col gap-2.5 w-full"
    >
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="pointer-events-auto w-full p-4 rounded-xl shadow-xl border-l-4 border flex items-center justify-between gap-3 text-sm font-medium bg-white dark:bg-[#121825] border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100 transition-all"
        :class="{
          'border-l-emerald-500': toast.type === 'success',
          'border-l-rose-500': toast.type === 'error',
          'border-l-blue-500': toast.type === 'info',
        }"
      >
        <div class="flex items-center gap-3">
          <CheckCircle2
            v-if="toast.type === 'success'"
            class="w-5 h-5 shrink-0 text-emerald-500"
          />
          <AlertCircle
            v-else-if="toast.type === 'error'"
            class="w-5 h-5 shrink-0 text-rose-500"
          />
          <Info
            v-else
            class="w-5 h-5 shrink-0 text-blue-500"
          />

          <span class="leading-tight">{{ toast.message }}</span>
        </div>

        <button
          @click="toastStore.remove(toast.id)"
          class="p-1 rounded-lg text-slate-400 active:bg-slate-100 dark:active:bg-slate-800 transition-colors shrink-0"
          aria-label="Fechar notificação"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
