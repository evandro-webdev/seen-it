import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { auth, db, doc, runTransaction, getDoc } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

import { useGroupsStore } from "./groups";
import { generateUniqueUsername } from "@/utils/username";
import { initOneSignal, logoutOneSignal } from "@/services/onesignal";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(true);

  const getFirstName = (fullName) =>
    fullName ? fullName.trim().split(" ")[0] : "";

  onAuthStateChanged(auth, async (firebaseUser) => {
    try {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(userDocRef);
        const userData = docSnap.exists() ? docSnap.data() : {};

        user.value = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || "",
          email: firebaseUser.email,
          username: userData.username,
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
          displayName: getFirstName(firebaseUser.displayName || ""),
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
    const firstName = getFirstName(name);

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await updateProfile(userCredential.user, { displayName: firstName });
    const autoUsername = await generateUniqueUsername(firstName);

    await runTransaction(db, async (transaction) => {
      const usernameRef = doc(db, "usernames", autoUsername);
      const userRef = doc(db, "users", userCredential.user.uid);

      transaction.set(usernameRef, { uid: userCredential.user.uid });
      transaction.set(userRef, {
        name,
        email,
        username: autoUsername,
        color: "#1D4776",
        created_at: new Date(),
      });
    });
  }

  async function login(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
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

  async function logout() {
    const groupsStore = useGroupsStore();
    groupsStore.clearActiveGroup();

    await logoutOneSignal();

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
