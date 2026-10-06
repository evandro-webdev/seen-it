let isInitialized = false;
let initPromise = null;

export async function initOneSignal() {
  if (isInitialized) return;
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve, reject) => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        await OneSignal.init({
          appId: import.meta.env.VITE_ONESIGNAL_API_KEY,
          allowLocalhostAsSecureOrigin: true,
          serviceWorkerParam: { scope: "/" },
          serviceWorkerPath: "OneSignalSDKWorker.js",
        });
        isInitialized = true;
        resolve();
      } catch (err) {
        initPromise = null;
        reject(err);
      }
    });
  });

  return initPromise;
}

export async function setupUserNotifications(userId) {
  if (!userId) return;

  try {
    await initOneSignal();

    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        const currentExternalId = await OneSignal.User?.externalId;
        if (currentExternalId !== userId) {
          await OneSignal.login(userId);
        }

        await OneSignal.Notifications.requestPermission();
      } catch (e) {
        console.error("Erro no login/permissão do OneSignal:", e);
      }
    });
  } catch (error) {
    console.error("Erro ao configurar notificações de usuário:", error);
  }
}

export async function logoutOneSignal() {
  if (!isInitialized) return;

  return new Promise((resolve) => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        if (OneSignal.User?.externalId) {
          await OneSignal.logout();
        }
      } catch (e) {
        console.error("Erro ao fazer logout do OneSignal:", e);
      } finally {
        resolve();
      }
    });
  });
}
