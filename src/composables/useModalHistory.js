import { watch, onUnmounted } from "vue";

export function useModalHistory(isOpenRef, onClose) {
  let isBackTriggered = false;

  function handlePopState(event) {
    if (isOpenRef.value) {
      isBackTriggered = true;
      onClose();
    }
  }

  watch(
    isOpenRef,
    (isOpen, wasOpen) => {
      if (isOpen && !wasOpen) {
        isBackTriggered = false;
        history.pushState({ modalOpen: true }, "");
        window.addEventListener("popstate", handlePopState);
      } else if (!isOpen && wasOpen) {
        window.removeEventListener("popstate", handlePopState);
        if (!isBackTriggered && history.state?.modalOpen) {
          history.back();
        }
      }
    },
    { immediate: false },
  );

  function handleCloseClick() {
    if (history.state?.modalOpen) {
      history.back();
    } else {
      onClose();
    }
  }

  onUnmounted(() => {
    window.removeEventListener("popstate", handlePopState);
  });

  return { handleCloseClick };
}
