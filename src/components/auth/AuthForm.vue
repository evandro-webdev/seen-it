<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "../../stores/auth.js";

const authStore = useAuthStore();

const name = ref("");
const email = ref("");
const password = ref("");

const currentForm = ref("login");

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
  if (currentForm.value === "register") {
    await authStore.register(email.value, password.value, name.value);
  } else {
    await authStore.login(email.value, password.value);
  }
}
</script>

<template>
  <div
    class="max-w-sm mx-auto w-full flex flex-1 flex-col justify-center gap-6"
  >
    <div class="text-gray-800 dark:text-gray-200 space-y-1">
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
        <input
          v-if="currentForm === 'register'"
          type="text"
          v-model="name"
          required
          class="w-full p-4 rounded-xl text-sm text-gray-700 dark:text-gray-300 bg-[#F7F7F7] dark:bg-[#282E4D] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Nome completo"
        />

        <input
          type="email"
          v-model="email"
          required
          class="w-full p-4 rounded-xl text-sm text-gray-700 dark:text-gray-300 bg-[#F7F7F7] dark:bg-[#282E4D] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="E-mail"
        />

        <input
          type="password"
          v-model="password"
          required
          class="w-full p-4 rounded-xl text-sm text-gray-700 dark:text-gray-300 bg-[#F7F7F7] dark:bg-[#282E4D] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Senha"
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
          class="text-[#0088FF] font-semibold hover:underline bg-transparent border-none p-0 inline-block"
        >
          {{ currentForm === "register" ? "Entrar" : "Criar conta" }}
        </button>
      </p>

      <button
        type="submit"
        class="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-[#0088FF] shadow-md shadow-blue-500/10 active:scale-98 transition-transform"
      >
        {{ currentForm === "register" ? "Criar conta" : "Entrar" }}
      </button>
    </form>
  </div>
</template>
