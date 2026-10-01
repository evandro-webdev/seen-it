import {
  doc,
  db,
  updateDoc,
  updateFirebaseProfile,
  getAuth,
  getDoc,
  writeBatch,
} from "@/services/firebase";
import { createClient } from "@supabase/supabase-js";
import { getFirstName, slugifyUsername } from "@/utils/username";
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

  const auth = getAuth();
  const firstName = getFirstName(name);

  await updateFirebaseProfile(auth.currentUser, { displayName: firstName });

  return {
    displayName: firstName,
    color,
    ...(updates.username && { username: updates.username }),
    ...(updates.avatar_url && { avatar_url: updates.avatar_url }),
  };
}
