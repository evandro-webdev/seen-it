<script setup>
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useModalHistory } from "@/composables/useModalHistory.js";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true,
  },
  maxHeight: {
    type: String,
    default: "max-h-[85vh]",
  },
});

const emit = defineEmits(["close", "after-leave"]);

const modalContentRef = ref(null);

useModalHistory(
  () => props.isOpen,
  () => emit("close"),
);

onClickOutside(modalContentRef, () => {
  if (props.isOpen && props.closeOnClickOutside) {
    emit("close");
  }
});

function lockScroll() {
  document.body.style.overflow = "hidden";
}

function unlockScroll() {
  document.body.style.overflow = "";
}

function handleAfterLeave() {
  unlockScroll();
  emit("after-leave");
}
</script>

<template>
  <Transition
    name="modal"
    appear
    @enter="lockScroll"
    @after-leave="handleAfterLeave"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-end"
    >
      <div
        ref="modalContentRef"
        class="w-full py-6 px-4 bg-white dark:bg-[#121825] rounded-t-2xl overflow-y-auto space-y-6 modal-content"
        :class="maxHeight"
      >
        <slot />
      </div>
    </div>
  </Transition>
</template>
