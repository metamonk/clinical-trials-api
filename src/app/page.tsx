"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import axios, { AxiosError } from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import ResponseDisplay from "@/components/ResponseDisplay";
import ErrorDisplay, { ErrorInfo } from "@/components/ErrorDisplay";
import { apiEndpointConfigurations, ApiConfig, clinicalTrialsApiBaseUrl } from "@/lib/apiConfigs";
import EndpointAccordionItem from "@/components/EndpointAccordionItem";
import { ClinicalTrialEnumObject } from "@/lib/types";

export default function ApiTesterPage() {
  // Overall page state
  const [selectedEndpointId, setSelectedEndpointId] = useState<string | null>(
    apiEndpointConfigurations.length > 0 ? apiEndpointConfigurations[0].id : null
  );
  const [formValues, setFormValues] = useState<Record<string, Record<string, string | number | string[] | boolean>>>({}); // { endpointId: { paramId: value } }
  
  const [currentResponse, setCurrentResponse] = useState<unknown | null>(null);
  const [currentError, setCurrentError] = useState<ErrorInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState<number | null>(null);

  // State for globally fetched enums (needed for dynamic selects in forms)
  const [clinicalTrialsEnums, setClinicalTrialsEnums] = useState<ClinicalTrialEnumObject[]>([]);
  const [loadingEnums, setLoadingEnums] = useState(true);
  const [errorEnums, setErrorEnums] = useState<Error | null>(null);

  // Initialize formValues for all endpoints on mount or when configs change
  const initializeFormValues = useCallback((configs: ApiConfig[]) => {
    const initialValues: Record<string, Record<string, string | number | string[] | boolean>> = {};
    configs.forEach(endpoint => {
      initialValues[endpoint.id] = {};
      endpoint.parameters.forEach(param => {
        initialValues[endpoint.id][param.id] = param.defaultValue !== undefined ? param.defaultValue : param.type === 'checkbox_group' ? [] : '';
        if (param.id === 'fields' && endpoint.defaultFields) {
          initialValues[endpoint.id][param.id] = endpoint.defaultFields;
        }
        // Ensure filter.advanced is initialized for search_studies
        if (endpoint.id === 'search_studies' && param.id === 'filter.advanced') {
          initialValues[endpoint.id][param.id] = '';
        }
      });
    });
    setFormValues(initialValues);
  }, []);

  useEffect(() => {
    initializeFormValues(apiEndpointConfigurations);
  }, [initializeFormValues]);

  // Fetch enums once on mount for dynamic form population
  useEffect(() => {
    const fetchEnums = async () => {
      setLoadingEnums(true);
      try {
        const response = await axios.get<{enums: ClinicalTrialEnumObject[]} | ClinicalTrialEnumObject[]>(`${clinicalTrialsApiBaseUrl}/api/v2/studies/enums`);
        // The API returns an object with a single key "enums" which is an array.
        // We should extract this array.
        if (response.data && typeof response.data === 'object' && 'enums' in response.data && Array.isArray(response.data.enums)) {
          setClinicalTrialsEnums(response.data.enums);
        } else if (Array.isArray(response.data)) { // Fallback if data is directly an array
            setClinicalTrialsEnums(response.data);
        } else {
          console.error("Unexpected enums data format:", response.data);
          setClinicalTrialsEnums([]); 
        }
        setErrorEnums(null);
      } catch (error) {
        console.error("Error fetching enums:", error);
        if (error instanceof Error) {
            setErrorEnums(error);
        } else {
            setErrorEnums(new Error(String(error)));
        }
        setClinicalTrialsEnums([]);
      } finally {
        setLoadingEnums(false);
      }
    };
    fetchEnums();
  }, []);

  const handleInputChange = (endpointId: string, paramId: string, value: string | number | string[]) => {
    setFormValues(prev => ({
      ...prev,
      [endpointId]: {
        ...prev[endpointId],
        [paramId]: value,
      },
    }));
  };

  const handleCheckboxChange = (endpointId: string, paramId: string, optionValue: string) => {
    setFormValues(prev => {
      const currentValues = prev[endpointId]?.[paramId] as string[] || [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      return {
        ...prev,
        [endpointId]: {
          ...prev[endpointId],
          [paramId]: newValues,
        },
      };
    });
  };

  const handleSubmitRequest = async (endpointId: string) => {
    const endpointConfig = apiEndpointConfigurations.find(config => config.id === endpointId);
    if (!endpointConfig) {
      setCurrentError({ message: "Endpoint configuration not found." });
      return;
    }

    setIsLoading(true);
    setCurrentResponse(null);
    setCurrentError(null);
    setTotalResults(null);

    let url = `${endpointConfig.baseApiUrl}${endpointConfig.endpointPath}`;
    const queryParams: Record<string, string> = {};
    const currentEndpointFormValues: Record<string, string | number | string[] | boolean> = formValues[endpointId] || {};

    // Path parameter substitution
    endpointConfig.parameters.filter(p => p.paramType === 'path').forEach(pathParam => {
      const value = currentEndpointFormValues[pathParam.id];
      if (value === undefined || value === '') {
        setCurrentError({ message: `Error: Path parameter ${pathParam.label} is required.` });
        setIsLoading(false);
        // Early return if a required path param is missing.
        // Consider making this more robust if not all path params are strictly required by API
        throw new Error("Missing path parameter"); 
      }
      url = url.replace(`{${pathParam.id}}`, encodeURIComponent(String(value)));
    });

    // Construct query parameters
    endpointConfig.parameters.filter(p => p.paramType === 'query' && p.id !== 'studyPhase').forEach(param => {
      const value = currentEndpointFormValues[param.id];
      if (value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) queryParams[param.id] = value.join(',');
        } else {
          queryParams[param.id] = String(value);
        }
      }
    });
    
    // Special handling for studyPhase to build filter.advanced
    if (endpointId === 'search_studies') {
      const selectedPhases = currentEndpointFormValues['studyPhase'] as string[] || [];
      let phaseFilterString = '';
      if (selectedPhases.length > 0) {
        if (selectedPhases.length === 1) {
          phaseFilterString = `AREA[Phase]${selectedPhases[0]}`;
        } else {
          phaseFilterString = `AREA[Phase](${selectedPhases.join(' AND ')})`;
        }
      }

      let existingAdvancedFilter = queryParams['filter.advanced'] || '';
      
      if (phaseFilterString) {
        if (existingAdvancedFilter) {
          existingAdvancedFilter += ` AND ${phaseFilterString}`;
        } else {
          existingAdvancedFilter = phaseFilterString;
        }
      }
      
      if (existingAdvancedFilter) {
        queryParams['filter.advanced'] = existingAdvancedFilter;
      } else {
        delete queryParams['filter.advanced']; // Remove if empty
      }
    }

    // Add countTotal=true for /studies endpoint, or if defaultFields includes totalCount implicitly
    if (endpointConfig.id === 'search_studies' || endpointConfig.defaultFields?.includes('totalCount')) {
        queryParams['countTotal'] = 'true';
    }

    try {
      console.log("Request URL:", url);
      console.log("Request Params:", queryParams);
      const res = await axios.get<{ totalCount?: number; [key: string]: unknown }>(url, { params: queryParams });
      setCurrentResponse(res.data);
      if (res.data && res.data.totalCount !== undefined) {
        setTotalResults(res.data.totalCount);
      } else {
        // Attempt to get totalCount from CSV header if that's ever implemented
        const csvTotalCount = res.headers?.['x-total-count'];
        if (csvTotalCount) setTotalResults(parseInt(csvTotalCount, 10));
      }
    } catch (err) {
      const errorInfo: ErrorInfo = { message: "An error occurred." };
      const qString = Object.keys(queryParams).length ? '?' + new URLSearchParams(queryParams).toString() : '';
      errorInfo.requestUrl = url + qString;
      errorInfo.requestParams = JSON.stringify(queryParams, null, 2);

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<unknown>;
        errorInfo.message = axiosError.message;
        if (axiosError.response) {
          errorInfo.message = `Request failed with status ${axiosError.response.status}: ${axiosError.response.statusText}`;
          errorInfo.details = typeof axiosError.response.data === 'string' ? axiosError.response.data : JSON.stringify(axiosError.response.data, null, 2);
        }
      }
      setCurrentError(errorInfo);
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingEnums) {
    return <div className="p-4">Loading API enumerations...</div>;
  }
  if (errorEnums) {
    return <div className="p-4 text-red-600">Error loading API enumerations: {errorEnums.message}</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-full space-y-6"> {/* Full width */} 
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">ClinicalTrials.gov API Tester</h1>
        <p className="text-muted-foreground">Explore ClinicalTrials.gov API endpoints.</p>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-6">
        {/* Left Accordion Column */}
        <div className="w-full md:w-1/3 lg:w-2/5 xl:w-1/3 md:flex-shrink-0 mb-6 md:mb-0 space-y-4">
          {apiEndpointConfigurations.map((config) => {
            const currentFormValues: Record<string, string | number | string[] | boolean> = formValues[config.id] || {};
            return (
              <Collapsible key={config.id} open={selectedEndpointId === config.id} onOpenChange={(isOpen) => {
                if (isOpen) {
                  setSelectedEndpointId(config.id);
                  // Reset response/error when switching
                  setCurrentResponse(null);
                  setCurrentError(null);
                  setTotalResults(null);
                } else if (selectedEndpointId === config.id) {
                  // Allow collapsing the currently open one
                  //setSelectedEndpointId(null); // Or keep it selected but collapsed
                }
              }}>
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{config.displayName}</CardTitle>
                        {selectedEndpointId === config.id ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                      </div>
                      {config.description && <CardDescription className="text-sm mt-1">{config.description}</CardDescription>}
                    </CardHeader>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <EndpointAccordionItem
                    config={config}
                    formValuesForEndpoint={currentFormValues}
                    clinicalTrialsEnums={clinicalTrialsEnums}
                    loadingEnums={loadingEnums}
                    isLoading={isLoading}
                    onInputChange={handleInputChange}
                    onCheckboxChange={handleCheckboxChange}
                    onSubmit={handleSubmitRequest}
                  />
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        {/* Right Response Column */}
        <div className="w-full md:w-2/3 lg:w-3/5 xl:w-2/3 md:flex-grow">
          <Card className="h-full min-h-[600px]"> {/* Make card take full height of its column part if possible */} 
            <CardHeader>
              <CardTitle>API Response</CardTitle>
              <CardDescription>
                {totalResults !== null && (
                  <p className="text-sm text-gray-700 mb-2">
                    Total Results Found: <span className="font-semibold">{totalResults}</span>
                  </p>
                )}
                Results or errors from the last API request.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 h-full">
              {isLoading && <p className="text-center py-10">Loading response...</p>}
              {!isLoading && !currentResponse && !currentError && <p className="text-center py-10 text-muted-foreground">Submit a request to see the response here.</p>}
              <ErrorDisplay error={currentError} />
              <ResponseDisplay response={currentResponse} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}