"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ImageIcon, Plus, X, UploadCloud, FileText } from "lucide-react";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

export interface FieldDefinition {
  id?: string | number;
  name: string;
  label: string;
  type: "text" | "url" | "email" | "tel" | "textarea" | "color" | "number" | "select" | "image" | "boolean" | "array" | "file";
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  className?: string;
  itemFields?: FieldDefinition[];
  addButtonLabel?: string;
  accept?: string;
}

interface QRFormBuilderProps {
  fields: FieldDefinition[];
  autoSave?: boolean;
  onAutoSave?: (data: Record<string, unknown>) => void;
}

function ArrayFieldRenderer({ field }: { field: FieldDefinition }) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: field.name,
  });

  return (
    <div className="space-y-4">
      {fields.map((item, index) => (
        <div key={item.id} className="relative border rounded-md p-4 bg-muted/20">
          <button
            type="button"
            onClick={() => remove(index)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="space-y-4 pr-6">
            {field.itemFields?.map((subField) => (
              <div key={subField.name} className="space-y-2">
                <Label>{subField.label}</Label>
                <QRFormBuilder
                  fields={[{
                    ...subField,
                    name: `${field.name}.${index}.${subField.name}`
                  }]}
                  autoSave={false}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({})}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        {field.addButtonLabel || "Add Item"}
      </Button>
    </div>
  );
}

export function QRFormBuilder({ fields, autoSave = true, onAutoSave }: QRFormBuilderProps) {
  const { register, watch, control, setValue, formState: { errors } } = useFormContext();
  const formData = watch();
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const debouncedSave = useCallback(
    debounce((data: Record<string, unknown>) => {
      if (onAutoSave) onAutoSave(data);
    }, 1000),
    [onAutoSave]
  );

  useEffect(() => {
    if (autoSave && onAutoSave) {
      debouncedSave(formData);
    }
  }, [formData, autoSave, debouncedSave]);

  const handleFileUpload = async (fieldName: string, file: File) => {
    setUploading(prev => ({ ...prev, [fieldName]: true }));
    try {
      const response: { url?: string; path?: string } = await apiClient.upload("/files", { file });
      setValue(fieldName, response.url || response.path); 
      toast.success("File uploaded successfully");
    } catch (_error: unknown) {
      toast.error("File upload failed");
    } finally {
      setUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const renderField = (field: FieldDefinition) => {
    switch (field.type) {
      case "array":
        return <ArrayFieldRenderer field={field} />;

      case "textarea":
        return (
          <textarea
            id={field.name}
            className={cn(
              "flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            )}
            placeholder={field.placeholder}
            {...register(field.name, { required: field.required })}
          />
        );

      case "select":
        return (
          <Controller
            control={control}
            name={field.name}
            rules={{ required: field.required }}
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} value={value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={field.placeholder || "Select an option"} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );

      case "boolean":
        return (
          <div className="flex items-center space-x-2 py-2">
            <Controller
              control={control}
              name={field.name}
              render={({ field: { onChange, value } }) => (
                <Switch checked={!!value} onCheckedChange={onChange} />
              )}
            />
            <Label htmlFor={field.name} className="font-normal cursor-pointer">{field.label}</Label>
          </div>
        );

      case "image":
      case "file":
        const fileValue = watch(field.name);
        const isImage = field.type === "image" || (fileValue && typeof fileValue === 'string' && fileValue.match(/\.(jpg|jpeg|png|gif|webp)$/i));
        const isUploading = uploading[field.name];

        return (
          <div className="space-y-4">
            {fileValue ? (
              <div className="relative w-full p-4 bg-gray-50 border rounded-md flex items-center justify-between group">
                {isImage ? (
                   <img src={fileValue as string} className="h-16 w-16 object-cover rounded" alt="Uploaded Image" />
                ) : (
                   <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <span className="text-sm font-medium truncate max-w-[200px]">{fileValue}</span>
                   </div>
                )}
                
                <button
                  type="button"
                  onClick={() => setValue(field.name, null)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className={cn(
                "border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-blue-400 transition-all cursor-pointer relative",
                isUploading && "opacity-50 cursor-not-allowed"
              )}>
                {isUploading ? (
                    <div className="flex flex-col items-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mb-2" />
                        <span className="text-xs">Uploading...</span>
                    </div>
                ) : (
                    <>
                        {field.type === "image" ? <ImageIcon className="h-8 w-8 mb-2" /> : <UploadCloud className="h-8 w-8 mb-2" />}
                        <span className="text-xs">Click to upload {field.label}</span>
                        <input
                        type="file"
                        className="hidden"
                        accept={field.accept || (field.type === "image" ? "image/*" : "*/*")}
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                handleFileUpload(field.name, e.target.files[0]);
                            }
                        }}
                        disabled={isUploading}
                        />
                    </>
                )}
              </label>
            )}
          </div>
        );

      default:
        return (
          <Input
            id={field.name}
            type={field.type}
            placeholder={field.placeholder}
            className="h-10"
            {...register(field.name, { required: field.required })}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <div key={field.name} className={cn("space-y-2", field.className)}>
          {field.type !== "boolean" && (
            <Label htmlFor={field.name} className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <span>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </span>
            </Label>
          )}

          {renderField(field)}

          {errors[field.name] && (
            <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">
              {errors[field.name]?.message as string || `${field.label} is required`}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}