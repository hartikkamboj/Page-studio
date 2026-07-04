// Release Store — Factory
// Returns the appropriate implementation based on environment config.

import type { IReleaseStore } from './releaseStore';
import { fsReleaseStore } from './releaseStore.fs';
import { memoryReleaseStore } from './releaseStore.memory';

let _instance: IReleaseStore | null = null;

export function createReleaseStore(): IReleaseStore {
  if (!_instance) {
    const storeType = process.env.RELEASE_STORE || 'fs';

    switch (storeType) {
      case 'memory':
        _instance = memoryReleaseStore;
        break;
      case 'fs':
      default:
        _instance = fsReleaseStore;
        break;
    }
  }

  return _instance;
}
