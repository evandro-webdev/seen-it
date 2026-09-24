import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";

export function useScrollMask(watchSource = null) {
  const scrollContainer = ref(null);
  const showLeftGradient = ref(false);
  const showRightGradient = ref(false);

  function checkScrollPosition() {
    const el = scrollContainer.value;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;

    showLeftGradient.value = scrollLeft > 2;
    showRightGradient.value = scrollLeft + clientWidth < scrollWidth - 2;
  }

  if (watchSource) {
    watch(
      watchSource,
      async () => {
        await nextTick();
        checkScrollPosition();
      },
      { deep: true, immediate: true }
    );
  }

  onMounted(() => {
    checkScrollPosition();
    window.addEventListener("resize", checkScrollPosition);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", checkScrollPosition);
  });

  return {
    scrollContainer,
    showLeftGradient,
    showRightGradient,
    checkScrollPosition,
  };
}
