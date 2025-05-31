"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface ResponseDisplayProps {
  response: unknown | null;
}

export default function ResponseDisplay({ response }: ResponseDisplayProps) {
  const [copied, setCopied] = useState(false);

  if (response === null) {
    return null;
  }

  const responseString = typeof response === "string" ? response : JSON.stringify(response, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(responseString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error("Failed to copy text: ", err);
    });
  };

  return (
    <div className="mt-4 relative">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Response:</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-gray-500 hover:text-gray-700"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>
        </Button>
      </div>
      <pre className="mt-2 p-3 bg-gray-100 rounded overflow-x-auto text-gray-900">
        {responseString}
      </pre>
    </div>
  );
} 