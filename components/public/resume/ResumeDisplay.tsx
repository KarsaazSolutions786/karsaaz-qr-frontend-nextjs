'use client';

import ResumePreview from './ResumePreview';
import { useTranslation } from '@/lib/i18n';

interface ResumeDisplayProps {
  data: any;
}

export default function ResumeDisplay({ data }: ResumeDisplayProps) {
  const { t } = useTranslation();
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('Resume Not Found')}</h1>
          <p className="text-gray-600">{t('The requested resume could not be found.')}</p>
        </div>
      </div>
    );
  }

  const resumeData = {
    personalInfo: data.personalInfo || {
      name: 'Unknown',
      title: 'Professional',
      summary: '',
      email: '',
      phone: '',
      location: '',
    },
    workExperience: data.workExperience || [],
    education: data.education || [],
    skills: data.skills || [],
    certifications: data.certifications || [],
    languages: data.languages || [],
  };

  return <ResumePreview data={resumeData} />;
}
