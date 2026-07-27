<script setup>
import { useToastStore } from "@/stores/toast.js";
import { CheckCircle2, AlertCircle, Info, X } from "@lucide/vue";

const toastStore = useToastStore();
</script>

<template>
  <div
    class="fixed bottom-14 right-5 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none"
  >
    <TransitionGroup
      name="toast"
      tag="div"
      class="flex flex-col gap-2"
    >
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="pointer-events-auto p-3.5 rounded-xl shadow-lg flex items-center justify-between gap-3 text-sm font-medium border backdrop-blur-md transition-all"
        :class="{
          'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400':
            toast.type === 'success',
          'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400':
            toast.type === 'error',
          'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400':
            toast.type === 'info',
        }"
      >
        <div class="flex items-center gap-2.5">
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

          <span>{{ toast.message }}</span>
        </div>

        <button
          @click="toastStore.remove(toast.id)"
          class="p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
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
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
