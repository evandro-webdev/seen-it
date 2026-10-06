export async function sendPushNotification(targetUserIds, title, body, type) {
  if (!targetUserIds || targetUserIds.length === 0) return;

  const url = "https://onesignal.com/api/v1/notifications";

  const payload = {
    app_id: import.meta.env.VITE_ONESIGNAL_API_KEY,
    include_aliases: {
      external_id: targetUserIds,
    },
    target_channel: "push",
    contents: { en: body, pt: body },
    headings: { en: title, pt: title },
    android_group: `${type}_${Date.now()}`,
    web_push_topic: `${type}_${Date.now()}`,
    android_group_message: { pt: "$[notif_count] novas atualizações!" },
  };

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${import.meta.env.VITE_ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Erro ao enviar push via OneSignal:", error);
  }
}
