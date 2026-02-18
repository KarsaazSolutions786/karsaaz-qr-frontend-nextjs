'use client';

import React, { useState } from 'react';
import {
  GripVertical,
  Plus,
  Trash2,
  Edit2,
  Star,
  User,
  Mail,
  Phone,
  Linkedin,
  Twitter,
} from 'lucide-react';
import { TeamMember, createTeamMember } from '@/types/entities/business-profile';

interface TeamMembersInputProps {
  value: TeamMember[];
  onChange: (value: TeamMember[]) => void;
}

export function TeamMembersInput({ value, onChange }: TeamMembersInputProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addTeamMember = () => {
    const newMember = createTeamMember(value.length);
    onChange([...value, newMember]);
    setEditingId(newMember.id);
  };

  const removeMember = (id: string) => {
    onChange(value.filter((m) => m.id !== id));
  };

  const updateMember = (id: string, updates: Partial<TeamMember>) => {
    onChange(
      value.map((member) =>
        member.id === id ? { ...member, ...updates } : member
      )
    );
  };

  const toggleFeatured = (id: string) => {
    const member = value.find((m) => m.id === id);
    if (member) {
      updateMember(id, { featured: !member.featured });
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newMembers = [...value];
    const draggedMember = newMembers[draggedIndex];
    if (!draggedMember) return;
    newMembers.splice(draggedIndex, 1);
    newMembers.splice(index, 0, draggedMember);

    // Update order
    const reordered = newMembers.map((member, idx) => ({
      ...member,
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
        <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
        <button
          type="button"
          onClick={addTeamMember}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Team Member
        </button>
      </div>

      {value.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No team members added yet</p>
          <button
            type="button"
            onClick={addTeamMember}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add First Team Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {value
            .sort((a, b) => a.order - b.order)
            .map((member, index) => {
              const isEditing = editingId === member.id;

              return (
                <div
                  key={member.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`border rounded-lg bg-white transition-all ${
                    draggedIndex === index ? 'opacity-50' : ''
                  } ${member.featured ? 'ring-2 ring-yellow-400' : ''}`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        className="cursor-move text-gray-400 hover:text-gray-600 mt-1"
                      >
                        <GripVertical className="w-5 h-5" />
                      </button>

                      <div className="flex-1 space-y-3">
                        {isEditing ? (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Photo URL
                              </label>
                              <input
                                type="url"
                                value={member.photo || ''}
                                onChange={(e) =>
                                  updateMember(member.id, { photo: e.target.value })
                                }
                                placeholder="https://example.com/photo.jpg"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Name *
                                </label>
                                <input
                                  type="text"
                                  value={member.name}
                                  onChange={(e) =>
                                    updateMember(member.id, { name: e.target.value })
                                  }
                                  placeholder="John Doe"
                                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Title *
                                </label>
                                <input
                                  type="text"
                                  value={member.title}
                                  onChange={(e) =>
                                    updateMember(member.id, { title: e.target.value })
                                  }
                                  placeholder="CEO, Designer, etc."
                                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bio
                              </label>
                              <textarea
                                value={member.bio || ''}
                                onChange={(e) =>
                                  updateMember(member.id, { bio: e.target.value })
                                }
                                placeholder="Short bio about this team member..."
                                rows={3}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Email
                                </label>
                                <input
                                  type="email"
                                  value={member.email || ''}
                                  onChange={(e) =>
                                    updateMember(member.id, { email: e.target.value })
                                  }
                                  placeholder="john@example.com"
                                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Phone
                                </label>
                                <input
                                  type="tel"
                                  value={member.phone || ''}
                                  onChange={(e) =>
                                    updateMember(member.id, { phone: e.target.value })
                                  }
                                  placeholder="+1 (555) 123-4567"
                                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  LinkedIn
                                </label>
                                <input
                                  type="url"
                                  value={member.socialMedia?.linkedin || ''}
                                  onChange={(e) =>
                                    updateMember(member.id, {
                                      socialMedia: {
                                        ...member.socialMedia,
                                        linkedin: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="https://linkedin.com/in/username"
                                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Twitter
                                </label>
                                <input
                                  type="url"
                                  value={member.socialMedia?.twitter || ''}
                                  onChange={(e) =>
                                    updateMember(member.id, {
                                      socialMedia: {
                                        ...member.socialMedia,
                                        twitter: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="https://twitter.com/username"
                                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
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
                            <div className="flex items-start gap-3">
                              {member.photo ? (
                                <img
                                  src={member.photo}
                                  alt={member.name}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                  {member.name || 'Untitled Member'}
                                  {member.featured && (
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  )}
                                </h4>
                                <p className="text-sm text-gray-600">{member.title}</p>
                                {member.bio && (
                                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                    {member.bio}
                                  </p>
                                )}
                                <div className="flex items-center gap-3 mt-2">
                                  {member.email && (
                                    <a
                                      href={`mailto:${member.email}`}
                                      className="text-blue-600 hover:text-blue-700"
                                      title={member.email}
                                    >
                                      <Mail className="w-4 h-4" />
                                    </a>
                                  )}
                                  {member.phone && (
                                    <a
                                      href={`tel:${member.phone}`}
                                      className="text-blue-600 hover:text-blue-700"
                                      title={member.phone}
                                    >
                                      <Phone className="w-4 h-4" />
                                    </a>
                                  )}
                                  {member.socialMedia?.linkedin && (
                                    <a
                                      href={member.socialMedia.linkedin}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      <Linkedin className="w-4 h-4" />
                                    </a>
                                  )}
                                  {member.socialMedia?.twitter && (
                                    <a
                                      href={member.socialMedia.twitter}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      <Twitter className="w-4 h-4" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => toggleFeatured(member.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            member.featured
                              ? 'text-yellow-600 bg-yellow-50'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title={member.featured ? 'Unfeature' : 'Feature'}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              member.featured ? 'fill-current' : ''
                            }`}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingId(isEditing ? null : member.id)
                          }
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeMember(member.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      <div className="text-xs text-gray-500 mt-2">
        💡 Tip: Click the star to feature key team members. Drag to reorder.
      </div>
    </div>
  );
}
