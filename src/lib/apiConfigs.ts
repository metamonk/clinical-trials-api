export interface ApiParameter {
  id: string; // For query params: full key (e.g., 'filter.overallStatus'). For path params: placeholder name (e.g., 'nctId')
  label: string; 
  paramType: 'path' | 'query'; // Specifies if it's a path variable or a query parameter
  type: 'text' | 'select' | 'number' | 'textarea' | 'checkbox_group'; // UI input type
  options?: Array<{ value: string; label:string }>; 
  dynamicEnumSource?: string; 
  defaultValue?: string | number | string[]; 
  placeholder?: string;
  note?: string; 
}

export interface ApiConfig {
  id: string; // Unique ID for this endpoint config (e.g., 'studies_search', 'single_study')
  displayName: string; // User-friendly name for the accordion trigger
  baseApiUrl: string; // Base part of the API, e.g., https://clinicaltrials.gov
  endpointPath: string; // Path for the specific endpoint, e.g., /api/v2/studies, /api/v2/studies/{nctId}
  method: 'GET'; // Assuming GET for all these for now
  parameters: ApiParameter[];
  defaultFields?: string; // For endpoints that support a 'fields' parameter
  description?: string; 
}

export const clinicalTrialsApiBaseUrl = 'https://clinicaltrials.gov';

export const apiEndpointConfigurations: ApiConfig[] = [
  {
    id: 'search_studies',
    displayName: 'Search Studies (/studies)',
    baseApiUrl: clinicalTrialsApiBaseUrl,
    endpointPath: '/api/v2/studies',
    method: 'GET',
    description: 'Search for and retrieve multiple study records.',
    defaultFields: 'NCTId,BriefTitle,OverallStatus,Condition,InterventionName,StudyType,Phase,EnrollmentCount,LocationFacility,LastUpdatePostDate,DocumentSection',
    parameters: [
      { 
        id: 'query.term', 
        label: 'Search Term (Keywords)', 
        paramType: 'query', 
        type: 'text', 
        placeholder: 'e.g., cancer, heart disease',
        defaultValue: ''
      },
      {
        id: 'filter.advanced',
        label: 'Advanced Filter (AREA syntax)',
        paramType: 'query',
        type: 'textarea',
        placeholder: 'e.g., AREA[Phase]PHASE1 AND AREA[MinimumAge]RANGE[MIN, 18 years]',
        note: 'Use Essie expression syntax. Phase and Study Type selections will be added here automatically.'
      },
      { 
        id: 'filter.overallStatus', 
        label: 'Overall Status', 
        paramType: 'query',
        type: 'checkbox_group',
        options: [
          { value: 'ACTIVE_NOT_RECRUITING', label: 'Active, not recruiting' },
          { value: 'APPROVED_FOR_MARKETING', label: 'Approved for marketing' },
          { value: 'AVAILABLE', label: 'Available' },
          { value: 'COMPLETED', label: 'Completed' },
          { value: 'ENROLLING_BY_INVITATION', label: 'Enrolling by invitation' },
          { value: 'NOT_YET_RECRUITING', label: 'Not yet recruiting' },
          { value: 'NO_LONGER_AVAILABLE', label: 'No longer available' },
          { value: 'RECRUITING', label: 'Recruiting' },
          { value: 'SUSPENDED', label: 'Suspended' },
          { value: 'TEMPORARILY_NOT_AVAILABLE', label: 'Temporarily not available' },
          { value: 'TERMINATED', label: 'Terminated' },
          { value: 'WITHDRAWN', label: 'Withdrawn' },
          { value: 'WITHHELD', label: 'Withheld' },
          { value: 'UNKNOWN', label: 'Unknown status' },
        ],
        defaultValue: [],
      },
      {
        id: 'studyTypeForAdvancedFilter',
        label: 'Study Type',
        paramType: 'query',
        type: 'select',
        dynamicEnumSource: 'StudyType',
        defaultValue: '',
        note: 'Selected Study Type will be added to the Advanced Filter.'
      },
      {
        id: 'studyPhase',
        label: 'Study Phase(s)',
        paramType: 'query',
        type: 'checkbox_group',
        dynamicEnumSource: 'Phase',
        defaultValue: [],
        note: 'Select one or more study phases. These will be added to the Advanced Filter.'
      },
      {
        id: 'filter.nctId',
        label: 'Filter by NCT ID',
        paramType: 'query',
        type: 'text',
        placeholder: 'e.g., NCT00001234 (for filtering, not single lookup)'
      },
      {
        id: 'fields',
        label: 'Fields to Return',
        paramType: 'query',
        type: 'textarea',
        placeholder: 'e.g., NCTId,BriefTitle,OverallStatus',
        note: 'Comma-separated. Leave blank for default fields.'
      },
      {
        id: 'pageSize',
        label: 'Results Per Page',
        paramType: 'query',
        type: 'number',
        defaultValue: 10,
        placeholder: '1-1000'
      },
    ],
  },
  {
    id: 'single_study',
    displayName: 'Single Study by NCT ID (/studies/{nctId})',
    baseApiUrl: clinicalTrialsApiBaseUrl,
    endpointPath: '/api/v2/studies/{nctId}', // Path placeholder
    method: 'GET',
    description: 'Retrieve a single study record by its NCT ID.',
    defaultFields: 'NCTId,BriefTitle,OverallStatus,Condition,InterventionName,StudyType,Phase,EnrollmentCount,LocationFacility,LastUpdatePostDate,DocumentSection', // Fields can also be requested for single study
    parameters: [
      {
        id: 'nctId', // This is the placeholder name in endpointPath
        label: 'NCT ID',
        paramType: 'path', // Identifies this as a path parameter
        type: 'text',
        placeholder: 'e.g., NCT00001234',
        defaultValue: '' 
      },
      { 
        id: 'fields', // fields can also be a query param here
        label: 'Fields to Return',
        paramType: 'query',
        type: 'textarea', 
        placeholder: 'e.g., NCTId,BriefTitle,OverallStatus',
        note: 'Comma-separated. Leave blank for default fields.'
      },
    ],
  },
  {
    id: 'metadata',
    displayName: 'Data Model Fields (/studies/metadata)',
    baseApiUrl: clinicalTrialsApiBaseUrl,
    endpointPath: '/api/v2/studies/metadata',
    method: 'GET',
    description: 'Returns the schema for study data fields.',
    parameters: [], // No parameters for this endpoint
  },
  {
    id: 'search_areas',
    displayName: 'Search Areas (/studies/search-areas)',
    baseApiUrl: clinicalTrialsApiBaseUrl,
    endpointPath: '/api/v2/studies/search-areas',
    method: 'GET',
    description: 'Returns a list of study fields that can be used in search expressions.',
    parameters: [],
  },
  {
    id: 'enums',
    displayName: 'Enums (/studies/enums)',
    baseApiUrl: clinicalTrialsApiBaseUrl,
    endpointPath: '/api/v2/studies/enums',
    method: 'GET',
    description: 'Returns enumerated values for various study fields.',
    parameters: [], 
  },
]; 