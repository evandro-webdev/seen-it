<script setup>
import { AlertTriangle, Loader2 } from "@lucide/vue";
import BaseButton from "@/components/ui/BaseButton.vue";

defineProps({
  isOpen: Boolean,
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isLoading: Boolean,
});

const emit = defineEmits(["confirm", "close"]);
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 p-4 bg-black/60 backdrop-blur-sm flex items-center justify-center"
      @click.self="emit('close')"
    >
      <div
        class="bg-white dark:bg-[#121825] border border-gray-100 dark:border-[#1E2638] rounded-2xl p-5 max-w-xs w-full shadow-xl space-y-4 text-center animate-in fade-in zoom-in-95 duration-150"
      >
        <div
          class="mx-auto w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center"
        >
          <AlertTriangle class="w-6 h-6" />
        </div>

        <div>
          <h3 class="text-base font-semibold text-slate-800 dark:text-white">
            {{ title }}
          </h3>
          <p class=" mt-1 text-balance text-sm text-gray-500 dark:text-gray-400">
            {{ description }}
          </p>
        </div>

        <div class="flex items-center gap-2 pt-2">
          <BaseButton
            label="Cancelar"
            variant="ghost"
            block
            :disabled="isLoading"
            @click="emit('close')"
          />
          <BaseButton
            label="Remover"
            variant="danger"
            block
            :disabled="isLoading"
            @click="emit('confirm')"
          >
            <template #icon>
              <Loader2
                v-if="isLoading"
                class="w-4 h-4 animate-spin"
              />
            </template>
          </BaseButton>
        </div>
      </div>
    </div>
  </Transition>
</template>
