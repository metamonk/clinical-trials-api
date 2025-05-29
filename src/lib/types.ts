// src/lib/types.ts

// Types related to ClinicalTrials.gov API Enums
export interface ClinicalTrialEnumValue {
  value: string;
  label?: string;
  description?: string;
  // The API might include other fields specific to the enum value
}

export interface ClinicalTrialEnumObject {
  type: string;                     // e.g., "OverallStatus", "StudyType"
  values: ClinicalTrialEnumValue[];  // Now an array of objects
}

// Add other shared types here as the application grows 