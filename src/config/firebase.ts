import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  initializeFirestore, 
  getFirestore, 
  Firestore, 
  memoryLocalCache,
  persistentLocalCache,
  persistentMultipleTabManager 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize App safely
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Initialize Firestore with explicit database ID and memory local cache for reliability in sandboxed iframe previews
const dbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

let dbInstance: Firestore;
try {
  // Always prefer memoryLocalCache in dev/iframe preview to prevent IndexedDB multi-tab lock errors on hot reload
  dbInstance = initializeFirestore(app, {
    localCache: memoryLocalCache({}),
    experimentalForceLongPolling: true,
    experimentalAutoDetectLongPolling: true,
  }, dbId);
} catch (error) {
  // If already initialized on this app instance, retrieve existing instance
  dbInstance = getFirestore(app, dbId);
}

export const db = dbInstance;
export { firebaseConfig };


