import { defineStore } from "pinia";
import { ref } from "vue";
import {
  doc,
  db,
  updateDoc,
  updateFirebaseProfile,
  getAuth,
} from "@/services/firebase";
import { useAuthStore } from "./auth";
import { createClient } from "@supabase/supabase-js";
import Compressor from "compressorjs";

const supabase = createClient(
  "https://grfzzenmfxpdswksztzh.supabase.co",
  "sb_publishable_HYEdgykmxeRSg9hRSp7-NQ_BAkg_lJk",
);

export const useProfileStore = defineStore("profile", () => {
  const isProfileModalOpen = ref(false);
  const isUpdating = ref(false);

  async function updateProfile({ name, color, imageFile }) {
    const authStore = useAuthStore();
    const uid = authStore.user.uid;

    if (!uid) return;

    isUpdating.value = true;

    try {
      const updates = {};

      updates.name = name;
      updates.color = color;

      if (imageFile) {
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

        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(fileName, compressedFile, { upsert: true });

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(fileName);

        updates.avatar_url = publicUrl;
      }

      await updateDoc(doc(db, "users", uid), updates);

      const auth = getAuth();
      if (auth.currentUser) {
        await updateFirebaseProfile(auth.currentUser, {
          displayName: name,
        });

        authStore.user.displayName = name;

        if (updates.avatar_url) {
          authStore.user.avatar_url = updates.avatar_url;
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      isUpdating.value = false;
      closeProfileModal();
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
