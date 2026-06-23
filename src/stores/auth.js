import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { auth, db, doc, setDoc } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(true);

  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
    loading.value = false;
  });

  async function register(email, password, name) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await updateProfile(userCredential.user, { displayName: name });

    await setDoc(doc(db, "users", userCredential.user.uid), {
      name,
      email,
      color: "#1D4776",
    });
  }

  async function login(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    await signOut(auth);
  }

  const isAuthenticated = computed(() => !!user.value);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };
});
