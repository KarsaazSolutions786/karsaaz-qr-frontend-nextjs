"use client";

import { useState, useMemo } from 'react';
import { BlockEditorProps } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  X,
  Plus,
  Search,
  ExternalLink,
  Tag,
  Eye,
  Grid3x3,
  Code,
  Image,
  Globe,
  Github,
} from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

/**
 * Portfolio Block
 * A comprehensive portfolio showcase component for displaying projects
 * Features:
 * - Project listings with images, titles, descriptions
 * - Category filtering and search
 * - Project details modal
 * - Image lightbox
 * - Tags/technologies display
 * - Project links
 * - Both edit and public view modes
 * - Responsive grid layout
 */

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

export default function PortfolioBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  const { content, design } = block;
  const portfolioContent = content as PortfolioBlockContent;
  
  const {
    title,
    description,
    projects = [],
    categories = [],
    showSearch = true,
    showFilters = true,
    showTags = true,
    columns = 2,
    layout = 'grid'
  } = portfolioContent;

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string>('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAddProject, setShowAddProject] = useState(false);

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Search filter
      const matchesSearch = !searchQuery ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Category filter
      const matchesCategory = !selectedCategory ||
        selectedCategory === 'all' ||
        project.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  // Sort projects: featured first, then newest first
  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // Sort by date if available
      if (a.completionDate && b.completionDate) {
        return new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime();
      }
      
      // Fallback to title sort
      return a.title.localeCompare(b.title);
    });
  }, [filteredProjects]);

  // Handle content changes
  const handleContentChange = (field: keyof PortfolioBlockContent, value: any) => {
    onUpdate({
      content: {
        ...portfolioContent,
        [field]: value
      }
    });
  };

  // Handle project changes
  const handleProjectChange = (index: number, field: keyof Project, value: any) => {
    const updatedProjects = [...projects];
    if (!updatedProjects[index]) {
      updatedProjects[index] = {
        id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: '',
        description: ''
      };
    }
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value
    };
    handleContentChange('projects', updatedProjects);
  };

  // Add new project
  const addProject = () => {
    const newProjectId = `project_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newProject: Project = {
      id: newProjectId,
      title: 'New Project',
      description: 'Project description',
      category: categories[0] || 'Uncategorized',
      tags: [],
      featured: false
    };
    handleContentChange('projects', [...projects, newProject]);
  };

  // Remove project
  const removeProject = (index: number) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    handleContentChange('projects', updatedProjects);
  };

  // Open project details modal
  const openProjectDetails = (project: Project) => {
    setSelectedProject(project);
  };

  // Close project details modal
  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  // Open lightbox
  const openLightbox = (imageUrl: string) => {
    setLightboxImage(imageUrl);
    setLightboxOpen(true);
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImage('');
  };

  // Add new category
  const addCategory = (category: string) => {
    if (category && !categories.includes(category)) {
      handleContentChange('categories', [...categories, category]);
    }
  };

  // Get grid column classes
  const getGridColumnClasses = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      default:
        return 'grid-cols-1 md:grid-cols-2';
    }
  };

  // Project card component
  const ProjectCard = ({ project }: { project: Project }) => {
    return (
      <Card className={`relative overflow-hidden transition-all hover:shadow-lg hover:scale-105 ${
        project.featured ? 'ring-2 ring-blue-500' : ''
      }`}>
        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="default" className="bg-blue-600">
              Featured
            </Badge>
          </div>
        )}

        {/* Project Image */}
        {project.image && (
          <div
            className="relative w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer group"
            onClick={() => openLightbox(project.image!)}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Eye className="w-8 h-8 text-white" />
            </div>
          </div>
        )}

        {/* No Image Placeholder */}
        {!project.image && (
          <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Image className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Card Content */}
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold line-clamp-1">{project.title}</h3>
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingProject(project)}
                className="h-7 w-7 p-0"
              >
                <Tag className="w-3 h-3" />
              </Button>
            )}
          </div>

          {/* Category */}
          {project.category && (
            <Badge variant="outline" className="text-xs mb-2">
              {project.category}
            </Badge>
          )}

          {/* Description */}
          {project.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {project.description}
            </p>
          )}

          {/* Tags */}
          {showTags && project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {project.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Links */}
          <div className="flex gap-2">
            {(project.projectUrl || project.demoUrl) && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(project.projectUrl || project.demoUrl, '_blank')}
                className="flex-1"
              >
                <Globe className="w-3 h-3 mr-1" />
                View Project
              </Button>
            )}
            {project.codeUrl && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(project.codeUrl, '_blank')}
              >
                <Code className="w-3 h-3" />
              </Button>
            )}
            {project.details && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => openProjectDetails(project)}
                className="flex-1"
              >
                <Eye className="w-3 h-3 mr-1" />
                Details
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Public view
  if (!isEditing) {
    return (
      <>
        <div
          className="block-portfolio"
          style={{
            backgroundColor: design.backgroundColor,
            padding: design.padding,
            margin: design.margin,
            borderRadius: design.borderRadius,
          }}
        >
          {/* Header */}
          {(title || description) && (
            <div className="mb-6 text-center">
              {title && (
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
              )}
              {description && (
                <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
              )}
            </div>
          )}

          {/* Search and Filters */}
          {(showSearch || showFilters) && (
            <div className="mb-6 space-y-4">
              {showSearch && (
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              )}
              
              {showFilters && categories.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                  >
                    All
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Projects Grid */}
          {sortedProjects.length > 0 ? (
            <div className={`grid gap-6 ${getGridColumnClasses()}`}>
              {sortedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-4xl mb-4">💼</div>
              <p>No projects to display</p>
            </div>
          )}

          {/* Results count */}
          {searchQuery && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Found {sortedProjects.length} project{sortedProjects.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Project Details Modal */}
        <Dialog open={!!selectedProject} onClose={closeProjectDetails} className="max-w-3xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>{selectedProject?.title}</DialogTitle>
              <DialogDescription>
                Project Details
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              {selectedProject?.image && (
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover rounded-lg cursor-pointer"
                  onClick={() => openLightbox(selectedProject.image!)}
                />
              )}
              
              <div className="space-y-2">
                {selectedProject?.category && (
                  <div>
                    <span className="font-semibold">Category:</span> {selectedProject.category}
                  </div>
                )}
                {selectedProject?.completionDate && (
                  <div>
                    <span className="font-semibold">Completed:</span> {new Date(selectedProject.completionDate).toLocaleDateString()}
                  </div>
                )}
              </div>

              {selectedProject?.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p>{selectedProject.description}</p>
                </div>
              )}

              {selectedProject?.details && (
                <div>
                  <h4 className="font-semibold mb-2">Details</h4>
                  <p>{selectedProject.details}</p>
                </div>
              )}

              {selectedProject?.tags && selectedProject.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="flex gap-2 pt-4">
                {(selectedProject?.projectUrl || selectedProject?.demoUrl) && (
                  <Button
                    onClick={() => window.open(selectedProject.projectUrl || selectedProject.demoUrl, '_blank')}
                    className="flex-1"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    View Project
                  </Button>
                )}
                {selectedProject?.codeUrl && (
                  <Button
                    onClick={() => window.open(selectedProject.codeUrl, '_blank')}
                    variant="outline"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </Button>
                )}
              </div>
            </div>
        </Dialog>

        {/* Lightbox Modal */}
        <Dialog open={lightboxOpen} onClose={closeLightbox} className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Project Image</DialogTitle>
              <DialogDescription>
                Click outside to close
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {lightboxImage && (
                <img
                  src={lightboxImage}
                  alt="Project image"
                  className="w-full h-auto rounded-lg"
                  style={{ maxHeight: '70vh', objectFit: 'contain' }}
                />
              )}
            </div>
        </Dialog>
      </>
    );
  }

  // Edit view
  return (
    <div className="block-editor-portfolio space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Grid3x3 size={20} />
          <h3 className="text-lg font-semibold">Portfolio Block</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <X size={16} />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Block Title and Description */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Block Title</Label>
            <Input
              value={title || ''}
              onChange={(e) => handleContentChange('title', e.target.value)}
              placeholder="My Portfolio"
            />
          </div>
          <div>
            <Label>Columns</Label>
            <Select
              value={columns.toString()}
              onValueChange={(value) => handleContentChange('columns', parseInt(value) as 1 | 2 | 3)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Column</SelectItem>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Block Description</Label>
          <TextareaAutosize
            value={description || ''}
            onChange={(e) => handleContentChange('description', e.target.value)}
            placeholder="Showcase of my work..."
            minRows={2}
            className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        {/* Display Options */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Layout</Label>
            <Select
              value={layout}
              onValueChange={(value) => handleContentChange('layout', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="masonry">Masonry</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show-search"
              checked={showSearch}
              onChange={(e) => handleContentChange('showSearch', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="show-search">Show Search</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show-filters"
              checked={showFilters}
              onChange={(e) => handleContentChange('showFilters', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="show-filters">Show Filters</Label>
          </div>
        </div>

        {/* Categories Management */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <Label>Categories</Label>
            <Button
              size="sm"
              onClick={() => {
                const category = prompt('Enter new category:');
                if (category) addCategory(category);
              }}
            >
              <Plus size={14} className="mr-1" />
              Add Category
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleContentChange('categories', categories.filter(c => c !== category))}
                  className="h-4 w-4 p-0 ml-2 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X size={12} />
                </Button>
              </Badge>
            ))}
            {categories.length === 0 && (
              <p className="text-sm text-muted-foreground">No categories added</p>
            )}
          </div>
        </div>

        {/* Projects List */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <Label>Projects ({projects.length})</Label>
            <Button size="sm" onClick={addProject}>
              <Plus size={14} className="mr-1" />
              Add Project
            </Button>
          </div>

          {projects.length > 0 ? (
            <div className={`grid gap-4 ${getGridColumnClasses()}`}>
              {projects.map((project) => (
                <Card key={project.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium line-clamp-1">{project.title}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(projects.indexOf(project))}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X size={12} />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {project.description || 'No description'}
                    </p>

                    {project.category && (
                      <Badge variant="outline" className="text-xs mb-2">
                        {project.category}
                      </Badge>
                    )}

                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditingProject(project)}
                        className="flex-1"
                      >
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
              <Grid3x3 size={32} className="mx-auto mb-2 opacity-50" />
              <p>No projects added yet</p>
              <Button size="sm" className="mt-3" onClick={addProject}>
                Add Your First Project
              </Button>
            </div>
          )}
        </div>

        {/* Project Editor Modal */}
        {(editingProject || showAddProject) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h4 className="text-lg font-semibold mb-4">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h4>
              
              <ProjectEditor
                project={editingProject || undefined}
                categories={categories}
                onSave={editingProject ? (updated) => {
                  const index = projects.findIndex(p => p.id === updated.id);
                  const updatedProjects = [...projects];
                  updatedProjects[index] = updated;
                  handleContentChange('projects', updatedProjects);
                  setEditingProject(null);
                } : (newProject) => {
                  handleContentChange('projects', [...projects, newProject]);
                  setShowAddProject(false);
                }}
                onCancel={() => {
                  setEditingProject(null);
                  setShowAddProject(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Project Editor component
function ProjectEditor({ 
  project, 
  categories, 
  onSave, 
  onCancel 
}: { 
  project?: Project; 
  categories: string[]; 
  onSave: (project: Project) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState<Project>(() =>
    project || {
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: '',
      description: '',
      category: categories[0] || '',
      tags: [],
      featured: false
    }
  );

  const [tagInput, setTagInput] = useState('');

  const handleChange = (field: keyof Project, value: string | number | boolean | string[] | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      handleChange('tags', [...(formData.tags || []), tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleChange('tags', formData.tags?.filter(tag => tag !== tagToRemove) || []);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Project Title *</Label>
          <Input
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="My Awesome Project"
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Brief project description..."
          rows={3}
        />
      </div>

      <div>
        <Label>Project Image URL</Label>
        <Input
          type="url"
          value={formData.image || ''}
          onChange={(e) => handleChange('image', e.target.value)}
          placeholder="https://example.com/project-image.jpg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Project URL</Label>
          <Input
            type="url"
            value={formData.projectUrl || ''}
            onChange={(e) => handleChange('projectUrl', e.target.value)}
            placeholder="https://example.com/project"
          />
        </div>
        <div>
          <Label>Demo URL</Label>
          <Input
            type="url"
            value={formData.demoUrl || ''}
            onChange={(e) => handleChange('demoUrl', e.target.value)}
            placeholder="https://demo.example.com"
          />
        </div>
      </div>

      <div>
        <Label>Code Repository URL</Label>
        <Input
          type="url"
          value={formData.codeUrl || ''}
          onChange={(e) => handleChange('codeUrl', e.target.value)}
          placeholder="https://github.com/username/repo"
        />
      </div>

      <div>
        <Label>Completion Date</Label>
        <Input
          type="date"
          value={formData.completionDate || ''}
          onChange={(e) => handleChange('completionDate', e.target.value)}
        />
      </div>

      <div>
        <Label>Tags/Technologies</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
          />
          <Button onClick={handleAddTag} type="button">
            <Plus size={16} />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1">
          {formData.tags?.map((tag, i) => (
            <Badge key={i} variant="secondary">
              {tag}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveTag(tag)}
                className="h-3 w-3 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X size={8} />
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label>Project Details (for modal)</Label>
        <Textarea
          value={formData.details || ''}
          onChange={(e) => handleChange('details', e.target.value)}
          placeholder="Detailed project information..."
          rows={4}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured || false}
          onChange={(e) => handleChange('featured', e.target.checked)}
          className="rounded border-gray-300"
        />
        <Label htmlFor="featured">Feature this project</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)}>
          {project ? 'Update' : 'Add'} Project
        </Button>
      </div>
    </div>
  );
}
