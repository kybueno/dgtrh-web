/**
 * Education levels aligned with Cuban education system
 * and ISCED (CINE) international standard.
 */

/* ==============================
   DB / API CODES (PERSISTED)
================================ */
export enum EducationLevelCode {
  BASIC = 'BAS',        // Primaria + Secundaria Básica
  TECHNIC = 'TEC',     // Técnico Medio
  MEDIUM = 'MED',      // Preuniversitario / Media Superior
  SUPERIOR = 'SUP'     // Universidad y Posgrado
}

/* ==============================
   ISCED / CINE LEVELS
================================ */
export enum IscedLevel {
  CINE_0 = 0,
  CINE_1 = 1,
  CINE_2 = 2,
  CINE_3 = 3,
  CINE_4 = 4,
  CINE_6 = 6,
  CINE_7 = 7,
  CINE_8 = 8
}

/* ==============================
   DOMAIN MODEL
================================ */
export interface EducationLevel {
  code: EducationLevelCode;
  label: string;
  description: string;
  order: number; // allows comparisons & sorting
  isced: IscedLevel | IscedLevel[];
}

/* ==============================
   SINGLE SOURCE OF TRUTH
================================ */
export const EDUCATION_LEVELS = [
  {
    code: EducationLevelCode.BASIC,
    label: 'Básico',
    description: 'Educación primaria y secundaria básica',
    order: 1,
    isced: [IscedLevel.CINE_1, IscedLevel.CINE_2]
  },
  {
    code: EducationLevelCode.TECHNIC,
    label: 'Técnico Medio',
    description: 'Formación técnica profesional',
    order: 2,
    isced: [IscedLevel.CINE_3, IscedLevel.CINE_4]
  },
  {
    code: EducationLevelCode.MEDIUM,
    label: 'Medio Superior',
    description: 'Preuniversitario',
    order: 3,
    isced: IscedLevel.CINE_3
  },
  {
    code: EducationLevelCode.SUPERIOR,
    label: 'Superior',
    description: 'Educación universitaria y posgrado',
    order: 4,
    isced: [
      IscedLevel.CINE_6,
      IscedLevel.CINE_7,
      IscedLevel.CINE_8
    ]
  }
] as const satisfies readonly EducationLevel[];

/* ==============================
   DERIVED TYPES (AUTO-SYNCED)
================================ */
export type EducationLevelValue =
  typeof EDUCATION_LEVELS[number]['code'];

/* ==============================
   FORM SELECT OPTIONS
================================ */
export interface EducationLevelOption {
  value: EducationLevelValue;
  label: string;
}

export const EDUCATION_LEVEL_OPTIONS: EducationLevelOption[] =
  EDUCATION_LEVELS.map(level => ({
    value: level.code,
    label: level.label
  }));

/* ==============================
   HELPERS
================================ */
export function getEducationLevelByCode(
  code: EducationLevelValue
): EducationLevel | undefined {
  return EDUCATION_LEVELS.find(l => l.code === code);
}

export function getEducationLevelLabel(
  code: EducationLevelValue
): string {
  return getEducationLevelByCode(code)?.label ?? '';
}

export function compareEducationLevels(
  a: EducationLevelValue,
  b: EducationLevelValue
): number {
  const levelA = getEducationLevelByCode(a);
  const levelB = getEducationLevelByCode(b);
  return (levelA?.order ?? 0) - (levelB?.order ?? 0);
}
