'use client'

import { useState } from 'react'
import type { FAQsBlockData } from '@/types/entities/biolink'

interface FAQsBlockProps {
  block: FAQsBlockData
  isEditing?: boolean
  onUpdate?: (data: FAQsBlockData['data']) => void
}

export default function FAQsBlock({ block, isEditing, onUpdate }: FAQsBlockProps) {
  const { title, subtitle, faqs } = block.data
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (isEditing) {
    const addFaq = () => {
      onUpdate?.({ ...block.data, faqs: [...faqs, { question: '', answer: '' }] })
    }

    const removeFaq = (index: number) => {
      onUpdate?.({ ...block.data, faqs: faqs.filter((_, i) => i !== index) })
    }

    const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
      const newFaqs = faqs.map((faq, i) =>
        i === index ? { question: faq.question, answer: faq.answer, [field]: value } : faq
      )
      onUpdate?.({ ...block.data, faqs: newFaqs })
    }

    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title (optional)</label>
          <input
            type="text"
            value={title || ''}
            onChange={(e) => onUpdate?.({ ...block.data, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Subtitle (optional)</label>
          <input
            type="text"
            value={subtitle || ''}
            onChange={(e) => onUpdate?.({ ...block.data, subtitle: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Questions</label>
          <button type="button" onClick={addFaq} className="text-sm text-blue-600 hover:text-blue-700">
            + Add Question
          </button>
        </div>
        {faqs.map((faq, index) => (
          <div key={index} className="space-y-2 rounded border border-gray-100 p-3">
            <div className="flex items-start gap-2">
              <input
                type="text"
                value={faq.question}
                onChange={(e) => updateFaq(index, 'question', e.target.value)}
                placeholder="Question"
                className="block flex-1 rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button type="button" onClick={() => removeFaq(index)} className="text-red-600 hover:text-red-700">
                ✕
              </button>
            </div>
            <textarea
              value={faq.answer}
              onChange={(e) => updateFaq(index, 'answer', e.target.value)}
              placeholder="Answer"
              rows={2}
              className="block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
    )
  }

  if (faqs.length === 0) return null

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      {title && <h3 className="mb-1 text-lg font-semibold text-gray-900">{title}</h3>}
      {subtitle && <p className="mb-4 text-sm text-gray-600">{subtitle}</p>}
      <div className="divide-y divide-gray-200">
        {faqs.map((faq, index) => (
          <div key={index} className="py-3">
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
              <span className="ml-2 text-gray-500">{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
