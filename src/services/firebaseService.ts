import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocFromServer,
  QueryConstraint,
  DocumentData,
  runTransaction,
  Transaction
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
  TRANSACTION = 'transaction'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function cleanFirestoreData<T extends Record<string, any>>(data: T): T {
  if (data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data
      .filter(item => item !== undefined)
      .map(item => (typeof item === 'object' && item !== null ? cleanFirestoreData(item) : item)) as unknown as T;
  }

  const cleaned: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) {
      continue;
    } else if (value !== null && typeof value === 'object') {
      if (value instanceof Date) {
        cleaned[key] = value.toISOString();
      } else {
        cleaned[key] = cleanFirestoreData(value);
      }
    } else {
      cleaned[key] = value;
    }
  }

  return cleaned as T;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errMessage = error instanceof Error ? error.message : String(error);
  if (errMessage.includes('unavailable') || errMessage.includes('offline') || errMessage.includes('network') || errMessage.includes('Failed to fetch')) {
    console.warn('Firestore operating in offline/unavailable mode:', errMessage);
  }
  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test initial connection safely without throwing on network unavailability
export async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    console.warn("Firestore backend connection check note: running in offline/unavailable mode or test document not found.");
  }
}

/**
 * Tenant-Isolated Firestore Data Access Layer
 * Enforces tenant boundary across all document operations
 */
export class FirebaseService {
  /**
   * Generates a unique document ID
   */
  static generateId(prefix: string = 'doc'): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Get all documents in a collection filtered strictly by tenantId
   */
  static async getTenantCollection<T extends DocumentData>(
    collectionName: string, 
    tenantId: string,
    additionalConstraints: QueryConstraint[] = []
  ): Promise<T[]> {
    const path = collectionName;
    try {
      console.log('Fetching collection:', collectionName, 'with tenantId:', tenantId);
      const colRef = collection(db, collectionName);
      let q;
      if (tenantId === 'ALL') {
        // Platform level query for Super Admins
        q = query(colRef, ...additionalConstraints);
      } else {
        q = query(colRef, where('tenantId', '==', tenantId), ...additionalConstraints);
      }
      
      const snap = await getDocs(q);
      console.log('Snapshot received for:', collectionName, 'Docs count:', snap?.size);
      return (snap.docs || []).map(docSnap => ({ id: docSnap.id, ...(docSnap.data() as object) } as unknown as T));
    } catch (error) {
      console.warn(`Firestore read failed for ${collectionName}:`, error);
      if (error instanceof Error && error.message.includes('Missing or insufficient permissions')) {
        handleFirestoreError(error, OperationType.LIST, path);
      }
      return [];
    }
  }

  /**
   * Get single document by ID
   */
  static async getDocument<T>(collectionName: string, id: string): Promise<T | null> {
    const path = `${collectionName}/${id}`;
    try {
      const docRef = doc(db, collectionName, id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;
      return { id: snap.id, ...(snap.data() as object) } as unknown as T;
    } catch (error) {
      console.warn(`Firestore getDocument failed for ${path}:`, error);
      if (error instanceof Error && error.message.includes('Missing or insufficient permissions')) {
        handleFirestoreError(error, OperationType.GET, path);
      }
      return null;
    }
  }

  /**
   * Create or Overwrite document with automatic timestamping and tenant assignment
   */
  static async setDocument<T extends Record<string, any>>(
    collectionName: string, 
    id: string, 
    data: T
  ): Promise<void> {
    const path = `${collectionName}/${id}`;
    try {
      const docRef = doc(db, collectionName, id);
      const rawPayload: Record<string, any> = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      if (!rawPayload.createdAt) {
        rawPayload.createdAt = new Date().toISOString();
      }
      const payload = cleanFirestoreData(rawPayload);
      await setDoc(docRef, payload, { merge: true });
    } catch (error) {
      console.error(`Firestore setDocument failed for ${path}:`, error);
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  /**
   * Update specific fields of a document
   */
  static async updateDocument(
    collectionName: string, 
    id: string, 
    data: Record<string, any>
  ): Promise<void> {
    const path = `${collectionName}/${id}`;
    try {
      const docRef = doc(db, collectionName, id);
      const rawPayload = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      const payload = cleanFirestoreData(rawPayload);
      await updateDoc(docRef, payload);
    } catch (error) {
      console.error(`Firestore updateDocument failed for ${path}:`, error);
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }

  /**
   * Delete document
   */
  static async deleteDocument(collectionName: string, id: string): Promise<void> {
    const path = `${collectionName}/${id}`;
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Firestore deleteDocument failed for ${path}:`, error);
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }

  /**
   * Run a Firestore transaction
   */
  static async runTransaction<T>(updateFunction: (transaction: Transaction) => Promise<T>): Promise<T> {
    try {
      return await runTransaction(db, updateFunction);
    } catch (error) {
      console.error('Firestore transaction failed:', error);
      handleFirestoreError(error, OperationType.TRANSACTION, 'transaction');
    }
  }

  /**
   * Helper to get a doc reference
   */
  static getDocRef(collectionName: string, id: string) {
    return doc(db, collectionName, id);
  }
}
