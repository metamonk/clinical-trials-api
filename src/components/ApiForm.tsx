"use client";

import React from "react";
import { ApiConfig, ApiParameter } from "@/lib/apiConfigs"; // apiConfigs import (plural) no longer needed

interface ApiFormProps {
  formValues: Record<string, unknown>;
  setFormValues: (values: Record<string, unknown>) => void;
  handleSubmit: () => void;
  loading: boolean;
  selectedApiConfig: ApiConfig | undefined; // This is now the single config for ClinicalTrials.gov
}

export default function ApiForm({
  formValues,
  setFormValues,
  handleSubmit,
  loading,
  selectedApiConfig,
}: ApiFormProps) {

  const handleInputChange = (paramId: string, value: string | number | string[]) => {
    setFormValues({
      ...formValues,
      [paramId]: value,
    });
  };

  const handleCheckboxChange = (paramId: string, optionValue: string) => {
    const currentValues = (formValues[paramId] as string[] | undefined) || [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter(v => v !== optionValue)
      : [...currentValues, optionValue];
    handleInputChange(paramId, newValues);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  if (!selectedApiConfig) {
    // This case should ideally not be reached if HomePage handles it,
    // but as a fallback:
    return <div className="text-red-500">API configuration is missing.</div>;
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 mb-6">
      {/* API Selector removed */}
      {/* Display API description if available (moved from HomePage to here for directness) */}
      {/* 
        We could display the displayName and description here too, 
        but HomePage currently does it which is fine.
      */}

      {/* Dynamically Rendered Fields */}
      {selectedApiConfig.parameters.map((param: ApiParameter) => (
        <div key={param.id}>
          <label htmlFor={param.id} className="block text-sm font-medium text-gray-700">
            {param.label}
          </label>
          {param.type === 'text' && (
            <input
              type="text"
              id={param.id}
              value={String(formValues[param.id] || '')}
              onChange={(e) => handleInputChange(param.id, e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
              placeholder={param.placeholder}
            />
          )}
          {param.type === 'number' && (
            <input
              type="number"
              id={param.id}
              value={Number(formValues[param.id] || '')}
              onChange={(e) => handleInputChange(param.id, e.target.valueAsNumber === undefined || isNaN(e.target.valueAsNumber) ? '' : e.target.valueAsNumber)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
              placeholder={param.placeholder}
            />
          )}
          {param.type === 'select' && param.options && (
            <select
              id={param.id}
              value={String(formValues[param.id] || param.defaultValue || '')}
              onChange={(e) => handleInputChange(param.id, e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            >
              {param.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          {param.type === 'textarea' && (
            <textarea
              id={param.id}
              value={String(formValues[param.id] || '')}
              onChange={(e) => handleInputChange(param.id, e.target.value)}
              rows={3} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
              placeholder={param.placeholder}
            />
          )}
          {param.type === 'checkbox_group' && param.options && (
            <div className="mt-2 space-y-2">
              {param.options.map(option => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${param.id}-${option.value}`}
                    name={param.id}
                    value={option.value}
                    checked={((formValues[param.id] as string[] | undefined) || []).includes(option.value)}
                    onChange={() => handleCheckboxChange(param.id, option.value)}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          )}
          {param.note && <p className="mt-1 text-xs text-gray-500">{param.note}</p>}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading || !selectedApiConfig} // selectedApiConfig should always be present here now
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Request"}
      </button>
    </form>
  );
} 