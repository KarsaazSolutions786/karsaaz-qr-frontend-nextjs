"use client";

import { useState, useRef, useCallback, useEffect as _useEffect } from 'react';
import { BlockEditorProps } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  File, Upload, X, Download, Eye, EyeOff as _EyeOff, Trash2, 
  FileText, FileImage, FileVideo, FileAudio, Archive, 
  AlertCircle, CheckCircle as _CheckCircle, Loader2 as _Loader2
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface UploadedFile {
  id: number;
  name: string;
  path: string;
  mime_type: string;
  size: number;
  url: string;
  created_at: string;
}

interface FileBlockContent {
  files: UploadedFile[];
  title?: string;
  description?: string;
  showFileSize?: boolean;
  showFileType?: boolean;
  allowMultiple?: boolean;
  maxFileSize?: number;
  allowedTypes?: string[];
  downloadTracking?: boolean;
}

// File type icons mapping
const FILE_TYPE_ICONS: Record<string, React.ReactNode> = {
  'pdf': <FileText className="w-5 h-5" />,
  'doc': <FileText className="w-5 h-5" />,
  'docx': <FileText className="w-5 h-5" />,
  'txt': <FileText className="w-5 h-5" />,
  'rtf': <FileText className="w-5 h-5" />,
  'jpg': <FileImage className="w-5 h-5" />,
  'jpeg': <FileImage className="w-5 h-5" />,
  'png': <FileImage className="w-5 h-5" />,
  'gif': <FileImage className="w-5 h-5" />,
  'bmp': <FileImage className="w-5 h-5" />,
  'svg': <FileImage className="w-5 h-5" />,
  'webp': <FileImage className="w-5 h-5" />,
  'mp4': <FileVideo className="w-5 h-5" />,
  'avi': <FileVideo className="w-5 h-5" />,
  'mov': <FileVideo className="w-5 h-5" />,
  'wmv': <FileVideo className="w-5 h-5" />,
  'mp3': <FileAudio className="w-5 h-5" />,
  'wav': <FileAudio className="w-5 h-5" />,
  'flac': <FileAudio className="w-5 h-5" />,
  'aac': <FileAudio className="w-5 h-5" />,
  'zip': <Archive className="w-5 h-5" />,
  'rar': <Archive className="w-5 h-5" />,
  '7z': <Archive className="w-5 h-5" />,
  'tar': <Archive className="w-5 h-5" />,
  'gz': <Archive className="w-5 h-5" />,
};

// Default allowed file types if not specified
const DEFAULT_ALLOWED_TYPES = [
  'pdf', 'doc', 'docx', 'txt', 'rtf',
  'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp',
  'mp4', 'avi', 'mov', 'wmv',
  'mp3', 'wav', 'flac', 'aac',
  'zip', 'rar', '7z', 'tar', 'gz'
];

// Maximum file size (100MB default)
const DEFAULT_MAX_FILE_SIZE = 100 * 1024 * 1024;

// Previewable file types
const PREVIEWABLE_TYPES = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'],
  pdf: ['pdf'],
};

/**
 * File Block Component
 * Supports file upload, download, preview, and tracking
 */
export default function FileBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, { progress: number; file: File }>>(new Map());
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const { content, design } = block;
  const fileContent = content as FileBlockContent;

  // Ensure defaults
  const maxFileSize = fileContent.maxFileSize || DEFAULT_MAX_FILE_SIZE;
  const allowedTypes = fileContent.allowedTypes || DEFAULT_ALLOWED_TYPES;
  const allowMultiple = fileContent.allowMultiple !== false;

  // Get file extension from mime type or filename
  const getFileExtension = (filename: string, mimeType: string): string => {
    // Try to get extension from filename first
    const nameParts = filename.split('.');
    if (nameParts.length > 1) {
      return nameParts.pop()!.toLowerCase();
    }
    
    // Fallback to mime type
    const extension = mimeType.split('/').pop();
    return extension || 'unknown';
  };

  // Get appropriate icon for file
  const getFileIcon = (file: UploadedFile): React.ReactNode => {
    const extension = getFileExtension(file.name, file.mime_type);
    return FILE_TYPE_ICONS[extension] || <File className="w-5 h-5" />;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Check if file type is allowed
  const validateFileType = (filename: string, mimeType: string): boolean => {
    const extension = getFileExtension(filename, mimeType);
    return allowedTypes.includes(extension);
  };

  // Check if file is previewable
  const isPreviewable = (file: UploadedFile): boolean => {
    const extension = getFileExtension(file.name, file.mime_type);
    return [...PREVIEWABLE_TYPES.image, ...PREVIEWABLE_TYPES.pdf].includes(extension);
  };

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [allowedTypes, maxFileSize, handleFiles]);

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
      // Reset input
      e.target.value = '';
    }
  };

  // Validate and process files
  const handleFiles = useCallback((files: File[]) => {
    const validationErrors: string[] = [];
    const validFiles: File[] = [];

    // Check multiple files
    if (!allowMultiple && files.length > 1) {
      validationErrors.push('Only one file is allowed. Please select a single file.');
      files = [files[0]];
    }

    // Validate each file
    files.forEach((file) => {
      // Check file size
      if (file.size > maxFileSize) {
        validationErrors.push(`${file.name}: File size exceeds the maximum limit of ${formatFileSize(maxFileSize)}`);
        return;
      }

      // Check file type
      if (!validateFileType(file.name, file.type)) {
        validationErrors.push(`${file.name}: File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
        return;
      }

      validFiles.push(file);
    });

    // Show errors if any
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast.error(`Validation errors: ${validationErrors.join('. ')}`);
      return;
    }

    // Clear errors
    setErrors([]);

    // Upload valid files
    validFiles.forEach((file) => {
      uploadFile(file);
    });
  }, [allowMultiple, maxFileSize, allowedTypes]); // Dependencies for handleFiles

  // Upload file to backend
  const uploadFile = async (file: File) => {
    const uploadId = `${Date.now()}-${file.name}`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('attachable_type', 'QRCode'); // Adjust based on your model
    formData.append('attachable_id', '1'); // Adjust based on your QR code ID
    formData.append('type', 'general_use_file');

    // Add to uploading state
    setUploadingFiles(prev => new Map(prev).set(uploadId, { progress: 0, file }));

    try {
      const response = await axios.post('/api/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          
          setUploadingFiles(prev => {
            const newMap = new Map(prev);
            const uploadingFile = newMap.get(uploadId);
            if (uploadingFile) {
              newMap.set(uploadId, { ...uploadingFile, progress });
            }
            return newMap;
          });
        },
      });

      // Remove from uploading state
      setUploadingFiles(prev => {
        const newMap = new Map(prev);
        newMap.delete(uploadId);
        return newMap;
      });

      // Add to uploaded files
      const uploadedFile: UploadedFile = response.data;
      const updatedFiles = [...(fileContent.files || []), uploadedFile];
      
      onUpdate({
        content: {
          ...fileContent,
          files: updatedFiles,
        },
      });

      toast.success(`${file.name} uploaded successfully`);
    } catch (error) {
      // Remove from uploading state
      setUploadingFiles(prev => {
        const newMap = new Map(prev);
        newMap.delete(uploadId);
        return newMap;
      });

      // Show error
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : 'Upload failed';
      
      setErrors([`${file.name}: ${errorMessage}`]);
      toast.error(`${file.name}: ${errorMessage}`);
    }
  };

  // Remove file
  const removeFile = async (fileId: number) => {
    try {
      // In edit mode, we might want to delete from server
      if (isEditing) {
        await axios.delete(`/api/files/${fileId}`);
      }

      // Remove from content
      const updatedFiles = (fileContent.files || []).filter(file => file.id !== fileId);
      onUpdate({
        content: {
          ...fileContent,
          files: updatedFiles,
        },
      });

      toast.success('File removed successfully');
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : 'Failed to remove file';
      
      toast.error(errorMessage);
    }
  };

  // Handle content changes
  const handleContentChange = (field: keyof FileBlockContent, value: string | boolean | UploadedFile[]) => {
    onUpdate({
      content: {
        ...fileContent,
        [field]: value,
      },
    });
  };

  // Handle design changes
  const handleDesignChange = (field: keyof typeof design, value: string | number) => {
    onUpdate({
      design: {
        ...design,
        [field]: value,
      },
    });
  };

  // Track download
  const trackDownload = async (file: UploadedFile) => {
    try {
      if (fileContent.downloadTracking) {
        await axios.post(`/api/files/${file.id}/download-track`);
      }
    } catch (error) {
      console.error('Failed to track download:', error);
    }
  };

  // Public view (display mode)
  if (!isEditing) {
    const fileListWrapper = (
      <div
        className="block-file"
        style={{
          backgroundColor: design.backgroundColor,
          padding: design.padding,
          margin: design.margin,
          borderRadius: design.borderRadius,
        }}
      >
        {/* Title */}
        {fileContent.title && (
          <h3 style={{
            color: design.textColor,
            marginBottom: '0.5rem',
            fontSize: '1.125rem',
            fontWeight: '600',
          }}>
            {fileContent.title}
          </h3>
        )}

        {/* Description */}
        {fileContent.description && (
          <p style={{
            color: design.textColor,
            opacity: 0.8,
            marginBottom: '1rem',
            fontSize: '0.875rem',
          }}>
            {fileContent.description}
          </p>
        )}

        {/* Files List */}
        <div className="space-y-3">
          {fileContent.files && fileContent.files.length > 0 ? (
            fileContent.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                {/* File Icon */}
                <div className="flex-shrink-0 text-primary">
                  {getFileIcon(file)}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {fileContent.showFileType && (
                      <span className="uppercase">
                        {getFileExtension(file.name, file.mime_type)}
                      </span>
                    )}
                    {fileContent.showFileSize && (
                      <span>{formatFileSize(file.size)}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Preview Button */}
                  {isPreviewable(file) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewFile(file)}
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  
                  {/* Download Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      trackDownload(file);
                      window.open(file.url, '_blank', 'noopener,noreferrer');
                    }}
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <File size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No files available</p>
            </div>
          )}
        </div>
      </div>
    );

    return fileListWrapper;
  }

  // Edit view
  return (
    <div className="block-editor-file space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <File size={20} />
          <h3 className="text-lg font-semibold">File Block</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <X size={16} />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={fileContent.title || ''}
            onChange={(e) => handleContentChange('title', e.target.value)}
            placeholder="File Downloads"
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={fileContent.description || ''}
            onChange={(e) => handleContentChange('description', e.target.value)}
            placeholder="Description of the files"
            rows={3}
          />
        </div>

        {/* Upload Area */}
        <div>
          <Label>Upload Files</Label>
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-1">
              Drag & drop files here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Max size: {formatFileSize(maxFileSize)}
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple={allowMultiple}
              onChange={handleFileInputChange}
              accept={allowedTypes.map(type => `.${type}`).join(',')}
            />
          </div>

          {/* Upload Progress */}
          {uploadingFiles.size > 0 && (
            <div className="mt-4 space-y-2">
              <Label>Uploading...</Label>
              {Array.from(uploadingFiles.entries()).map(([uploadId, { progress, file }]) => (
                <div key={uploadId} className="flex items-center gap-3">
                  <File className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="truncate">{file.name}</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive mb-1">Upload Errors:</p>
                  <ul className="text-sm text-destructive/80 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="mt-1">•</span>
                        <span className="flex-1">{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* File List */}
        {fileContent.files && fileContent.files.length > 0 && (
          <div>
            <Label>Uploaded Files</Label>
            <div className="mt-2 space-y-2">
              {fileContent.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 bg-background rounded-lg border"
                >
                  {/* File Icon */}
                  <div className="flex-shrink-0 text-primary">
                    {getFileIcon(file)}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="uppercase">
                        {getFileExtension(file.name, file.mime_type)}
                      </span>
                      <span>{formatFileSize(file.size)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Preview Button */}
                    {isPreviewable(file) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewFile(file)}
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      title="Remove"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="border-t pt-4 space-y-4">
          <h4 className="text-sm font-semibold">Settings</h4>
          
          {/* Multiple Files */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allowMultiple">Allow Multiple Files</Label>
              <p className="text-xs text-muted-foreground">
                Allow users to upload multiple files
              </p>
            </div>
            <Switch
              id="allowMultiple"
              checked={fileContent.allowMultiple !== false}
              onCheckedChange={(checked) => handleContentChange('allowMultiple', checked)}
            />
          </div>

          {/* Show File Size */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="showFileSize">Show File Size</Label>
              <p className="text-xs text-muted-foreground">
                Display file size in public view
              </p>
            </div>
            <Switch
              id="showFileSize"
              checked={fileContent.showFileSize !== false}
              onCheckedChange={(checked) => handleContentChange('showFileSize', checked)}
            />
          </div>

          {/* Show File Type */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="showFileType">Show File Type</Label>
              <p className="text-xs text-muted-foreground">
                Display file extension in public view
              </p>
            </div>
            <Switch
              id="showFileType"
              checked={fileContent.showFileType !== false}
              onCheckedChange={(checked) => handleContentChange('showFileType', checked)}
            />
          </div>

          {/* Download Tracking */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="downloadTracking">Track Downloads</Label>
              <p className="text-xs text-muted-foreground">
                Track when files are downloaded
              </p>
            </div>
            <Switch
              id="downloadTracking"
              checked={fileContent.downloadTracking !== false}
              onCheckedChange={(checked) => handleContentChange('downloadTracking', checked)}
            />
          </div>
        </div>

        {/* Design Settings */}
        <div className="border-t pt-4 space-y-4">
          <h4 className="text-sm font-semibold">Design</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="design-padding">Padding</Label>
              <Input
                id="design-padding"
                value={design.padding || ''}
                onChange={(e) => handleDesignChange('padding', e.target.value)}
                placeholder="1rem"
              />
            </div>
            <div>
              <Label htmlFor="design-margin">Margin</Label>
              <Input
                id="design-margin"
                value={design.margin || ''}
                onChange={(e) => handleDesignChange('margin', e.target.value)}
                placeholder="0.5rem"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="design-bg-color">Background Color</Label>
              <Input
                id="design-bg-color"
                type="color"
                value={design.backgroundColor || '#ffffff'}
                onChange={(e) => handleDesignChange('backgroundColor', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="design-text-color">Text Color</Label>
              <Input
                id="design-text-color"
                type="color"
                value={design.textColor || '#000000'}
                onChange={(e) => handleDesignChange('textColor', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
              <h3 className="font-semibold truncate">{previewFile.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewFile(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-4">
              {PREVIEWABLE_TYPES.image.includes(getFileExtension(previewFile.name, previewFile.mime_type)) ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="max-w-full h-auto mx-auto rounded"
                />
              ) : PREVIEWABLE_TYPES.pdf.includes(getFileExtension(previewFile.name, previewFile.mime_type)) ? (
                <iframe
                  src={previewFile.url}
                  className="w-full h-[600px] border-0 rounded"
                  title={previewFile.name}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}