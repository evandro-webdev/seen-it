import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { auth } from "../services/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(true);

  const provider = new GoogleAuthProvider();

  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
    loading.value = false;
  });

  async function loginWithGoogle() {
    await signInWithPopup(auth, provider);
  }

  async function logout(){
    await signOut(auth);
  }

  const isAuthenticated = computed(() => !!user.value);

  return { user, loading, isAuthenticated, loginWithGoogle, logout }
});
