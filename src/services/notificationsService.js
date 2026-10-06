import {
  db,
  collection,
  query,
  where,
  updateDoc,
  doc,
  writeBatch,
  getDocs,
  orderBy,
  limit,
  onSnapshot,
} from "@/services/firebase";

export function createNotificationsListener(uid, onUpdate, onError) {
  if (!uid) return () => {};

  const q = query(
    collection(db, "notifications"),
    where("user_id", "==", uid),
    orderBy("created_at", "desc"),
    limit(50),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const notifications = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      onUpdate(notifications);
    },
    onError,
  );
}

export async function persistNotificationsForRecipients(
  recipients,
  sender,
  notificationData,
) {
  if (!recipients || recipients.length === 0) return;

  const batch = writeBatch(db);

  recipients.forEach((uid) => {
    const notiRef = doc(collection(db, "notifications"));
    batch.set(notiRef, {
      user_id: uid,
      sender_id: sender?.uid,
      sender_name: sender?.name || "",
      is_read: false,
      created_at: new Date(),
      ...notificationData,
    });
  });

  await batch.commit();
}

export async function markNotificationAsRead(notificationId) {
  await updateDoc(doc(db, "notifications", notificationId), {
    is_read: true,
  });
}

export async function markMultipleNotificationsAsRead(notifications) {
  if (!notifications || notifications.length === 0) return;

  const batch = writeBatch(db);

  notifications.forEach((n) => {
    const notiRef = doc(db, "notifications", n.id);
    batch.update(notiRef, { is_read: true });
  });

  await batch.commit();
}

export async function purgeGroupOldNotifications(groupId, daysThreshold = 14) {
  if (!groupId) return;

  const thresholdDate = new Date(
    Date.now() - daysThreshold * 24 * 60 * 60 * 1000,
  );

  const q = query(
    collection(db, "notifications"),
    where("group_id", "==", groupId),
    where("created_at", "<=", thresholdDate),
  );

  const snapshot = await getDocs(q);

  const batch = writeBatch(db);
  snapshot.docs.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  await batch.commit();
}
