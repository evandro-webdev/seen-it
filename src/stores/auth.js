import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { auth } from "../services/firebase";

import {
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { useGroupsStore } from "./groups";
import { initOneSignal, logoutOneSignal } from "@/services/onesignal";

import { getRandomUserColor } from "@/constants/colors";
import { loginUser, registerUser } from "@/services/authService";
import { getUserProfile, updateUserProfile } from "@/services/userService";
import { getFirstName } from "@/utils/username";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(true);

  onAuthStateChanged(auth, async (firebaseUser) => {
    try {
      if (firebaseUser) {
        const userData = await getUserProfile(firebaseUser.uid);

        user.value = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || "",
          email: firebaseUser.email,
          username: userData?.username,
          color: userData?.color,
          avatar_url: userData?.avatar_url || null,
        };
      } else {
        user.value = null;
      }
    } catch (error) {
      console.error("Erro ao sincronizar sessão do usuário:", error);

      if (firebaseUser) {
        user.value = {
          uid: firebaseUser.uid,
          displayName: getFirstName(firebaseUser.displayName),
          email: firebaseUser.email,
          color: getRandomUserColor(),
        };
      } else {
        user.value = null;
      }
    } finally {
      loading.value = false;
    }
  });

  async function register(payload) {
    await registerUser(payload);
  }

  async function login(payload) {
    await loginUser(payload);
  }

  async function logout() {
    const groupsStore = useGroupsStore();
    groupsStore.clearActiveGroup();

    await logoutOneSignal();

    await signOut(auth);
    user.value = null;
  }

  async function updateProfile(payload) {
    if (!user.value?.uid) throw new Error("Você não está autenticado.");
    
    const updatedData = await updateUserProfile(user.value, payload);
    
    user.value = {
      ...user.value,
      ...updatedData,
    };
  }

  async function setupNotifications() {
    if (!user.value?.uid) return;

    try {
      await initOneSignal();

      window.OneSignalDeferred.push(async (OneSignal) => {
        try {
          await OneSignal.login(user.value.uid);
        } catch (e) {}
        await OneSignal.Notifications.requestPermission();
      });
    } catch (error) {
      console.error("Erro ao configurar notificações:", error);
    }
  }

  const isAuthenticated = computed(() => !!user.value);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    setupNotifications,
  };
});
