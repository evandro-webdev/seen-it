<script setup>
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast.js";
import { useRouter } from "vue-router";
import { getUserColor } from "@/constants/colors.js";

import { User, Pencil, LogOut } from "@lucide/vue";

import BaseButton from "@/components/ui/BaseButton.vue";
import AuthForm from "@/components/auth/AuthForm.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import FavoriteMoviesSection from "@/components/profile/FavoriteMoviesSection.vue";
import AchievementsSection from "@/components/profile/AchievementsSection.vue";
import StatsSection from "@/components/profile/StatsSection.vue";

const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();

const isLoggingOut = ref(false);
const user = computed(() => authStore.user);

const userColor = computed(() => getUserColor(user.value?.color));

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
    class="w-full pt-6 space-y-6 select-none"
  >
    <header class="flex flex-col items-center text-center space-y-3">
      <div
        class="w-24 h-24 rounded-full p-1 ring-2"
        :style="{ '--tw-ring-color': userColor.primary }"
      >
        <img
          v-if="user?.avatar_url"
          :src="user.avatar_url"
          :alt="user.name"
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
          {{ user?.name || "Usuário" }}
        </h1>
        <span
          class="text-xs font-medium text-gray-500 dark:text-[#9EB2CD] block"
        >
          @{{ user?.username || "usuario" }}
        </span>
      </div>

      <BaseButton
        label="Editar perfil"
        :icon="Pencil"
        variant="secondary"
        size="sm"
        @click="goToEdit"
        class="!rounded-full !px-5 !py-2"
      />
    </header>

    <StatsSection />
    <FavoriteMoviesSection />
    <AchievementsSection />

    <hr class="border-gray-200 dark:border-gray-800" />

    <BaseButton
      label="Sair da conta"
      variant="danger-outline"
      size="lg"
      :icon="LogOut"
      :disabled="isLoggingOut"
      :loading="isLoggingOut"
      @click="handleLogout"
      block
    />
  </div>
</template>
