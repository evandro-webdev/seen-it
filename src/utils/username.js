import { db, doc, getDoc } from "@/services/firebase.js";

export function slugifyUsername(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_.]/g, "")
    .trim();
}

export async function generateUniqueUsername(baseName) {
  let cleanBase = slugifyUsername(baseName.split(" ")[0] || "user");
  if (cleanBase.length < 3) cleanBase = "user";

  let isUnique = false;
  let finalUsername = "";

  while (!isUnique) {
    const randomSufix = Math.floor(1000 + Math.random() * 9000);
    finalUsername = `${cleanBase}_${randomSufix}`;

    const userNameDoc = await getDoc(doc(db, "usernames", finalUsername));
    if (!userNameDoc.exists()) {
      isUnique = true;
    }
  }

  return finalUsername;
}
