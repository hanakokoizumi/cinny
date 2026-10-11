import { DeviceId, initAsync, OlmMachine, UserId } from '@matrix-org/matrix-sdk-crypto-wasm';

type SessionIdentity = { baseUrl: string; userId: string; deviceId: string };

export type SessionStores = { sync: string; legacyCrypto: string; rustCrypto: string };

const LEGACY_STORES: SessionStores = {
  sync: 'web-sync-store',
  legacyCrypto: 'crypto-store',
  rustCrypto: 'matrix-js-sdk',
};

const sessionNamespace = ({ baseUrl, userId, deviceId }: SessionIdentity) =>
  `nightcord:${[new URL(baseUrl).href.replace(/\/+$/, ''), userId, deviceId]
    .map(encodeURIComponent)
    .join(':')}`;

const preservedKeysError = () =>
  new Error(
    'Unable to open the existing encryption keys. They have been preserved. Retry or sign in again with a new session; do not clear site data.'
  );

const hasStoreCipher = (name: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(name);
    request.onupgradeneeded = () => request.transaction?.abort();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('matrix-sdk-crypto')) {
        db.close();
        resolve(false);
        return;
      }
      const transaction = db.transaction('matrix-sdk-crypto', 'readonly');
      const count = transaction.objectStore('matrix-sdk-crypto').count('store_cipher');
      transaction.oncomplete = () => {
        db.close();
        resolve(count.result > 0);
      };
      transaction.onabort = () => {
        db.close();
        reject(transaction.error);
      };
    };
  });

export const newSessionStores = (session: SessionIdentity): SessionStores => {
  const prefix = sessionNamespace(session);
  return { sync: `${prefix}:sync`, legacyCrypto: `${prefix}:legacy-crypto`, rustCrypto: prefix };
};

export const rememberSessionStores = (session: SessionIdentity, stores: SessionStores) => {
  localStorage.setItem(`${sessionNamespace(session)}:stores`, JSON.stringify(stores));
};

export async function getSessionStores(session: SessionIdentity): Promise<SessionStores> {
  const newStores = newSessionStores(session);
  const stored = localStorage.getItem(`${sessionNamespace(session)}:stores`);
  if (stored) {
    try {
      const names: SessionStores = JSON.parse(stored);
      if ([newStores, LEGACY_STORES].some((s) => JSON.stringify(s) === JSON.stringify(names))) {
        return names;
      }
    } catch {
      // An invalid marker must not make us discard an existing crypto store.
    }
  }

  const databases = await indexedDB.databases();
  if (databases.some((db) => db.name === `${LEGACY_STORES.rustCrypto}::matrix-sdk-crypto`)) {
    // Preserve keys from Cinny's previously shared default store. Only move to a
    // fresh store when the SDK confirms another owner, or an old Element session
    // identifies the encrypted store as belonging to a different device.
    const metaName = `${LEGACY_STORES.rustCrypto}::matrix-sdk-crypto-meta`;
    if (databases.some((db) => db.name === metaName) && (await hasStoreCipher(metaName))) {
      const oldElementDevice = localStorage.getItem('mx_device_id');
      const oldElementUser = localStorage.getItem('mx_user_id');
      if (
        oldElementUser &&
        oldElementDevice &&
        (oldElementUser !== session.userId || oldElementDevice !== session.deviceId)
      ) {
        return newStores;
      }
      throw preservedKeysError();
    }
    await initAsync();
    try {
      const machine = await OlmMachine.initialize(
        new UserId(session.userId),
        new DeviceId(session.deviceId),
        LEGACY_STORES.rustCrypto
      );
      machine.close();
      return LEGACY_STORES;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const differentAccount = message.includes("the account in the store doesn't match");
      if (differentAccount) {
        return newStores;
      }
      throw preservedKeysError();
    }
  }

  if (databases.some((db) => db.name === LEGACY_STORES.legacyCrypto)) {
    // The SDK will migrate older Cinny/libolm keys into the Rust store.
    return LEGACY_STORES;
  }
  return newStores;
}
