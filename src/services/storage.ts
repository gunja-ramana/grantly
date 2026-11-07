import { AppState } from '../types';
import { INITIAL_STATE } from '../data/initialState';

const STORAGE_KEY = 'grantly_app_state_v1';
const CURRENT_VERSION = 1;

export class StorageService {
  /**
   * Safely loads state from localStorage with migration, schema validation and corruption fallback.
   */
  static loadState(): AppState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return this.saveState(INITIAL_STATE);
      }

      const parsed = JSON.parse(raw) as Partial<AppState>;

      // Schema and version validation
      if (!parsed || typeof parsed !== 'object' || parsed.version !== CURRENT_VERSION) {
        console.warn('Storage schema version mismatch or invalid shape; resetting to default.');
        return this.saveState(INITIAL_STATE);
      }

      // Deep validate required top-level branches
      if (
        !parsed.profile ||
        !Array.isArray(parsed.bookmarkedScholarshipIds) ||
        !Array.isArray(parsed.applications) ||
        !Array.isArray(parsed.documents) ||
        !parsed.expenses
      ) {
        console.warn('Corrupted state structure detected; restoring sensible default.');
        return this.saveState(INITIAL_STATE);
      }

      return parsed as AppState;
    } catch (err) {
      console.error('Failed to parse localStorage data; recovering safely.', err);
      return this.saveState(INITIAL_STATE);
    }
  }

  /**
   * Safely writes state to localStorage
   */
  static saveState(state: AppState): AppState {
    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (err) {
      console.error('Failed to persist state to localStorage', err);
    }
    return state;
  }

  /**
   * Resets storage completely to clean initial demo state
   */
  static resetToDemo(): AppState {
    localStorage.removeItem(STORAGE_KEY);
    return this.saveState(INITIAL_STATE);
  }

  /**
   * Clears all user bookmarks, applications, documents and resets profile to blank
   */
  static resetToBlank(): AppState {
    const blankState: AppState = {
      version: CURRENT_VERSION,
      profile: {
        fullName: '',
        email: '',
        phone: '',
        citizenship: '',
        residenceCountry: '',
        stateProvince: '',
        educationLevel: 'Undergraduate',
        fieldOfStudy: '',
        institution: '',
        gpa: 0,
        maxGpa: 4.0,
        graduationYear: new Date().getFullYear() + 2,
        annualFamilyIncome: 0,
        householdSize: 1,
        firstGenerationStudent: false,
        minorityStatus: false,
        militaryAffiliation: false,
        disabilityStatus: false,
        intendedSpecialization: '',
        targetDestinations: [],
        bioStatement: '',
        profileCompletionPercentage: 0
      },
      bookmarkedScholarshipIds: [],
      applications: [],
      documents: [],
      expenses: {
        tuition: 0,
        accommodation: 0,
        livingExpenses: 0,
        booksAndSupplies: 0,
        travelAndTransport: 0,
        otherExpenses: 0
      },
      activities: [],
      userPreferences: {
        compactView: false,
        currency: 'USD',
        showSimulatorTips: true
      }
    };
    return this.saveState(blankState);
  }

  /**
   * Returns storage diagnostics for developer & settings view
   */
  static getStorageDiagnostics(): { byteSize: number; formattedSize: string; keyCount: number; isValid: boolean } {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || '';
      const byteSize = new Blob([raw]).size;
      const formattedSize = byteSize > 1024 ? `${(byteSize / 1024).toFixed(2)} KB` : `${byteSize} Bytes`;
      return {
        byteSize,
        formattedSize,
        keyCount: localStorage.length,
        isValid: true
      };
    } catch (e) {
      return {
        byteSize: 0,
        formattedSize: '0 Bytes',
        keyCount: 0,
        isValid: false
      };
    }
  }
}
