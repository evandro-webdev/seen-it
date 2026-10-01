import { auth, db, doc, runTransaction } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { getFirstName } from "@/utils/username";
import { generateUniqueUsername } from "@/utils/username";
import { loginSchema, registerSchema } from "@/schemas/auth.schema";

export async function registerUser(payload) {
  const parseResult = registerSchema.safeParse(payload);

  if (!parseResult.success) {
    throw new Error("Dados de registro inválidos");
  }

  const { name, email, password } = parseResult.data;

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
      color: getRandomUserColor(),
      created_at: new Date(),
    });
  });
}

export async function loginUser(payload) {
  const parseResult = loginSchema.safeParse(payload);

  if (!parseResult.success) {
    throw new Error("Dados de login inválidos");
  }

  const { email, password } = parseResult.data;

  await signInWithEmailAndPassword(auth, email, password);
}
