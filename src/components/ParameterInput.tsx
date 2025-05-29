import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ApiParameter } from "@/lib/apiConfigs";
import { Badge } from "@/components/ui/badge";

interface ParameterInputProps {
  endpointId: string;
  param: ApiParameter;
  value: any;
  options: Array<{ value: string; label: string }>;
  onInputChange: (endpointId: string, paramId: string, value: any) => void;
  onCheckboxChange: (endpointId: string, paramId: string, optionValue: string) => void;
}

export default function ParameterInput({
  endpointId,
  param,
  value,
  options,
  onInputChange,
  onCheckboxChange,
}: ParameterInputProps) {
  const inputId = `${endpointId}-${param.id}`;

  return (
    <div key={param.id} className="space-y-1.5">
      <Label htmlFor={inputId}>{param.label}</Label>
      {param.paramType === 'path' && <Badge variant="outline" className="ml-2 text-xs">Path Param</Badge>}
      
      {param.type === 'text' && (
        <Input 
          id={inputId}
          value={value || ''} // Ensure value is not null/undefined for controlled input
          onChange={(e) => onInputChange(endpointId, param.id, e.target.value)}
          placeholder={param.placeholder}
          className="text-gray-900"
        />
      )}
      {param.type === 'number' && (
        <Input 
          type="number"
          id={inputId}
          value={value || ''} // Ensure value is not null/undefined
          onChange={(e) => onInputChange(endpointId, param.id, e.target.valueAsNumber === undefined || isNaN(e.target.valueAsNumber) ? '' : e.target.valueAsNumber)}
          placeholder={param.placeholder}
          className="text-gray-900"
        />
      )}
      {param.type === 'select' && (
        <Select 
            value={String(value || '')} // Ensure value is string and not null/undefined
            onValueChange={(val) => onInputChange(endpointId, param.id, val)}
        >
          <SelectTrigger className="text-gray-900">
            <SelectValue placeholder={param.placeholder || 'Select an option'} />
          </SelectTrigger>
          <SelectContent>
            {/* Add placeholder/default option if applicable from param config or a generic one */}
            {param.placeholder && !options.find(opt => opt.value === '') && (
                 <SelectItem value="" disabled>{param.placeholder}</SelectItem>
            )}
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {param.type === 'textarea' && (
        <Textarea
          id={inputId}
          value={value || ''} // Ensure value is not null/undefined
          onChange={(e) => onInputChange(endpointId, param.id, e.target.value)}
          rows={3}
          placeholder={param.placeholder}
          className="text-gray-900"
        />
      )}
      {param.type === 'checkbox_group' && (
        <div className="mt-1 space-y-1 pt-1">
          {options.map(option => (
            <Label key={option.value} className="flex items-center space-x-2 font-normal text-sm cursor-pointer">
              <Input
                type="checkbox"
                id={`${inputId}-${option.value}`}
                name={param.id} // Group checkboxes by param.id
                value={option.value}
                checked={(Array.isArray(value) ? value : []).includes(option.value)}
                onChange={() => onCheckboxChange(endpointId, param.id, option.value)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 data-[state=checked]:bg-indigo-600"
              />
              <span>{option.label}</span>
            </Label>
          ))}
        </div>
      )}
      {param.note && <p className="mt-1 text-xs text-muted-foreground">{param.note}</p>}
    </div>
  );
} 