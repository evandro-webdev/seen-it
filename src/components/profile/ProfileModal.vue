<script setup>
import { ref, watch, computed } from "vue";
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast.js";
import { onClickOutside } from "@vueuse/core";
import { useModalHistory } from "@/composables/useModalHistory.js";

import { Camera, Check, Loader2, User, UserRoundCheck, X } from "@lucide/vue";
import BaseButton from "../ui/BaseButton.vue";

const profileStore = useProfileStore();
const authStore = useAuthStore();
const toastStore = useToastStore();

const isSubmitting = ref(false);
const profileModalRef = ref(null);

const name = ref("");
const selectedColor = ref("");
const avatarPreview = ref(null);
const selectedFile = ref(null);

const colorOptions = ["#338CD5", "#9367EB", "#D75870", "#55C06E", "#F69F40"];

const isModalOpen = computed(() => profileStore.isProfileModalOpen);
const { handleCloseClick } = useModalHistory(isModalOpen, () =>
  profileStore.closeProfileModal(),
);

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      name.value = newUser.displayName || "";
      selectedColor.value = newUser.color || "";
      avatarPreview.value = newUser.avatar_url || null;
    }
  },
  { immediate: true },
);

function handleFileChange(event) {
  const file = event.target.files[0];

  if (file) {
    selectedFile.value = file;
    avatarPreview.value = URL.createObjectURL(file);
  }
}

async function handleUpdate() {
  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;

    await profileStore.updateProfile({
      name: name.value,
      color: selectedColor.value,
      imageFile: selectedFile.value,
    });

    toastStore.success("Perfil atualizado!");
    profileStore.closeProfileModal();
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    toastStore.error("Falha ao atualizar o perfil.");
  } finally {
    isSubmitting.value = false;
  }
}

onClickOutside(profileModalRef, () => {
  profileStore.closeProfileModal();
});

function lockScroll() {
  document.body.style.overflow = "hidden";
}

function unlockScroll() {
  document.body.style.overflow = "";
}
</script>

<template>
  <Transition
    name="modal"
    appear
    @enter="lockScroll"
    @after-leave="unlockScroll"
  >
    <div
      v-if="profileStore.isProfileModalOpen"
      class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-end"
    >
      <div
        ref="profileModalRef"
        class="w-full py-6 px-4 bg-white dark:bg-[#121825] rounded-t-2xl overflow-y-auto space-y-6 modal-content max-h-[85vh]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-3 rounded-2xl bg-blue-50 dark:bg-[#273056] shrink-0">
              <User class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2
                class="text-xl font-bold text-gray-900 dark:text-white leading-tight"
              >
                Meu Perfil
              </h2>
              <span
                class="text-xs font-medium text-gray-500 dark:text-[#9EB2CD]"
              >
                Edite suas informações
              </span>
            </div>
          </div>

          <button
            @click="handleCloseClick"
            type="button"
            class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-[#222838] dark:hover:bg-slate-800 active:scale-95 transition-all"
            aria-label="Fechar"
          >
            <X class="w-5 h-5 text-gray-600 dark:text-[#A7B0C9]" />
          </button>
        </div>

        <form
          @submit.prevent="handleUpdate"
          class="space-y-6"
        >
          <div class="flex flex-col items-center justify-center gap-2 pt-2">
            <label
              for="avatar"
              class="relative cursor-pointer group active:scale-95 transition-transform"
            >
              <div
                class="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500/30 dark:border-blue-500/20 bg-gray-100 dark:bg-[#181F2F] flex items-center justify-center shadow-inner"
              >
                <img
                  v-if="avatarPreview"
                  :src="avatarPreview"
                  class="w-full h-full object-cover"
                />
                <User
                  v-else
                  class="w-10 h-10 text-gray-400"
                />
              </div>

              <div
                class="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white shadow-lg border-2 border-white dark:border-[#121825]"
              >
                <Camera class="w-4 h-4" />
              </div>
            </label>

            <span class="text-xs font-medium text-gray-500 dark:text-[#ABB3C3]">
              Toque na foto para alterar
            </span>

            <input
              type="file"
              id="avatar"
              accept="image/*"
              @change="handleFileChange"
              class="hidden"
            />
          </div>

          <div class="space-y-2">
            <label
              class="text-xs font-semibold text-gray-700 dark:text-gray-300 block"
            >
              Nome de exibição
            </label>
            <div class="relative">
              <User
                stroke-width="1.5"
                class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <input
                type="text"
                v-model="name"
                class="w-full py-3.5 pl-11 pr-4 rounded-xl border text-sm text-gray-900 placeholder-gray-400 dark:text-gray-200 border-gray-200 dark:border-[#242C3C] bg-gray-50 dark:bg-[#181f2f] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Digite o seu nome"
              />
            </div>
          </div>

          <div class="space-y-3">
            <label
              class="text-xs font-semibold text-gray-700 dark:text-gray-300 block"
            >
              Cor de identificação
            </label>
            <div class="flex gap-3">
              <button
                v-for="color in colorOptions"
                :key="color"
                @click="selectedColor = color"
                type="button"
                class="w-8 h-8 rounded-full active:scale-90 flex items-center justify-center transition-all relative"
                :style="{ backgroundColor: color }"
              >
                <Check
                  v-if="selectedColor === color"
                  class="text-white w-4 h-4"
                />
              </button>
            </div>
            <p class="text-[11px] text-gray-500 dark:text-[#9EB2CD]">
              Esta cor será usada para identificar seus itens e notas.
            </p>
          </div>

          <BaseButton
            type="submit"
            label="Salvar alterações"
            variant="primary"
            size="lg"
            :disabled="isSubmitting"
            block
          >
            <template #icon>
              <Loader2
                v-if="isSubmitting"
                class="w-5 h-5 animate-spin"
              />
              <UserRoundCheck
                v-else
                class="w-5 h-5"
              />
            </template>
          </BaseButton>
        </form>
      </div>
    </div>
  </Transition>
</template>
