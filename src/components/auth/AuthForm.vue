<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth.js";
import { Asterisk, AtSign, Loader2, LogIn, User } from "@lucide/vue";
import { useToastStore } from "@/stores/toast";
import BaseInput from "../forms/BaseInput.vue";
import BaseButton from "../ui/BaseButton.vue";

const authStore = useAuthStore();
const toastStore = useToastStore();

const name = ref("");
const email = ref("");
const password = ref("");

const currentForm = ref("login");
const isSubmiting = ref(false);

const formTexts = computed(() => {
  return currentForm.value === "register"
    ? { title: "Crie sua conta", subtitle: "Faça seu cadastro para começar" }
    : {
        title: "Acesse sua conta",
        subtitle: "Você precisa estar autenticado para acessar essa aba",
      };
});

function toggleForm() {
  currentForm.value = currentForm.value === "login" ? "register" : "login";

  name.value = "";
  email.value = "";
  password.value = "";
}

async function handleAuthentication() {
  if (isSubmiting.value) return;

  isSubmiting.value = true;

  try {
    if (currentForm.value === "register") {
      await authStore.register(email.value, password.value, name.value);
      toastStore.success(
        `Conta criada com sucesso! Bem-vindo, ${name.value.split(" ")[0]}!`,
      );
    } else {
      await authStore.login(email.value, password.value);
      toastStore.success("Login realizado com sucesso!");
    }
  } catch (error) {
    console.error("Erro na autenticação: ", error);

    let message = "Erro ao autenticar. Tente novamente.";
    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/user-not-found"
    ) {
      message = "E-mail ou senha incorretos.";
    } else if (error.code === "auth/email-already-in-use") {
      message = "Este e-mail já está em uso.";
    } else if (error.code === "auth/weak-password") {
      message = "A senha deve ter pelo menos 6 caracteres.";
    }

    toastStore.error(message);
  } finally {
    isSubmiting.value = false;
  }
}
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
        @submit.prevent="handleAuthentication"
        class="space-y-5"
      >
        <div class="space-y-3.5">
          <BaseInput
            v-if="currentForm === 'register'"
            v-model="name"
            label="Nome"
            placeholder="Digite seu nome"
            :icon="User"
          />

          <BaseInput
            v-model="email"
            type="email"
            label="Email"
            placeholder="Digite seu email"
            :icon="AtSign"
          />

          <BaseInput
            v-model="password"
            type="password"
            label="Senha"
            placeholder="Senha"
            :icon="Asterisk"
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
          :disabled="isSubmiting"
          block
        >
          <template #icon>
            <Loader2
              v-if="isSubmiting"
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
