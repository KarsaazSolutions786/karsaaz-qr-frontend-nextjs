'use client';

import { Download, Printer, Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface PersonalInfo {
  name: string;
  title: string;
  photo?: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  honors?: string;
}

interface Skill {
  name: string;
  level: number; // 1-5
  category: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
}

interface Language {
  name: string;
  proficiency: string; // Native, Fluent, Professional, Conversational, Basic
}

interface ResumeData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  languages: Language[];
}

interface ResumePreviewProps {
  data: ResumeData;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  const { personalInfo, workExperience, education, skills, certifications, languages } = data;

  const handleDownloadPDF = () => {
    window.print();
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getSkillsByCategory = () => {
    const categories: Record<string, Skill[]> = {};
    skills.forEach(skill => {
      if (!categories[skill.category]) {
        categories[skill.category] = [];
      }
      categories[skill.category]!.push(skill);
    });
    return categories;
  };

  const renderSkillLevel = (level: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i <= level ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Action Buttons - Hidden on Print */}
      <div className="no-print fixed top-4 right-4 flex gap-2 z-10">
        <button
          onClick={handlePrint}
          className="bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print</span>
        </button>
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Resume Content */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl print:shadow-none p-8 md:p-12 my-8 print:my-0">
        {/* Header */}
        <header className="mb-8 pb-6 border-b-2 border-gray-200">
          <div className="flex items-start gap-6">
            {personalInfo.photo && (
              <img
                src={personalInfo.photo}
                alt={personalInfo.name}
                className="w-24 h-24 rounded-full object-cover print:w-20 print:h-20"
              />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-1 print:text-3xl">
                {personalInfo.name}
              </h1>
              <h2 className="text-xl text-blue-600 mb-3 print:text-lg">
                {personalInfo.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {personalInfo.summary}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {personalInfo.email && (
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-600">
                  {personalInfo.email}
                </a>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <a href={`tel:${personalInfo.phone}`} className="hover:text-blue-600">
                  {personalInfo.phone}
                </a>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-2 text-gray-600">
                <Globe className="w-4 h-4" />
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                  {personalInfo.website}
                </a>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2 text-gray-600">
                <Linkedin className="w-4 h-4" />
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                  LinkedIn
                </a>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-2 text-gray-600">
                <Github className="w-4 h-4" />
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                  GitHub
                </a>
              </div>
            )}
          </div>
        </header>

        {/* Work Experience */}
        {workExperience && workExperience.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Work Experience
            </h3>
            <div className="space-y-6">
              {workExperience.map((job) => (
                <div key={job.id} className="relative pl-6 border-l-2 border-blue-600">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-white" />
                  <div className="mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{job.position}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                      <span className="font-medium">{job.company}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>
                        {formatDate(job.startDate)} - {job.current ? 'Present' : formatDate(job.endDate!)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{job.description}</p>
                  {job.achievements && job.achievements.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {job.achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Education
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="pl-6 border-l-2 border-blue-600 relative">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-white" />
                  <h4 className="text-lg font-semibold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                    <span className="font-medium">{edu.institution}</span>
                    <span>•</span>
                    <span>{edu.location}</span>
                    <span>•</span>
                    <span>
                      {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                    </span>
                  </div>
                  {(edu.gpa || edu.honors) && (
                    <div className="mt-1 text-sm text-gray-700">
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                      {edu.gpa && edu.honors && <span> • </span>}
                      {edu.honors && <span>{edu.honors}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Skills
            </h3>
            <div className="space-y-4">
              {Object.entries(getSkillsByCategory()).map(([category, categorySkills]) => (
                <div key={category}>
                  <h4 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categorySkills.map((skill, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-gray-700">{skill.name}</span>
                        {renderSkillLevel(skill.level)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Certifications
            </h3>
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                    <p className="text-sm text-gray-600">
                      {cert.issuer} • Issued {formatDate(cert.date)}
                      {cert.expiryDate && ` • Expires ${formatDate(cert.expiryDate)}`}
                    </p>
                    {cert.credentialId && (
                      <p className="text-xs text-gray-500 mt-1">
                        Credential ID: {cert.credentialId}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Languages
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {languages.map((lang, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-gray-900 font-medium">{lang.name}</span>
                  <span className="text-sm text-gray-600">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .no-print {
            display: none !important;
          }
          @page {
            margin: 0.5in;
          }
        }
      `}</style>
    </div>
  );
}
