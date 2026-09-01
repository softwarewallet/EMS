import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';

export interface PlatformVersionConfig {
  version: string;
  releaseNotes?: string;
  updatedAt?: string;
  updatedBy?: string;
}

const DEFAULT_VERSION = '3.6.0';
const STORAGE_KEY = 'ryze_platform_version';
const COLLECTION_NAME = 'system_settings';
const DOC_ID = 'platform_config';

export class PlatformVersionService {
  /**
   * Fetch current platform version from Firestore database, with local cache backup
   */
  static async getVersionConfig(): Promise<PlatformVersionConfig> {
    try {
      const data = await FirebaseService.getDocument<PlatformVersionConfig>(COLLECTION_NAME, DOC_ID);
      if (data && data.version) {
        localStorage.setItem(STORAGE_KEY, data.version);
        return data;
      }
    } catch (err) {
      console.warn('Failed to fetch platform version from database, using fallback:', err);
    }

    const cachedVersion = localStorage.getItem(STORAGE_KEY) || DEFAULT_VERSION;
    return {
      version: cachedVersion,
      releaseNotes: 'System release build',
      updatedAt: new Date().toISOString(),
      updatedBy: 'Super Admin'
    };
  }

  /**
   * Update platform version in Firestore database and cache locally
   */
  static async updateVersion(
    newVersion: string, 
    releaseNotes: string = '', 
    updatedBy: string = 'Super Admin'
  ): Promise<PlatformVersionConfig> {
    const payload: PlatformVersionConfig = {
      version: newVersion.trim(),
      releaseNotes: releaseNotes.trim(),
      updatedAt: new Date().toISOString(),
      updatedBy
    };

    try {
      await FirebaseService.setDocument(COLLECTION_NAME, DOC_ID, payload);
    } catch (err) {
      console.error('Failed to save platform version to database:', err);
    }

    // Update local storage cache
    localStorage.setItem(STORAGE_KEY, payload.version);

    // Audit log
    try {
      await AuditService.logAction(
        'SUPER_ADMIN',
        'SYSTEM_VERSION_UPDATE',
        `Platform version updated to v${payload.version}. Notes: ${payload.releaseNotes || 'None'}`,
        'SUCCESS'
      );
    } catch (auditErr) {
      console.warn('Could not write version audit log:', auditErr);
    }

    return payload;
  }
}
