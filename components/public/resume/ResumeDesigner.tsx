'use client'

import React from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Briefcase,
  GraduationCap,
  Award,
} from 'lucide-react'

interface ResumeDesignerProps {
  name: string
  title: string
  photo?: string
  summary?: string
  email?: string
  phone?: string
  location?: string
  website?: string
  linkedin?: string
  github?: string
  experience?: Array<{
    id: string
    company: string
    position: string
    startDate: string
    endDate?: string
    current?: boolean
    description?: string
  }>
  skills?: Array<{ name: string; level: number }>
  education?: Array<{
    id: string
    institution: string
    degree: string
    field: string
    startDate: string
    endDate?: string
  }>
}

export default function ResumeDesigner({
  name,
  title,
  photo,
  summary,
  email,
  phone,
  location,
  website,
  linkedin,
  github,
  experience = [],
  skills = [],
  education = [],
}: ResumeDesignerProps) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

  const renderSkillLevel = (level: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${i <= level ? 'bg-indigo-600' : 'bg-gray-200'}`}
        />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header / Contact Info Bar */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
          <div className="flex items-center gap-6">
            {photo && (
              <img
                src={photo}
                alt={name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-white/20"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{name}</h1>
              <p className="text-lg text-white/90 mt-1">{title}</p>
            </div>
          </div>

          {/* Contact Bar */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/80">
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-1 hover:text-white">
                <Mail className="w-4 h-4" /> {email}
              </a>
            )}
            {phone && (
              <a href={`tel:${phone}`} className="flex items-center gap-1 hover:text-white">
                <Phone className="w-4 h-4" /> {phone}
              </a>
            )}
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {location}
              </span>
            )}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-white"
              >
                <Globe className="w-4 h-4" /> Portfolio
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-white"
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-white"
              >
                <Github className="w-4 h-4" /> GitHub
              </a>
            )}
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Summary */}
          {summary && (
            <section>
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            </section>
          )}

          {/* Experience Timeline */}
          {experience.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4 pb-2 border-b">
                <Briefcase className="w-5 h-5 text-indigo-600" /> Experience
              </h2>
              <div className="space-y-5">
                {experience.map(job => (
                  <div key={job.id} className="relative pl-6 border-l-2 border-indigo-600">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white" />
                    <h3 className="font-semibold text-gray-900">{job.position}</h3>
                    <p className="text-sm text-gray-600">
                      {job.company} · {formatDate(job.startDate)} –{' '}
                      {job.current ? 'Present' : job.endDate ? formatDate(job.endDate) : ''}
                    </p>
                    {job.description && (
                      <p className="text-sm text-gray-700 mt-1">{job.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills Section */}
          {skills.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4 pb-2 border-b">
                <Award className="w-5 h-5 text-indigo-600" /> Skills
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{skill.name}</span>
                    {renderSkillLevel(skill.level)}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education Section */}
          {education.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4 pb-2 border-b">
                <GraduationCap className="w-5 h-5 text-indigo-600" /> Education
              </h2>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id} className="relative pl-6 border-l-2 border-indigo-600">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white" />
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {edu.institution} · {formatDate(edu.startDate)} –{' '}
                      {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
