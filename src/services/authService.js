import { auth, db, doc, runTransaction } from "@/services/firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { getFirstName } from "@/utils/username";
import { generateUniqueUsername } from "@/utils/username";
import { loginSchema, registerSchema } from "@/schemas/auth.schema";
import { getRandomUserColor } from "@/constants/colors";

export async function registerUser(payload) {
  const parseResult = registerSchema.safeParse(payload);

  if (!parseResult.success) {
    throw new Error("Dados de registro inválidos");
  }

  const { name, email, password } = parseResult.data;

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const firstName = getFirstName(name);
  const autoUsername = await generateUniqueUsername(firstName);
  const userColor = getRandomUserColor();

  await runTransaction(db, async (transaction) => {
    const usernameRef = doc(db, "usernames", autoUsername);
    const userRef = doc(db, "users", userCredential.user.uid);

    transaction.set(usernameRef, { uid: userCredential.user.uid });
    transaction.set(userRef, {
      name,
      email,
      username: autoUsername,
      color: userColor,
      avatar_url: null,
      created_at: new Date(),
    });
  });

  return {
    uid: userCredential.user.uid,
    email,
    name,
    username: autoUsername,
    color: userColor,
    avatar_url: null,
  };
}

export async function loginUser(payload) {
  const parseResult = loginSchema.safeParse(payload);

  if (!parseResult.success) {
    throw new Error("Dados de login inválidos");
  }

  const { email, password } = parseResult.data;

  await signInWithEmailAndPassword(auth, email, password);
}
