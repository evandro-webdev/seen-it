import { doc, db, updateDoc, getDoc, runTransaction } from "@/services/firebase";
import { createClient } from "@supabase/supabase-js";
import { slugifyUsername } from "@/utils/username";
import { profileSchema } from "@/schemas/profile.schema";

import Compressor from "compressorjs";

const supabase = createClient(
  "https://grfzzenmfxpdswksztzh.supabase.co",
  "sb_publishable_HYEdgykmxeRSg9hRSp7-NQ_BAkg_lJk",
);

export async function getUserProfile(uid) {
  const userDocRef = doc(db, "users", uid);
  const docSnap = await getDoc(userDocRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function processUsernameChange(uid, currentUsername, newUsername) {
  const cleanUsername = slugifyUsername(newUsername);
  if (cleanUsername === currentUsername) return null;

  if (cleanUsername.length < 3) {
    throw new Error("O nome de usuário deve ter no mínimo 3 caracteres.");
  }

  await runTransaction(db, async (transaction) => {
    const newUsernameRef = doc(db, "usernames", cleanUsername);
    const newUsernameDoc = await transaction.get(newUsernameRef);

    if (newUsernameDoc.exists()) {
      throw new Error("Este nome de usuário já está em uso.");
    }

    if (currentUsername) {
      const oldUsernameRef = doc(db, "usernames", currentUsername);
      transaction.delete(oldUsernameRef);
    }

    transaction.set(newUsernameRef, { uid });
  });

  return cleanUsername;
}

export async function processAvatarUpload(uid, imageFile) {
  if (!imageFile) return null;

  const compressedFile = await new Promise((resolve, reject) => {
    new Compressor(imageFile, {
      quality: 0.8,
      maxWidth: 300,
      maxHeight: 300,
      fit: "cover",
      mimeType: "image/jpeg",
      convertSize: 500000,
      success: (result) =>
        resolve(result.size > imageFile.size ? imageFile : result),
      error: (err) => reject(err),
    });
  });

  const fileName = `${uid}.jpg`;
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, compressedFile, {
      upsert: true,
      contentType: "image/jpeg",
      cacheControl: "3600",
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
  if (!data?.publicUrl) throw new Error("URL pública não encontrada.");

  return `${data.publicUrl}?t=${Date.now()}`;
}

export async function updateUserProfile(user, payload) {
  const parseResult = profileSchema.safeParse(payload);

  if (!parseResult.success) {
    throw new Error("Dados de perfil inválidos.");
  }

  const { name, username, color, imageFile } = parseResult.data;
  const updates = { name, color };

  if (username) {
    const updatedUsername = await processUsernameChange(
      user.uid,
      user.username,
      username,
    );
    if (updatedUsername) updates.username = updatedUsername;
  }

  if (imageFile) {
    updates.avatar_url = await processAvatarUpload(user.uid, imageFile);
  }

  await updateDoc(doc(db, "users", user.uid), updates);

  return updates;
}
