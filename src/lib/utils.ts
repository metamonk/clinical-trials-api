import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ApiParameter } from "./apiConfigs";
import { ClinicalTrialEnumObject } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Retrieves display options for a given API parameter.
 * If `dynamicEnumSource` is specified in the parameter and corresponding enums are loaded,
 * it uses those dynamic enums. Otherwise, it falls back to static `options` 
 * defined in the parameter configuration.
 *
 * @param param The APIParameter configuration.
 * @param clinicalTrialsEnums Array of loaded ClinicalTrialEnumObject for dynamic options.
 * @param loadingEnums Boolean indicating if enums are still loading.
 * @returns An array of { value: string; label: string } for select/checkbox_group UI elements.
 */
export const getOptionsForParameter = (
    param: ApiParameter, 
    clinicalTrialsEnums: ClinicalTrialEnumObject[], 
    loadingEnums: boolean
  ): Array<{ value: string; label: string }> => {
    if (param.dynamicEnumSource && clinicalTrialsEnums.length > 0 && !loadingEnums) {
      const foundEnum = clinicalTrialsEnums.find(e => e.type === param.dynamicEnumSource);
      if (foundEnum && Array.isArray(foundEnum.values)) {
        return foundEnum.values.map(enumValue => ({
          value: enumValue.value,
          label: enumValue.label || enumValue.value, // Use label if available, else value
        }));
      }
    }
    return param.options || []; // Fallback to static options or empty array
  };

// Add other shared utility functions here as the application grows
