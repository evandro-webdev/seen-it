import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { auth } from "../services/firebase";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  getRedirectResult,
} from "firebase/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(true);

  const provider = new GoogleAuthProvider();

  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
    loading.value = false;
  });

  getRedirectResult(auth).catch((err) => {
    console.error("Erro no redirect:", err);
  });

  async function loginWithGoogle() {
    const isMobileOrPWA =
      window.matchMedia("(display-mode: standalone)").matches ||
      /Android|iPhone|iPad/i.test(navigator.userAgent);

    if (isMobileOrPWA) {
      await signInWithRedirect(auth, provider);
    } else {
      await signInWithPopup(auth, provider);
    }
  }

  async function logout() {
    await signOut(auth);
  }

  const isAuthenticated = computed(() => !!user.value);

  return { user, loading, isAuthenticated, loginWithGoogle, logout };
});
