import { FileBlockContent } from '../types';
import { Block } from '../types';

/**
 * File Block Demo Examples
 * Demonstrates various File Block configurations and usage patterns
 */

// Example 1: Basic file download block
export const createBasicFileBlock = (): Block => ({
  id: 'file-block-1',
  type: 'file',
  title: 'Download Resources',
  content: {
    files: [
      {
        id: 1,
        name: 'Product_Brochure.pdf',
        path: 'uploads/Product_Brochure.pdf',
        mime_type: 'application/pdf',
        size: 2457600,
        url: 'https://example.com/uploads/Product_Brochure.pdf',
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        name: 'User_Manual.docx',
        path: 'uploads/User_Manual.docx',
        mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 1863680,
        url: 'https://example.com/uploads/User_Manual.docx',
        created_at: '2024-01-15T10:35:00Z'
      }
    ],
    title: 'Product Documentation',
    description: 'Download our latest product documentation and user guides',
    showFileSize: true,
    showFileType: true,
    allowMultiple: true,
    downloadTracking: true
  } as FileBlockContent,
  settings: {
    visible: true,
    order: 5,
    customClasses: [],
    padding: '1rem',
    margin: '0.5rem 0'
  },
  design: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderRadius: '8px',
    padding: '1rem',
    margin: '0.5rem 0'
  },
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z'
});

// Example 2: Image gallery block
export const createImageGalleryBlock = (): Block => ({
  id: 'file-block-images',
  type: 'file',
  title: 'Photo Gallery',
  content: {
    files: [
      {
        id: 3,
        name: 'product-shot-1.jpg',
        path: 'uploads/product-shot-1.jpg',
        mime_type: 'image/jpeg',
        size: 524288,
        url: 'https://example.com/uploads/product-shot-1.jpg',
        created_at: '2024-01-15T11:00:00Z'
      },
      {
        id: 4,
        name: 'product-shot-2.png',
        path: 'uploads/product-shot-2.png',
        mime_type: 'image/png',
        size: 786432,
        url: 'https://example.com/uploads/product-shot-2.png',
        created_at: '2024-01-15T11:05:00Z'
      },
      {
        id: 5,
        name: 'product-shot-3.webp',
        path: 'uploads/product-shot-3.webp',
        mime_type: 'image/webp',
        size: 393216,
        url: 'https://example.com/uploads/product-shot-3.webp',
        created_at: '2024-01-15T11:10:00Z'
      }
    ],
    title: 'Product Images',
    description: 'High-resolution product photos for media and press use',
    showFileSize: true,
    showFileType: true,
    allowMultiple: true,
    downloadTracking: true
  } as FileBlockContent,
  settings: {
    visible: true,
    order: 3,
    customClasses: [],
    padding: '1.5rem',
    margin: '0.5rem 0'
  },
  design: {
    backgroundColor: '#f8f9fa',
    textColor: '#000000',
    borderRadius: '12px',
    padding: '1.5rem',
    margin: '0.5rem 0'
  },
  createdAt: '2024-01-15T11:00:00Z',
  updatedAt: '2024-01-15T11:00:00Z'
});

// Example 3: Single file download (e.g., resume/CV)
export const createResumeBlock = (): Block => ({
  id: 'file-block-resume',
  type: 'file',
  title: 'Resume Download',
  content: {
    files: [
      {
        id: 6,
        name: 'John_Doe_Resume.pdf',
        path: 'uploads/resume.pdf',
        mime_type: 'application/pdf',
        size: 1572864,
        url: 'https://example.com/uploads/resume.pdf',
        created_at: '2024-01-15T12:00:00Z'
      }
    ],
    title: 'Download My Resume',
    description: 'Get my latest resume in PDF format',
    showFileSize: true,
    showFileType: false,
    allowMultiple: false,
    downloadTracking: true
  } as FileBlockContent,
  settings: {
    visible: true,
    order: 10,
    customClasses: [],
    padding: '1rem',
    margin: '0.5rem 0'
  },
  design: {
    backgroundColor: '#e3f2fd',
    textColor: '#000000',
    borderRadius: '8px',
    padding: '1rem',
    margin: '0.5rem 0'
  },
  createdAt: '2024-01-15T12:00:00Z',
  updatedAt: '2024-01-15T12:00:00Z'
});

// Example 4: Software downloads
export const createSoftwareDownloadsBlock = (): Block => ({
  id: 'file-block-software',
  type: 'file',
  title: 'Software Downloads',
  content: {
    files: [
      {
        id: 7,
        name: 'App-Installer-Windows.exe',
        path: 'uploads/app-windows.exe',
        mime_type: 'application/x-msdownload',
        size: 52428800,
        url: 'https://example.com/downloads/app-windows.exe',
        created_at: '2024-01-15T13:00:00Z'
      },
      {
        id: 8,
        name: 'App-Installer-Mac.dmg',
        path: 'uploads/app-mac.dmg',
        mime_type: 'application/x-apple-diskimage',
        size: 47185920,
        url: 'https://example.com/downloads/app-mac.dmg',
        created_at: '2024-01-15T13:05:00Z'
      },
      {
        id: 9,
        name: 'App-Linux.tar.gz',
        path: 'uploads/app-linux.tar.gz',
        mime_type: 'application/gzip',
        size: 41943040,
        url: 'https://example.com/downloads/app-linux.tar.gz',
        created_at: '2024-01-15T13:10:00Z'
      }
    ],
    title: 'Download Our Application',
    description: 'Choose the right version for your operating system',
    showFileSize: true,
    showFileType: true,
    allowMultiple: true,
    downloadTracking: true
  } as FileBlockContent,
  settings: {
    visible: true,
    order: 7,
    customClasses: [],
    padding: '1.5rem',
    margin: '0.5rem 0'
  },
  design: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderRadius: '8px',
    padding: '1.5rem',
    margin: '0.5rem 0'
  },
  createdAt: '2024-01-15T13:00:00Z',
  updatedAt: '2024-01-15T13:00:00Z'
});

// Example 5: Minimal single file
export const createMinimalFileBlock = (): Block => ({
  id: 'file-block-minimal',
  type: 'file',
  title: 'File',
  content: {
    files: [
      {
        id: 10,
        name: 'document.pdf',
        path: 'uploads/document.pdf',
        mime_type: 'application/pdf',
        size: 1048576,
        url: 'https://example.com/uploads/document.pdf',
        created_at: '2024-01-15T14:00:00Z'
      }
    ],
    title: '',
    description: '',
    showFileSize: false,
    showFileType: false,
    allowMultiple: false,
    downloadTracking: false
  } as FileBlockContent,
  settings: {
    visible: true,
    order: 1,
    customClasses: [],
    padding: '0.5rem',
    margin: '0.25rem 0'
  },
  design: {
    backgroundColor: 'transparent',
    textColor: '#000000',
    borderRadius: '4px',
    padding: '0.5rem',
    margin: '0.25rem 0'
  },
  createdAt: '2024-01-15T14:00:00Z',
  updatedAt: '2024-01-15T14:00:00Z'
});

// Edit mode example with empty state
export const createEmptyFileBlockForEdit = (): Block => ({
  id: 'file-block-empty',
  type: 'file',
  title: 'File Downloads',
  content: {
    files: [],
    title: 'Download Resources',
    description: 'Upload files for your visitors to download',
    showFileSize: true,
    showFileType: true,
    allowMultiple: true,
    downloadTracking: true
  } as FileBlockContent,
  settings: {
    visible: true,
    order: 5,
    customClasses: [],
    padding: '1rem',
    margin: '0.5rem 0'
  },
  design: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderRadius: '8px',
    padding: '1rem',
    margin: '0.5rem 0'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Music/Audio downloads example
export const createMusicDownloadsBlock = (): Block => ({
  id: 'file-block-music',
  type: 'file',
  title: 'Music Downloads',
  content: {
    files: [
      {
        id: 11,
        name: 'track-01.mp3',
        path: 'uploads/track-01.mp3',
        mime_type: 'audio/mpeg',
        size: 8388608,
        url: 'https://example.com/music/track-01.mp3',
        created_at: '2024-01-15T15:00:00Z'
      },
      {
        id: 12,
        name: 'track-02.wav',
        path: 'uploads/track-02.wav',
        mime_type: 'audio/wav',
        size: 20971520,
        url: 'https://example.com/music/track-02.wav',
        created_at: '2024-01-15T15:05:00Z'
      }
    ],
    title: 'Download My Music',
    description: 'Free music downloads in MP3 and WAV formats',
    showFileSize: true,
    showFileType: true,
    allowMultiple: true,
    downloadTracking: true
  } as FileBlockContent,
  settings: {
    visible: true,
    order: 6,
    customClasses: [],
    padding: '1.5rem',
    margin: '0.5rem 0'
  },
  design: {
    backgroundColor: '#f3e5f5',
    textColor: '#000000',
    borderRadius: '12px',
    padding: '1.5rem',
    margin: '0.5rem 0'
  },
  createdAt: '2024-01-15T15:00:00Z',
  updatedAt: '2024-01-15T15:00:00Z'
});

// Export all examples
export const fileBlockExamples = {
  basic: createBasicFileBlock(),
  imageGallery: createImageGalleryBlock(),
  resume: createResumeBlock(),
  software: createSoftwareDownloadsBlock(),
  minimal: createMinimalFileBlock(),
  empty: createEmptyFileBlockForEdit(),
  music: createMusicDownloadsBlock()
};

// Example upload progress state
export const mockUploadProgress = [
  {
    uploadId: 'upload-1',
    progress: 75,
    file: {
      name: 'presentation.pdf',
      size: 5242880,
      type: 'application/pdf'
    }
  },
  {
    uploadId: 'upload-2',
    progress: 45,
    file: {
      name: 'screenshot.png',
      size: 2097152,
      type: 'image/png'
    }
  }
];

// Example errors state
export const mockUploadErrors = [
  'screenshot.png: File size exceeds the maximum limit of 100 MB',
  'document.exe: File type not allowed. Allowed types: pdf, doc, docx, txt, jpg, jpeg, png, gif'
];