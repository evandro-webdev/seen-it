import { defineStore } from "pinia";
import { ref } from "vue";
import {
  doc,
  db,
  updateDoc,
  updateFirebaseProfile,
  getAuth,
  getDoc,
  writeBatch,
} from "@/services/firebase";
import { useAuthStore } from "./auth";
import { createClient } from "@supabase/supabase-js";
import Compressor from "compressorjs";
import { slugifyUsername } from "@/utils/username";

const supabase = createClient(
  "https://grfzzenmfxpdswksztzh.supabase.co",
  "sb_publishable_HYEdgykmxeRSg9hRSp7-NQ_BAkg_lJk",
);

export const useProfileStore = defineStore("profile", () => {
  const isProfileModalOpen = ref(false);

  async function processUsernameChange(uid, currentUsername, newUsername) {
    const cleanUsername = slugifyUsername(newUsername);

    if (cleanUsername === currentUsername) return null;

    if (cleanUsername.length < 3) {
      throw new Error("O nome de usuário deve ter no mínimo 3 caracteres.");
    }

    const usernameDocRef = doc(db, "usernames", cleanUsername);
    const usernameDoc = await getDoc(usernameDocRef);

    if (usernameDoc.exists()) {
      throw new Error("Este nome de usuário já está em uso.");
    }

    const batch = writeBatch(db);
    batch.delete(doc(db, "usernames", currentUsername));
    batch.set(usernameDocRef, { uid });
    await batch.commit();

    return cleanUsername;
  }

  async function processAvatarUpload(uid, imageFile) {
    const compressedFile = await new Promise((resolve, reject) => {
      new Compressor(imageFile, {
        quality: 0.6,
        maxWidth: 400,
        maxHeight: 400,
        success(result) {
          resolve(result);
        },
        error(err) {
          reject(err);
        },
      });
    });

    const fileName = `${uid}.jpg`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, compressedFile, { upsert: true });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName);

    return `${publicUrl}?t=${Date.now()}`;
  }

  async function updateProfile(payload) {
    const authStore = useAuthStore();
    const uid = authStore.user?.uid;

    if (!uid) {
      throw new Error("Você não está autenticado.");
    }

    const parseResult = profileSchema.safeParse(payload);

    if (!parseResult.success) {
      throw new Error("Dados de perfil inválidos.");
    }

    const { name, username, color, imageFile } = parseResult.data;

    const updates = { name, color };

    if (username) {
      const updatedUsername = await processUsernameChange(
        uid,
        authStore.user.username,
        username,
      );

      if (updatedUsername) {
        updates.username = updatedUsername;
      }
    }

    if (imageFile) {
      updates.avatar_url = await processAvatarUpload(uid, imageFile);
    }

    await updateDoc(doc(db, "users", uid), updates);

    const auth = getAuth();

    const firstName = name.trim().split(" ")[0];

    await updateFirebaseProfile(auth.currentUser, {
      displayName: firstName,
    });

    authStore.user.displayName = firstName;
    authStore.user.color = color;

    if (updates.username) {
      authStore.user.username = updates.username;
    }

    if (updates.avatar_url) {
      authStore.user.avatar_url = updates.avatar_url;
    }
  }

  function openProfileModal() {
    isProfileModalOpen.value = true;
  }

  function closeProfileModal() {
    isProfileModalOpen.value = false;
  }

  return {
    openProfileModal,
    closeProfileModal,
    isProfileModalOpen,
    updateProfile,
  };
});
