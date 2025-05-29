import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ApiConfig } from "@/lib/apiConfigs";
import ParameterInput from "@/components/ParameterInput";
import { ClinicalTrialEnumObject } from "@/lib/types";
import { getOptionsForParameter } from "@/lib/utils";

interface EndpointAccordionItemProps {
  config: ApiConfig;
  formValuesForEndpoint: Record<string, string | number | string[] | boolean>;
  clinicalTrialsEnums: ClinicalTrialEnumObject[];
  loadingEnums: boolean;
  isLoading: boolean; // For the submit button
  onInputChange: (endpointId: string, paramId: string, value: string | number | string[]) => void;
  onCheckboxChange: (endpointId: string, paramId: string, optionValue: string) => void;
  onSubmit: (endpointId: string) => void;
}

export default function EndpointAccordionItem({
  config,
  formValuesForEndpoint,
  clinicalTrialsEnums,
  loadingEnums, // Pass this down if getOptionsForParameter needs it, or handle options generation before this component
  isLoading,
  onInputChange,
  onCheckboxChange,
  onSubmit,
}: EndpointAccordionItemProps) {

  return (
    <CardContent className="pt-4 space-y-4 border-t">
      {config.parameters.length > 0 ? (
        config.parameters.map(param => {
          const currentParamOptions = getOptionsForParameter(param, clinicalTrialsEnums, loadingEnums);
          const value = formValuesForEndpoint?.[param.id] ?? param.defaultValue ?? (param.type === 'checkbox_group' ? [] : '');
          
          return (
            <ParameterInput
              key={param.id}
              endpointId={config.id}
              param={param}
              value={value}
              options={currentParamOptions}
              onInputChange={onInputChange}
              onCheckboxChange={onCheckboxChange}
            />
          );
        })
      ) : (
        <p className="text-sm text-muted-foreground">No parameters for this endpoint.</p>
      )}
      <Button 
        className="w-full mt-3 pt-2" 
        onClick={() => onSubmit(config.id)} 
        disabled={isLoading || (config.id === 'single_study' && !formValuesForEndpoint?.['nctId'])} // Basic validation for single_study
      >
        {isLoading ? "Submitting..." : "Submit Request"}
      </Button>
    </CardContent>
  );
} 