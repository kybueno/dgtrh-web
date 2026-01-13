/**
 * Gender options for worker records.
 *
 * Notes:
 * - Uses standard single-character codes for database storage.
 * - Labels are in Spanish for the Cuban HR system.
 */

/* ==============================
   DB / API CODES (PERSISTED)
================================ */
export enum GenderCode {
  MALE = 'M',        // Masculino
  FEMALE = 'F',      // Femenino
  OTHER = 'O'        // Otro
}

/* ==============================
   DOMAIN MODEL
================================ */
export interface Gender {
  code: GenderCode;
  label: string;
}

/* ==============================
   SINGLE SOURCE OF TRUTH
================================ */
export const GENDERS = [
  {
    code: GenderCode.MALE,
    label: 'Masculino'
  },
  {
    code: GenderCode.FEMALE,
    label: 'Femenino'
  },
  {
    code: GenderCode.OTHER,
    label: 'Otro'
  }
] as const satisfies readonly Gender[];

/* ==============================
   DERIVED TYPES
================================ */
export type GenderValue =
  typeof GENDERS[number]['code'];

/* ==============================
   FORM OPTIONS
================================ */
export interface GenderOption {
  value: GenderValue;
  label: string;
}

export const GENDER_OPTIONS: GenderOption[] =
  GENDERS.map(gender => ({
    value: gender.code,
    label: gender.label
  }));

/* ==============================
   HELPERS
================================ */
export function getGenderByCode(
  code: GenderValue
): Gender | undefined {
  return GENDERS.find(g => g.code === code);
}

export function getGenderLabel(
  code: GenderValue
): string {
  return getGenderByCode(code)?.label ?? '';
}

