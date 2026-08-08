import { SurveyWithQuestions } from '../models';
import surveys from './surveys.mock.json';

/**
 * Temporäre Testdaten, bis Supabase angebunden ist.
 * Der Cast ist nötig, weil TypeScript `category` aus der JSON-Datei zu
 * `string` verbreitert und nicht als `CategorySlug` erkennt.
 */
export const MOCK_SURVEYS = surveys as SurveyWithQuestions[];
