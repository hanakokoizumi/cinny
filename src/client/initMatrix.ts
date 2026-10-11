import { createClient, MatrixClient, IndexedDBStore, IndexedDBCryptoStore } from 'matrix-js-sdk';

import { cryptoCallbacks } from './secretStorageKeys';
import { clearNavToActivePathStore } from '../app/state/navToActivePath';
import { pushSessionToSW } from '../sw-session';
import { getFallbackSession, removeFallbackSession } from '../app/state/sessions';
import { getSessionStores, rememberSessionStores, SessionStores } from './sessionStorage';

type Session = {
  baseUrl: string;
  accessToken: string;
  userId: string;
  deviceId: string;
};

const clientStores = new WeakMap<MatrixClient, SessionStores>();
const clients = new Map<string, Promise<MatrixClient>>();

const createSessionClient = async (session: Session): Promise<MatrixClient> => {
  const stores = await getSessionStores(session);
  const indexedDBStore = new IndexedDBStore({
    indexedDB: global.indexedDB,
    localStorage: global.localStorage,
    dbName: stores.sync,
  });

  const legacyCryptoStore = new IndexedDBCryptoStore(global.indexedDB, stores.legacyCrypto);

  const mx = createClient({
    baseUrl: session.baseUrl,
    accessToken: session.accessToken,
    userId: session.userId,
    store: indexedDBStore,
    cryptoStore: legacyCryptoStore,
    deviceId: session.deviceId,
    timelineSupport: true,
    cryptoCallbacks: cryptoCallbacks as any,
    verificationMethods: ['m.sas.v1'],
  });

  try {
    await indexedDBStore.startup();
    await mx.initRustCrypto({ cryptoDatabasePrefix: stores.rustCrypto });
  } catch (error) {
    mx.stopClient();
    throw error;
  }

  rememberSessionStores(session, stores);
  clientStores.set(mx, stores);

  mx.setMaxListeners(50);

  return mx;
};

export const initClient = (session: Session): Promise<MatrixClient> => {
  const key = JSON.stringify([session.baseUrl, session.userId, session.deviceId]);
  const existing = clients.get(key);
  if (existing) return existing;
  const promise = createSessionClient(session).catch((error) => {
    clients.delete(key);
    throw error;
  });
  clients.set(key, promise);
  return promise;
};

export const startClient = async (mx: MatrixClient) => {
  await mx.startClient({
    lazyLoadMembers: true,
  });
};

export const clearCacheAndReload = async (mx: MatrixClient) => {
  mx.stopClient();
  clearNavToActivePathStore(mx.getSafeUserId());
  await mx.store.deleteAllData();
  window.location.reload();
};

export const clearClientSession = async (mx: MatrixClient) => {
  pushSessionToSW();
  mx.stopClient();
  const stores = clientStores.get(mx);
  if (stores) await mx.clearStores({ cryptoDatabasePrefix: stores.rustCrypto });
  removeFallbackSession();
  window.location.reload();
};

export const logoutClient = async (mx: MatrixClient) => {
  mx.stopClient();
  try {
    await mx.logout();
  } catch {
    // ignore if failed to logout
  }
  await clearClientSession(mx);
};

export const clearLoginData = async () => {
  const session = getFallbackSession();
  if (session) clearNavToActivePathStore(session.userId);
  pushSessionToSW();
  removeFallbackSession();
  window.location.reload();
};
