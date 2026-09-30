<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast.js";
import { getUserColor } from "@/constants/colors.js";

import {
  User,
  Pencil,
  LogOut,
  Loader2,
  Film,
  Users,
  CheckCircle2,
} from "@lucide/vue";

import BaseButton from "@/components/ui/BaseButton.vue";
import AuthForm from "@/components/auth/AuthForm.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();

const isLoggingOut = ref(false);
const user = computed(() => authStore.user);

const userColor = computed(() => getUserColor(user.value?.color));

// TODO: Exibir dados verdadeiros e reativos
const stats = computed(() => [
  { label: "Assistidos", value: 42, icon: Film, color: "text-[#0088FF]" },
  {
    label: "Salvos",
    value: 38,
    icon: CheckCircle2,
    color: "text-amber-500",
  },
  { label: "Grupos", value: 3, icon: Users, color: "text-emerald-500" },
]);

function goToEdit() {
  router.push({ name: "profile-edit" });
}

async function handleLogout() {
  if (isLoggingOut.value) return;

  isLoggingOut.value = true;
  try {
    await authStore.logout();
    toastStore.info("Sessão encerrada.");
    router.push("/");
  } catch (error) {
    console.error("Erro ao encerrar sessão:", error);
    toastStore.error("Não foi possível sair no momento.");
  } finally {
    isLoggingOut.value = false;
  }
}
</script>

<template>
  <LoadingSpinner
    v-if="authStore.loading"
    full-screen
  />

  <AuthForm v-else-if="!authStore.isAuthenticated" />

  <div
    v-else
    class="w-full pt-6 space-y-6 pb-24 select-none"
  >
    <header class="flex flex-col items-center text-center space-y-3">
      <div
        class="w-24 h-24 rounded-full p-1 ring-2"
        :style="{ '--tw-ring-color': userColor.primary }"
      >
        <img
          v-if="user?.avatar_url"
          :src="user.avatar_url"
          :alt="user.displayName"
          class="w-full h-full object-cover rounded-full"
        />
        <div
          v-else
          class="w-full h-full bg-gray-200 dark:bg-slate-800 flex items-center justify-center rounded-full text-gray-400"
        >
          <User class="w-10 h-10" />
        </div>
      </div>

      <div>
        <h1
          class="text-xl font-bold text-gray-900 dark:text-white leading-tight"
        >
          {{ user?.displayName || "Usuário" }}
        </h1>
        <span
          class="text-xs font-medium text-gray-500 dark:text-[#9EB2CD] block"
        >
          @{{ user?.username || "usuario" }}
        </span>
      </div>

      <BaseButton
        label="Editar perfil"
        variant="secondary"
        size="sm"
        class="!rounded-full !px-5 !py-2"
        @click="goToEdit"
      >
        <template #icon>
          <Pencil class="w-3.5 h-3.5" />
        </template>
      </BaseButton>
    </header>

    <section class="grid grid-cols-3 gap-3">
      <div
        v-for="item in stats"
        :key="item.label"
        class="p-3 bg-gray-100 dark:bg-[#1A1F33] rounded-2xl flex flex-col items-center justify-center text-center space-y-1"
      >
        <component
          :is="item.icon"
          class="w-4 h-4"
          :class="item.color"
        />
        <span
          class="text-lg font-bold text-gray-900 dark:text-white leading-none"
        >
          {{ item.value }}
        </span>
        <span
          class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
        >
          {{ item.label }}
        </span>
      </div>
    </section>

    <section class="space-y-2.5">
      <h2
        class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1"
      >
        Filmes Favoritos (EM BREVE)
      </h2>

      <div class="grid grid-cols-3 gap-3">
        <div
          v-for="index in 3"
          :key="index"
          class="aspect-[2/3] rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900/40 flex flex-col items-center justify-center text-gray-400 dark:text-slate-600 transition-colors"
        >
          <Film class="w-6 h-6 opacity-60" />
        </div>
      </div>
    </section>

    <hr class="border-gray-200 dark:border-gray-800" />

    <BaseButton
      label="Sair da conta"
      variant="danger-outline"
      size="lg"
      :disabled="isLoggingOut"
      block
      @click="handleLogout"
    >
      <template #icon>
        <Loader2 v-if="isLoggingOut" />
        <LogOut v-else />
      </template>
    </BaseButton>
  </div>
</template>
