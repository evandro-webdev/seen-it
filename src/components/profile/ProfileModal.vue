<script setup>
import { ref, watch, computed } from "vue";
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast.js";
import { onClickOutside } from "@vueuse/core";
import { useModalHistory } from "@/composables/useModalHistory.js";
import { USER_COLORS } from "@/constants/colors.js";

import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { profileSchema } from "@/schemas/profile.schema.js";

import { AtSign, Loader2, User, UserRoundCheck } from "@lucide/vue";

import BaseButton from "../ui/BaseButton.vue";
import ModalHeader from "../ui/ModalHeader.vue";
import BaseInput from "../forms/BaseInput.vue";
import ColorPicker from "../forms/ColorPicker.vue";
import ProfileAvatar from "./ProfileAvatar.vue";

const profileStore = useProfileStore();
const authStore = useAuthStore();
const toastStore = useToastStore();

const isSubmitting = ref(false);
const profileModalRef = ref(null);

const avatarPreview = ref(null);

const serverError = ref("");

const isModalOpen = computed(() => profileStore.isProfileModalOpen);
const { handleCloseClick } = useModalHistory(isModalOpen, () =>
  profileStore.closeProfileModal(),
);

const { handleSubmit, setValues } = useForm({
  validationSchema: toTypedSchema(profileSchema),
});

const { value: selectedFile, errorMessage: imageError } = useField("imageFile");

const {
  value: name,
  errorMessage: nameError,
  meta: nameMeta,
} = useField("name");

const {
  value: username,
  errorMessage: usernameError,
  meta: usernameMeta,
} = useField("username");

const { value: selectedColor, errorMessage: colorError } = useField("color");

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
  [() => authStore.user, isModalOpen],
  ([newUser, isOpen]) => {
    if (newUser && isOpen) {
      serverError.value = "";

      if (avatarPreview.value && avatarPreview.value.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview.value);
      }

      avatarPreview.value = newUser.avatar_url || null;

      setValues({
        name: newUser.displayName || "",
        username: newUser.username || "",
        color: newUser.color || "",
        imageFile: null,
      });
    }
  },
  { immediate: true },
);

function handleFileChange(event) {
  const file = event.target.files[0];

  if (file) {
    if (avatarPreview.value && avatarPreview.value.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview.value);
    }

    selectedFile.value = file;
    avatarPreview.value = URL.createObjectURL(file);
  }
}

const onSubmit = handleSubmit(async (formValues) => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  serverError.value = "";

  try {
    await profileStore.updateProfile(formValues);

    toastStore.success("Perfil atualizado!");
    profileStore.closeProfileModal();
  } catch (error) {
    serverError.value = error.message || "Erro ao atualizar perfil.";
    console.error("Erro ao atualizar perfil:", error);
  } finally {
    isSubmitting.value = false;
  }
});

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
          @submit.prevent="onSubmit"
          class="space-y-4"
        >
          <div>
            <ProfileAvatar
              :avatar-preview="avatarPreview"
              @file-change="handleFileChange"
            />
            <span
              v-if="imageError"
              class="text-center text-xs text-red-500 font-medium mt-2 block"
            >
              {{ imageError }}
            </span>
          </div>

          <BaseInput
            v-model="name"
            label="Nome de exibição"
            placeholder="Digite o seu nome"
            :icon="User"
            :error="nameMeta.touched ? nameError : ''"
          />

          <BaseInput
            v-model="username"
            label="Nome de usuário"
            placeholder="Digite o seu nome de usuário"
            :icon="AtSign"
            :error="usernameMeta.touched ? usernameError : ''"
          />

          <div>
            <ColorPicker
              v-model="selectedColor"
              :color-options="USER_COLORS"
              label="Cor de identificação"
              description="Esta cor será usada para identificar suas notas."
            />
            <span
              v-if="colorError"
              class="text-xs text-red-500 font-medium mt-2 block"
            >
              {{ colorError }}
            </span>
          </div>

          <div
            v-if="serverError"
            class="p-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg"
          >
            {{ serverError }}
          </div>

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
