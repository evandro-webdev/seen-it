let isInitialized = false;
let initPromise = null;

export async function initOneSignal() {
  if (isInitialized) return;
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve) => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        await OneSignal.init({
          appId: import.meta.env.VITE_ONESIGNAL_API_KEY,
          allowLocalhostAsSecureOrigin: true,
          serviceWorkerParam: { scope: "/" },
          serviceWorkerPath: "OneSignalSDKWorker.js",
        });
      } catch (err) {
      } finally {
        isInitialized = true;
        resolve();
      }
    });
  });

  return initPromise;
}

export async function logoutOneSignal() {
  if (!isInitialized) return;

  window.OneSignalDeferred = window.OneSignalDeferred || [];
  return new Promise((resolve) => {
    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        if (OneSignal.User && OneSignal.User.externalId) {
          await OneSignal.logout();
        }
      } catch (e) {
      } finally {
        resolve();
      }
    });
  });
}