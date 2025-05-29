"use client";

import React from "react";

interface ResponseDisplayProps {
  response: unknown | null;
}

export default function ResponseDisplay({ response }: ResponseDisplayProps) {
  if (response === null) {
    return null;
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold">Response:</h2>
      <pre className="mt-2 p-3 bg-gray-100 rounded overflow-x-auto text-gray-900">
        {typeof response === "string" ? response : JSON.stringify(response, null, 2)}
      </pre>
    </div>
  );
} 