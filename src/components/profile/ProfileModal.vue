<script setup>
import { ref, watch, computed } from "vue";
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast.js";
import { onClickOutside } from "@vueuse/core";
import { useModalHistory } from "@/composables/useModalHistory.js";

import {
  AtSign,
  Camera,
  Check,
  Loader2,
  User,
  UserRoundCheck,
  X,
} from "@lucide/vue";
import BaseButton from "../ui/BaseButton.vue";
import BaseInput from "../forms/BaseInput.vue";
import ModalHeader from "../ui/ModalHeader.vue";
import ProfileAvatar from "./ProfileAvatar.vue";
import ColorPicker from "../forms/ColorPicker.vue";

const profileStore = useProfileStore();
const authStore = useAuthStore();
const toastStore = useToastStore();

const isSubmitting = ref(false);
const profileModalRef = ref(null);

const name = ref("");
const username = ref("");
const selectedColor = ref("");
const avatarPreview = ref(null);
const selectedFile = ref(null);

const colorOptions = [
  "#338CD5",
  "#9367EB",
  "#D75870",
  "#55C06E",
  "#F69F40",
  "#2DD4BF",
  "#EC4899",
];

const isModalOpen = computed(() => profileStore.isProfileModalOpen);
const { handleCloseClick } = useModalHistory(isModalOpen, () =>
  profileStore.closeProfileModal(),
);

const hasChanges = computed(() => {
  if (!authStore.user) return false;

  return (
    name.value !== (authStore.user.displayName || "") ||
    username.value !== (authStore.user.username || "") ||
    selectedColor.value !== (authStore.user.color || "") ||
    selectedFile.value !== null
  );
});

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      name.value = newUser.displayName || "";
      username.value = newUser.username;
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
      username: username.value,
      color: selectedColor.value,
      imageFile: selectedFile.value,
    });

    toastStore.success("Perfil atualizado!");
    profileStore.closeProfileModal();
  } catch (error) {
    isSubmitting.value = false;

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
        <ModalHeader
          title="Meu Perfil"
          subtitle="Edite suas informações"
          :icon="User"
          @close="handleCloseClick"
        />

        <form
          @submit.prevent="handleUpdate"
          class="space-y-4"
        >
          <ProfileAvatar
            :avatar-preview="avatarPreview"
            @file-change="handleFileChange"
          />

          <BaseInput
            v-model="name"
            label="Nome de exibição"
            placeholder="Digite o seu nome"
            :icon="User"
          />

          <BaseInput
            v-model="username"
            label="Nome usuário"
            placeholder="Digite o seu nome de usuário"
            :icon="AtSign"
          />

          <ColorPicker
            v-model="selectedColor"
            :options="colorOptions"
            label="Cor de identificação"
            description="Esta cor será usada para identificar suas notas."
          />

          <BaseButton
            type="submit"
            label="Salvar alterações"
            variant="primary"
            size="lg"
            :disabled="isSubmitting || !hasChanges"
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
