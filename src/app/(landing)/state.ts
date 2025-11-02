/**
 * Onboarding state types and utilities
 */

export type Citizenship = "INDIA" | "CANADA" | "MEXICO" | "SPAIN" | "GERMANY";
export type Destination = "USA" | "CANADA" | "UK";
export type Visa = "H1B" | "F1" | "B1B2" | "NONE";

export type OnboardingState = {
  citizenship?: Citizenship;
  destination?: Destination;
  visa?: Visa;
};

export const STORAGE_KEY = "immigame.onboarding.v1";

/**
 * Load state from localStorage
 */
export function loadState(): OnboardingState {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

/**
 * Save state to localStorage
 */
export function saveState(state: OnboardingState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save state:", error);
  }
}
