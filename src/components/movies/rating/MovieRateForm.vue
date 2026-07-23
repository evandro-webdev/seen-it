<script setup>
import { ref } from "vue";
import BaseSlider from "@/components/ui/BaseSlider.vue";

const props = defineProps({
  movie: { type: Object, required: true },
  currentUser: { type: Object, required: true },
  avatarUrl: { type: String, default: "" },
});

defineEmits(["save", "cancel"]);

const rating = ref(5.0);
const comment = ref("");

function getFormData() {
  return {
    rating: rating.value,
    comment: comment.value,
  };
}

defineExpose({
  getFormData,
});
</script>

<template>
  <div class="flex flex-col h-full justify-between space-y-6">
    <div class="space-y-6">
      <p class="text-sm font-light text-gray-600 dark:text-gray-300">
        <strong class="font-semibold text-gray-800 dark:text-white">{{
          currentUser.displayName
        }}</strong
        >, que nota você dá para este filme?
      </p>

      <div class="py-2">
        <BaseSlider
          v-model="rating"
          :avatar-url="avatarUrl"
        />
      </div>

      <div class="space-y-2">
        <label
          class="text-xs font-medium text-gray-500 dark:text-gray-400 block"
        >
          Seu comentário (opcional)
        </label>
        <textarea
          v-model="comment"
          class="w-full p-3 rounded-xl border text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-[#161F30] dark:border-[#242C3C] resize-none focus:outline-none focus:ring-2 focus:ring-[#0088FF]"
          rows="3"
          placeholder="O que achou da atuação, ritmo ou história?"
        ></textarea>
      </div>
    </div>
  </div>
</template>
