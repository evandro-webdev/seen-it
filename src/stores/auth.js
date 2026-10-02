import { defineStore } from "pinia";
import { ref, computed } from "vue";

import { signOut, onAuthStateChanged } from "firebase/auth";

import { useGroupsStore } from "./groups";
import { logoutOneSignal } from "@/services/onesignal";

import { auth } from "@/services/firebase";
import { loginUser, registerUser } from "@/services/authService";
import { getUserProfile, updateUserProfile } from "@/services/userService";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(true);

  onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      user.value = null;
      loading.value = false;
      ("");
      return;
    }

    try {
      const userData = await getUserProfile(firebaseUser.uid);

      if (!userData) {
        user.value = null;
        loading.value = false;
        return;
      }

      user.value = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: userData.name,
        username: userData.username,
        color: userData.color,
        avatar_url: userData.avatar_url,
      };
    } catch (error) {
      console.error("Erro ao carregar perfil do Firestore:", error);
      user.value = null;
    } finally {
      loading.value = false;
    }
  });

  async function register(payload) {
    try {
      const newProfile = await registerUser(payload);
      user.value = newProfile;
    } catch (error) {
      user.value = null;
      throw error;
    }
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

  const isAuthenticated = computed(() => !!user.value);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };
});
