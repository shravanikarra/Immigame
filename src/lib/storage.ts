/**
 * Storage abstraction with schema versioning
 * For future use when adding URL sync and more complex persistence
 */

import { STORAGE_KEY, loadState, saveState } from "@/app/(landing)/state";

export const storage = {
  load: loadState,
  save: saveState,
  key: STORAGE_KEY,
} as const;

// Future: URL sync will be added here in Phase 2
