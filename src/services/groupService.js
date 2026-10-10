import {
  db,
  doc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  writeBatch,
  onSnapshot,
  query,
  where,
  orderBy,
  startAt,
  endAt,
  limit,
  arrayUnion,
  arrayRemove,
} from "@/services/firebase.js";
import { slugifyUsername } from "@/utils/username";

export function createGroupsListener(userId, onUpdate, onError) {
  const q = query(
    collection(db, "groups"),
    where("members", "array-contains", userId),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const groups = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      onUpdate(groups);
    },
    onError,
  );
}

export async function fetchGroupMembers(memberIds) {
  if (!memberIds?.length) return {};

  const q = query(collection(db, "users"), where("__name__", "in", memberIds));

  const snapshot = await getDocs(q);
  const membersMap = {};

  snapshot.forEach((docSnap) => {
    membersMap[docSnap.id] = { uid: docSnap.id, ...docSnap.data() };
  });

  return membersMap;
}

export async function createGroupDocument(payload, currentUserId) {
  const { groupName, invitedMembers, theme } = payload;

  const invitedMembersIds = invitedMembers.map((m) => m.uid);

  const allMembersIds = Array.from(
    new Set([currentUserId, ...invitedMembersIds]),
  );

  const newGroupPayload = {
    name: groupName,
    members: allMembersIds,
    theme,
    created_by: currentUserId,
    created_at: new Date(),
  };

  const groupRef = await addDoc(collection(db, "groups"), newGroupPayload);

  await Promise.all(
    allMembersIds.map((memberId) =>
      updateDoc(doc(db, "users", memberId), {
        my_groups: arrayUnion(groupRef.id),
      }),
    ),
  );

  return {
    group: { id: groupRef.id, ...newGroupPayload },
    invitedMembersIds,
  };
}

export async function searchUsersByUsernameQuery(searchQuery, currentUserId) {
  const cleanQuery = slugifyUsername(searchQuery);
  if (!cleanQuery || cleanQuery.length < 2) return [];

  const q = query(
    collection(db, "users"),
    orderBy("username"),
    startAt(cleanQuery),
    endAt(cleanQuery + "\uf8ff"),
    limit(8),
  );

  const snapshot = await getDocs(q);
  const results = [];

  snapshot.forEach((docSnap) => {
    if (docSnap.id === currentUserId) return;
    const data = docSnap.data();
    results.push({
      uid: docSnap.id,
      name: data.name,
      username: data.username,
      avatar_url: data.avatar_url,
      color: data.color,
    });
  });

  return results;
}

export async function deleteGroupDocument(groupId, targetGroup, currentUserId) {
  if (targetGroup.created_by !== currentUserId) {
    throw new Error("Operação não permitida.");
  }

  const batch = writeBatch(db);

  const [savedSnap, watchedSnap, notificationsSnap] = await Promise.all([
    getDocs(collection(db, `groups/${groupId}/saved_movies`)),
    getDocs(collection(db, `groups/${groupId}/watched_movies`)),
    getDocs(
      query(collection(db, "notifications"), where("group_id", "==", groupId)),
    ),
  ]);

  savedSnap.forEach((docSnap) => batch.delete(docSnap.ref));
  watchedSnap.forEach((docSnap) => batch.delete(docSnap.ref));
  notificationsSnap.forEach((docSnap) => batch.delete(docSnap.ref));

  const membersIds = targetGroup.members || [];

  membersIds.forEach((memberId) => {
    batch.update(doc(db, "users", memberId), {
      my_groups: arrayRemove(groupId),
    });
  });

  batch.delete(doc(db, "groups", groupId));

  await batch.commit();
}
