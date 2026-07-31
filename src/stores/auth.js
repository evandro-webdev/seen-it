import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { auth, db, doc, setDoc, getDoc } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

import { useGroupsStore } from "./groups";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(true);

  onAuthStateChanged(auth, async (firebaseUser) => {
    try {
      if (firebaseUser) {
        const docSnap = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = docSnap.exists() ? docSnap.data() : {};

        user.value = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          color: userData.color || "#1D4776",
          avatar_url: userData.avatar_url || null,
        };
      } else {
        user.value = null;
      }
    } catch (error) {
      console.error("Erro ao sincronizar sessão do usuário:", error);

      if (firebaseUser) {
        user.value = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
        };
      } else {
        user.value = null;
      }
    } finally {
      loading.value = false;
    }
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

  async function setupNotifications() {
    if (!user.value?.uid) return;

    try {
      window.OneSignalDeferred = window.OneSignalDeferred || [];

      window.OneSignalDeferred.push(async function (OneSignal) {
        await OneSignal.init({
          appId: import.meta.env.VITE_ONESIGNAL_API_KEY,
          allowLocalhostAsSecureOrigin: true,
          serviceWorkerParam: { scope: "/" },
          serviceWorkerPath: "OneSignalSDKWorker.js",
        });

        await OneSignal.login(user.value.uid);
        await OneSignal.Notifications.requestPermission();
      });
    } catch (error) {
      console.error("Erro ao inicializar OneSignal:", error);
    }
  }

  async function logout() {
    const groupsStore = useGroupsStore()
    groupsStore.clearActiveGroup();

    if (window.OneSignal) {
      try {
        await window.OneSignal.logout();
      } catch (e) {
        console.warn("Erro ao deslogar do OneSignal:", e);
      }
    }

    await signOut(auth);
    user.value = null;
  }

  const isAuthenticated = computed(() => !!user.value);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    setupNotifications,
  };
});
