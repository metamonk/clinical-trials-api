"use client";

import React from "react";

export interface ErrorInfo {
  message: string;
  requestUrl?: string;
  requestParams?: string;
  details?: string;
}

interface ErrorDisplayProps {
  error: ErrorInfo | null;
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) {
    return null;
  }

  return (
    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded space-y-2">
      <div>
        <p className="font-bold">Error:</p>
        <p>{error.message}</p>
      </div>
      {error.requestUrl && (
        <div>
          <p className="font-semibold text-sm">Request URL:</p>
          <pre className="text-xs bg-red-50 p-1 rounded overflow-x-auto text-red-700">{error.requestUrl}</pre>
        </div>
      )}
      {error.requestParams && (
        <div>
          <p className="font-semibold text-sm">Request Parameters:</p>
          <pre className="text-xs bg-red-50 p-1 rounded overflow-x-auto text-red-700">{error.requestParams}</pre>
        </div>
      )}
      {error.details && (
        <div>
          <p className="font-semibold text-sm">Details:</p>
          <pre className="text-xs bg-red-50 p-1 rounded overflow-x-auto text-red-700">{error.details}</pre>
        </div>
      )}
    </div>
  );
} 