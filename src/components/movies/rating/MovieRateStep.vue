<script setup>
import { ref } from "vue";
import { ArrowRight } from "@lucide/vue";
import BaseSlider from "@/components/ui/BaseSlider.vue";

defineProps({
  displayName: String,
  avatarUrl: String,
});

const emit = defineEmits(["confirm"]);

const sliderValue = ref(5);
const comment = ref("");

function handleNext() {
  emit("confirm", {
    rating: sliderValue.value,
    comment: comment.value,
  });
}
</script>

<template>
  <div>
    <p class="text-[16px] font-light text-[#8C8C8C] dark:text-gray-200">
      {{ displayName }}, que nota você dá para esse filme?
    </p>

    <div class="mt-8">
      <BaseSlider
        v-model="sliderValue"
        :avatar-url="avatarUrl"
      />
    </div>

    <textarea
      v-model="comment"
      class="w-full my-4 p-3 rounded-md border text-[14px] text-gray-600 dark:text-gray-300 dark:border-[#1D3555] resize-none focus:outline-none focus:ring-2 focus:ring-[#338CD5] focus:border-transparent"
      rows="2"
      placeholder="Algum comentário?"
    ></textarea>

    <button
      @click="handleNext"
      class="ml-auto py-2 px-4 rounded-lg text-white bg-[#0088FF] hover:bg-blue-600 flex justify-center items-center gap-2 transition-colors"
    >
      <span class="font-medium">Próximo</span>
      <ArrowRight class="w-5 h-5" />
    </button>
  </div>
</template>
