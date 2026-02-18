'use client';

import React, { useState } from 'react';
import { GripVertical, Plus, Trash2, Edit2, Image as ImageIcon } from 'lucide-react';
import { Service, createService } from '@/types/entities/business-profile';

interface ServicesInputProps {
  value: Service[];
  onChange: (value: Service[]) => void;
}

export function ServicesInput({ value, onChange }: ServicesInputProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addService = () => {
    const newService = createService(value.length);
    onChange([...value, newService]);
    setEditingId(newService.id);
  };

  const removeService = (id: string) => {
    onChange(value.filter((s) => s.id !== id));
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    onChange(
      value.map((service) =>
        service.id === id ? { ...service, ...updates } : service
      )
    );
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newServices = [...value];
    const draggedService = newServices[draggedIndex];
    if (!draggedService) return;
    newServices.splice(draggedIndex, 1);
    newServices.splice(index, 0, draggedService);

    // Update order
    const reordered = newServices.map((service, idx) => ({
      ...service,
      order: idx,
    }));

    onChange(reordered);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Services</h3>
        <button
          type="button"
          onClick={addService}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {value.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No services added yet</p>
          <button
            type="button"
            onClick={addService}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Service
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {value
            .sort((a, b) => a.order - b.order)
            .map((service, index) => {
              const isEditing = editingId === service.id;

              return (
                <div
                  key={service.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`border rounded-lg bg-white transition-all ${
                    draggedIndex === index ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 p-4">
                    <button
                      type="button"
                      className="cursor-move text-gray-400 hover:text-gray-600 mt-1"
                    >
                      <GripVertical className="w-5 h-5" />
                    </button>

                    <div className="flex-1 space-y-3">
                      {isEditing ? (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Service Name *
                              </label>
                              <input
                                type="text"
                                value={service.name}
                                onChange={(e) =>
                                  updateService(service.id, { name: e.target.value })
                                }
                                placeholder="e.g., Web Design"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price
                              </label>
                              <input
                                type="text"
                                value={service.price || ''}
                                onChange={(e) =>
                                  updateService(service.id, { price: e.target.value })
                                }
                                placeholder="e.g., $99/hour or From $500"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              value={service.description || ''}
                              onChange={(e) =>
                                updateService(service.id, {
                                  description: e.target.value,
                                })
                              }
                              placeholder="Describe your service..."
                              rows={3}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration
                              </label>
                              <input
                                type="text"
                                value={service.duration || ''}
                                onChange={(e) =>
                                  updateService(service.id, {
                                    duration: e.target.value,
                                  })
                                }
                                placeholder="e.g., 2 hours, 1 week"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Icon/Emoji
                              </label>
                              <input
                                type="text"
                                value={service.icon || ''}
                                onChange={(e) =>
                                  updateService(service.id, { icon: e.target.value })
                                }
                                placeholder="e.g., 🎨 💻 ✨"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Image URL
                            </label>
                            <input
                              type="url"
                              value={service.image || ''}
                              onChange={(e) =>
                                updateService(service.id, { image: e.target.value })
                              }
                              placeholder="https://example.com/service-image.jpg"
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              Done
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              {service.icon && (
                                <span className="text-2xl">{service.icon}</span>
                              )}
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">
                                  {service.name || 'Untitled Service'}
                                </h4>
                                {service.description && (
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {service.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                                  {service.price && (
                                    <span className="font-medium text-blue-600">
                                      {service.price}
                                    </span>
                                  )}
                                  {service.duration && <span>{service.duration}</span>}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingId(isEditing ? null : service.id)
                        }
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeService(service.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      <div className="text-xs text-gray-500 mt-2">
        💡 Tip: Drag and drop services to reorder them
      </div>
    </div>
  );
}
