<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth.js";
import { useToastStore } from "@/stores/toast";

import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { loginSchema, registerSchema } from "@/schemas/auth.schema.js";

import { Asterisk, AtSign, Loader2, LogIn, User } from "@lucide/vue";
import BaseInput from "../forms/BaseInput.vue";
import BaseButton from "../ui/BaseButton.vue";

const authStore = useAuthStore();
const toastStore = useToastStore();

const currentForm = ref("login");
const isSubmitting = ref(false);

const serverError = ref("");

const formTexts = computed(() => {
  return currentForm.value === "register"
    ? { title: "Crie sua conta", subtitle: "Faça seu cadastro para começar" }
    : {
        title: "Acesse sua conta",
        subtitle: "Você precisa estar autenticado para acessar essa aba",
      };
});

const currentSchema = computed(() => {
  return currentForm.value === "register"
    ? toTypedSchema(registerSchema)
    : toTypedSchema(loginSchema);
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: currentSchema,
  validateOnInput: false,
  validateOnBlur: false,
  validateOnChange: false,
  initialValues: {
    name: "",
    email: "",
    password: "",
  },
});

const { value: name, errorMessage: nameError, meta: nameMeta } = useField("name");
const { value: email, errorMessage: emailError, meta: emailMeta } = useField("email");
const { value: password, errorMessage: passwordError, meta: passwordMeta } = useField("password");

function toggleForm() {
  currentForm.value = currentForm.value === "login" ? "register" : "login";
  resetForm();
}

const onSubmit = handleSubmit(async (values) => {
  serverError.value = "";

  isSubmitting.value = true;

  try {
    if (currentForm.value === "register") {
      await authStore.register(values.email, values.password, values.name);
      toastStore.success(
        `Conta criada com sucesso! Bem-vindo, ${values.name.split(" ")[0]}!`,
      );
    } else {
      await authStore.login(values.email, values.password);
      toastStore.success("Login realizado com sucesso!");
    }
  } catch (error) {
    serverError.value = error.message || "Erro ao autenticar. Tente novamente.";
    console.error("Erro na autenticação: ", error);

    const firebaseErrors = {
      "auth/invalid-credential": "E-mail ou senha incorretos.",
      "auth/user-not-found": "E-mail ou senha incorretos.",
      "auth/wrong-password": "E-mail ou senha incorretos.",
      "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    };

    const message =
      firebaseErrors[error.code] || "Erro ao autenticar. Tente novamente.";
    toastStore.error(message);
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<template>
  <div
    class="min-h-[calc(100dvh-150px)] w-full flex flex-col items-center justify-center"
  >
    <div
      class="max-w-sm mx-auto w-full flex flex-1 flex-col justify-center gap-6"
    >
      <div class="text-center text-gray-800 dark:text-gray-200 space-y-1">
        <h1 class="text-3xl font-bold tracking-tight">{{ formTexts.title }}</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 [text-wrap:balance]">
          {{ formTexts.subtitle }}
        </p>
      </div>

      <form
        @submit.prevent="onSubmit"
        class="space-y-5"
      >
        <div class="space-y-3.5">
          <BaseInput
            v-if="currentForm === 'register'"
            v-model="name"
            label="Nome"
            placeholder="Digite seu nome"
            :icon="User"
            :error="nameMeta.touched ? nameError : ''"
          />

          <BaseInput
            v-model="email"
            type="email"
            label="Email"
            placeholder="Digite seu email"
            :icon="AtSign"
            :error="emailMeta.touched ? emailError : ''"
          />

          <BaseInput
            v-model="password"
            type="password"
            label="Senha"
            placeholder="Senha"
            :icon="Asterisk"
            :error="passwordMeta.touched ? passwordError : ''"
          />
        </div>

        <p class="text-xs text-gray-600 dark:text-gray-400 text-center">
          {{
            currentForm === "register"
              ? "Já possui uma conta? "
              : "Não possui uma conta? "
          }}
          <button
            @click.prevent="toggleForm"
            type="button"
            class="text-[#0088FF] font-semibold bg-transparent border-none p-0 inline-block"
          >
            {{ currentForm === "register" ? "Entrar" : "Criar conta" }}
          </button>
        </p>

        <BaseButton
          type="submit"
          size="lg"
          :label="currentForm === 'register' ? 'Criar conta' : 'Entrar'"
          :icon="LogIn"
          :disabled="isSubmitting"
          block
        >
          <template #icon>
            <Loader2
              v-if="isSubmitting"
              class="w-5 h-5 animate-spin"
            />
            <LogIn
              v-else
              class="w-5 h-5"
            />
          </template>
        </BaseButton>
      </form>
    </div>
  </div>
</template>
