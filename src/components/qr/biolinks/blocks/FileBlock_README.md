# File Block Component

A comprehensive file management block for QR code biolinks with upload, download, preview, and tracking capabilities.

## Features

### Core Functionality
- ✅ **File Upload**: Drag & drop or browse files
- ✅ **File Metadata**: Display name, size, and type
- ✅ **Upload Progress**: Real-time progress tracking
- ✅ **File Preview**: Support for images and PDFs
- ✅ **Download Tracking**: Monitor file downloads
- ✅ **Size Limits**: Configurable file size restrictions
- ✅ **Type Validation**: Whitelist allowed file extensions
- ✅ **Dual View Modes**: Edit and public views
- ✅ **Secure Handling**: Secure file storage and access
- ✅ **Multiple Files**: Support for single or multiple file uploads

### Supported File Types

**Documents**: PDF, DOC, DOCX, TXT, RTF
**Images**: JPG, JPEG, PNG, GIF, BMP, SVG, WebP
**Videos**: MP4, AVI, MOV, WMV
**Audio**: MP3, WAV, FLAC, AAC
**Archives**: ZIP, RAR, 7Z, TAR, GZ

### Preview Support
- **Images**: JPG, JPEG, PNG, GIF, BMP, SVG, WebP (full image preview)
- **PDFs**: Full PDF viewer with iframe

## Usage

### Edit Mode (For Content Creators)

In edit mode, users can:

1. **Upload Files**
   - Drag & drop files onto the upload area
   - Click to browse and select files
   - Supports multiple file selection (configurable)
   - Real-time upload progress indicator

2. **Configure Settings**
   - **Title**: Add a heading for the file block
   - **Description**: Provide context about the files
   - **Allow Multiple**: Allow single or multiple files
   - **Show File Size**: Toggle file size display
   - **Show File Type**: Toggle file extension display
   - **Track Downloads**: Enable download analytics

3. **Design Customization**
   - **Padding**: Control internal spacing
   - **Margin**: Control external spacing
   - **Background Color**: Customize block background
   - **Text Color**: Customize text color
   - **Border Radius**: Adjust corner rounding

4. **File Management**
   - View uploaded files with metadata
   - Preview supported file types
   - Remove unwanted files
   - See upload errors and validation messages

### Public View (For End Users)

In public view, visitors can:

1. **Browse Files**
   - View file list with icons
   - See file names, sizes, and types
   - Clean, responsive layout

2. **Download Files**
   - Click download button for any file
   - Downloads are tracked if enabled
   - Direct, secure file access

3. **Preview Files**
   - Click preview button for supported files
   - Image preview with modal viewer
   - PDF preview with embedded viewer

## Configuration

### Default Settings

```typescript
const defaultData = {
  files: [],
  title: '',
  description: '',
  showFileSize: true,
  showFileType: true,
  allowMultiple: true,
  downloadTracking: true
};
```

### File Type Icons

The component automatically assigns icons based on file extensions:
- 📄 Documents: FileText icon
- 🖼️ Images: FileImage icon
- 🎬 Videos: FileVideo icon
- 🎵 Audio: FileAudio icon
- 📦 Archives: Archive icon
- 📎 Unknown: File icon

### Size Limits

- **Default Maximum**: 100MB per file
- **Configurable**: Set custom size limits in block settings
- **User Feedback**: Clear error messages for oversized files

### Security Features

1. **File Type Validation**
   - Whitelist-based approach
   - Only allows specified file extensions
   - Clear error messages for invalid types

2. **Secure Storage**
   - Files stored in controlled directory
   - Sanitized file names
   - No executable files allowed

3. **Access Control**
   - Files only accessible via generated URLs
   - Backend validates file access
   - Optional authentication requirements

## API Integration

### Endpoints Used

1. **File Upload**
   ```
   POST /api/files
   - Form data with file
   - Returns file metadata
   ```

2. **File Delete**
   ```
   DELETE /api/files/{fileId}
   - Removes file from storage
   - Updates block content
   ```

3. **Download Tracking**
   ```
   POST /api/files/{fileId}/download-track
   - Records download event
   - Optional analytics integration
   ```

### Response Format

```typescript
interface UploadedFile {
  id: number;
  name: string;
  path: string;
  mime_type: string;
  size: number;
  url: string;
  created_at: string;
}
```

## Technical Implementation

### Component Structure

```
FileBlock.tsx
├── Edit Mode
│   ├── File Upload Area (drag & drop)
│   ├── Upload Progress Tracking
│   ├── File List Management
│   └── Settings Panel
└── Public Mode
    ├── File List Display
    ├── Preview Modal
    └── Download Actions
```

### State Management

- **uploadingFiles**: Map of files currently uploading
- **previewFile**: Currently previewed file
- **errors**: Validation and upload error messages

### Key Functions

- `validateFileType()`: Checks if file extension is allowed
- `formatFileSize()`: Converts bytes to human-readable format
- `uploadFile()`: Handles file upload with progress tracking
- `isPreviewable()`: Determines if file can be previewed
- `trackDownload()`: Records download analytics

## Styling

The component uses Tailwind CSS classes and supports:
- Dark mode compatibility
- Responsive design
- Custom color schemes via design prop
- Consistent spacing and typography

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Performance Considerations

- Lazy loading for file previews
- Optimized re-renders with React hooks
- Progress tracking without blocking UI
- Efficient file validation

## Accessibility

- Keyboard navigation support
- Screen reader compatible
- Focus management for modal
- ARIA labels for interactive elements
- Color contrast compliant

## Error Handling

- File size exceeded
- Invalid file type
- Network upload failures
- Server validation errors
- Graceful degradation

## Future Enhancements

Potential improvements:
- [ ] Folder organization
- [ ] Batch operations
- [ ] Advanced search/filter
- [ ] Version control
- [ ] Cloud storage integration
- [ ] Advanced preview (office docs)
- [ ] Download limits/expiry
- [ ] File encryption
- [ ] Bulk upload progress
- [ ] Upload resumption

## Dependencies

- React Dropzone (for drag & drop)
- Lucide React Icons
- Axios (for file uploads)
- Tailwind CSS
- Sonner (for toast notifications)

## Backend Requirements

1. **File Storage**: Configured storage driver (local/S3)
2. **API Routes**: File upload/download endpoints
3. **Validation**: File type and size validation
4. **Security**: CSRF protection, authentication
5. **Database**: File metadata storage

## Example Usage

```typescript
import FileBlock from './blocks/FileBlock';

// In your editor
<FileBlock
  block={block}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
  isEditing={true}
/>

// Public view
<FileBlock
  block={block}
  isEditing={false}
/>
```

## Block Configuration

```typescript
{
  type: 'file',
  name: 'File Downloads',
  description: 'Share files with your audience',
  icon: File,
  category: 'media',
  defaultData: {
    files: [],
    title: 'Download Resources',
    description: 'Get access to our files',
    showFileSize: true,
    showFileType: true,
    allowMultiple: true,
    downloadTracking: true
  }
}
```