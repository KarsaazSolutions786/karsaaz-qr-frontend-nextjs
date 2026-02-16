# Portfolio Block

A comprehensive portfolio showcase component for displaying projects with advanced filtering, search, and project details functionality.

## Features

- **Project Listings**: Display projects with titles, descriptions, images, and metadata
- **Category Filtering**: Organize projects by categories with filter buttons
- **Search Functionality**: Search projects by title, description, tags, or category
- **Project Details Modal**: View detailed project information in a modal
- **Image Lightbox**: Click images to view them in a full-screen lightbox
- **Tags/Technologies**: Display technology tags for each project
- **Project Links**: Support for project URL, demo URL, and code repository links
- **Dual View Modes**: Both public display and editing interfaces
- **Responsive Grid**: Configurable columns (1, 2, or 3) with responsive design
- **Featured Projects**: Highlight featured projects with special styling

## Data Structure

```typescript
interface PortfolioBlockContent {
  title?: string;
  description?: string;
  projects: Project[];
  categories: string[];
  showSearch?: boolean;
  showFilters?: boolean;
  showTags?: boolean;
  columns?: 1 | 2 | 3;
  layout?: 'grid' | 'masonry';
}

interface Project {
  id: string;
  title: string;
  description?: string;
  image?: string;
  category?: string;
  tags?: string[];
  projectUrl?: string;
  codeUrl?: string;
  demoUrl?: string;
  completionDate?: string;
  featured?: boolean;
  details?: string;
}
```

## Usage

### Edit Mode

1. **Add Categories**: Create project categories for filtering
2. **Add Projects**: Create new projects with all relevant details
3. **Configure Display**: Choose columns (1-3), enable/disable search and filters
4. **Manage Projects**: Edit or delete existing projects

### Public View

1. **Browse Projects**: View all projects in a responsive grid
2. **Filter by Category**: Click category buttons to filter projects
3. **Search**: Use the search box to find specific projects
4. **View Details**: Click "Details" to see project information in a modal
5. **View Images**: Click project images to open in lightbox
6. **Visit Links**: Click "View Project" or code repository links

## Project Editor Fields

- **Title**: Project name (required)
- **Category**: Project category for filtering
- **Description**: Brief project description
- **Image URL**: Project thumbnail image
- **Project URL**: Link to live project
- **Demo URL**: Link to project demo
- **Code URL**: Link to source code (e.g., GitHub)
- **Completion Date**: Project completion date
- **Tags**: Technology tags (comma-separated)
- **Details**: Detailed project information (shown in modal)
- **Featured**: Mark as featured project

## Configuration Options

- **Title**: Block heading text
- **Description**: Block subtitle text
- **Columns**: Number of columns (1, 2, or 3)
- **Layout**: Grid or masonry layout
- **Show Search**: Enable/disable search functionality
- **Show Filters**: Enable/disable category filters
- **Show Tags**: Show/hide technology tags

## Styling

- Featured projects have a blue ring accent
- Hover effects with scale transform and shadow
- Responsive card-based grid layout
- Clean, modern design with proper spacing
- Lightbox with full-size image viewing
- Modal with detailed project information

## Block Registry

Type: `portfolio`
Category: `media`
Default Data:
```javascript
{
  title: 'My Portfolio',
  description: 'Showcase of my work and projects',
  projects: [],
  categories: ['Web Development', 'Design', 'Mobile Apps'],
  showSearch: true,
  showFilters: true,
  showTags: true,
  columns: 2,
  layout: 'grid'
}
```
