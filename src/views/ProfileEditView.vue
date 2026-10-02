<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast.js";
import { USER_COLORS } from "@/constants/colors.js";

import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { profileSchema } from "@/schemas/profile.schema.js";

import { AtSign, Loader2, User, UserRoundCheck, ArrowLeft } from "@lucide/vue";

import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import ColorPicker from "@/components/forms/ColorPicker.vue";
import ProfileAvatar from "@/components/profile/ProfileAvatar.vue";

const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();

const isSubmitting = ref(false);
const avatarPreview = ref(null);
const serverError = ref("");

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

onMounted(() => {
  if (authStore.user) {
    serverError.value = "";
    avatarPreview.value = authStore.user.avatar_url || null;

    setValues({
      name: authStore.user.displayName || "",
      username: authStore.user.username || "",
      color: authStore.user.color || "",
      imageFile: null,
    });
  }
});

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
    await authStore.updateProfile(formValues);
    toastStore.success("Perfil atualizado!");
    router.push({ name: "profile" });
  } catch (error) {
    serverError.value = error.message || "Erro ao atualizar perfil.";
    console.error("Erro ao atualizar perfil:", error);
  } finally {
    isSubmitting.value = false;
  }
});

function goBack() {
  router.back();
}
</script>

<template>
  <div class="w-full pt-6 space-y-6 pb-24">
    <header class="flex items-center gap-3">
      <button
        type="button"
        @click="goBack"
        class="p-2 -ml-2 rounded-xl text-gray-600 dark:text-gray-300 active:scale-95 transition-transform"
        aria-label="Voltar"
      >
        <ArrowLeft class="w-6 h-6" />
      </button>

      <div>
        <h1
          class="text-xl font-bold text-gray-900 dark:text-white leading-tight"
        >
          Editar Perfil
        </h1>
        <span
          class="text-xs font-medium text-gray-500 dark:text-[#9EB2CD] block"
        >
          Altere suas informações de exibição
        </span>
      </div>
    </header>

    <form
      @submit.prevent="onSubmit"
      class="space-y-5"
    >
      <div>
        <ProfileAvatar
          :avatar-preview="avatarPreview"
          @file-change="handleFileChange"
        />
        <span
          v-if="imageError"
          class="text-center text-xs text-rose-500 font-medium mt-2 block"
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
          description="Esta cor será usada para identificar suas notas e reações no grupo."
        />
        <span
          v-if="colorError"
          class="text-xs text-rose-500 font-medium mt-2 block"
        >
          {{ colorError }}
        </span>
      </div>

      <div
        v-if="serverError"
        class="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl"
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
</template>
