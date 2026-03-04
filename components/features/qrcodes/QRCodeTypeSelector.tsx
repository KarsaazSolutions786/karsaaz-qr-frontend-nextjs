'use client'

import { useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { Search, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { QR_TYPES, QRCodeTypeDefinition } from '@/lib/constants/qr-types'
import { filterQrTypes } from '@/lib/constants/qr-type-categories'

/* ═══════════════════════════════════════════════════════════════════════════════
 * Card layout configuration — Figma bento grid (node 3115-4301)
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Wide cards spanning half the grid (col-span-4 on 8-col desktop) */
const WIDE_TYPES = new Set(['text', 'vcard', 'paypal', 'viber'])

/** Tall card spanning 2 rows */
const TALL_TYPES = new Set(['restaurant-menu'])

/** Icon-only compact cards — centered icon, no text, no chevron */
const ICON_ONLY_TYPES = new Set([
  'whatsapp',
  'telegram',
  'youtube',
  'facebook',
  'sms',
  'linkedin',
  'instagram',
  'spotify',
])

/** Compact cards — icon + chevron, no text label */
const COMPACT_CHEVRON_TYPES = new Set(['call', 'facebookmessenger', 'x', 'snapchat'])

/** Display order matching the Figma bento grid layout */
const FIGMA_DISPLAY_ORDER = [
  'text',
  'vcard',
  'url',
  'business-profile',
  'restaurant-menu',
  'vcard-plus',
  'email',
  'whatsapp',
  'telegram',
  'youtube',
  'facebook',
  'facetime',
  'call',
  'sms',
  'product-catalogue',
  'facebookmessenger',
  'linkedin',
  'paypal',
  'viber',
  'crypto',
  'x',
  'instagram',
  'brazilpix',
  'snapchat',
  'spotify',
]

/** Number of types shown before "View More" */
const INITIAL_VISIBLE = 26

const CARD_BG = 'linear-gradient(180deg, #fff 0%, #f9f9f9 100%)'
const CARD_SHADOW =
  '0px 3.57px 5.35px 0px rgba(0,0,0,0.02), 0px -1.78px 8.92px 0px rgba(0,0,0,0.01)'

/* ═══════════════════════════════════════════════════════════════════════════════
 * Props
 * ═══════════════════════════════════════════════════════════════════════════ */

interface QRCodeTypeSelectorProps {
  value: string
  onChange: (type: string) => void
  disabledTypes?: string[]
  showSearch?: boolean
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * Main Component
 * ═══════════════════════════════════════════════════════════════════════════ */

export function QRCodeTypeSelector({
  value,
  onChange,
  disabledTypes = [],
  showSearch = true,
}: QRCodeTypeSelectorProps) {
  const [keyword, setKeyword] = useState('')
  const [showMore, setShowMore] = useState(false)

  const filteredTypes = useMemo(() => {
    const types = filterQrTypes(QR_TYPES, 'all', keyword)
    if (keyword.trim()) return types
    const orderMap = new Map(FIGMA_DISPLAY_ORDER.map((id, i) => [id, i]))
    return [...types].sort((a, b) => {
      const ai = orderMap.get(a.id) ?? 999
      const bi = orderMap.get(b.id) ?? 999
      return ai - bi
    })
  }, [keyword])

  const visibleTypes = useMemo(
    () => (keyword.trim() || showMore ? filteredTypes : filteredTypes.slice(0, INITIAL_VISIBLE)),
    [filteredTypes, showMore, keyword]
  )

  const hasMore = !keyword.trim() && filteredTypes.length > INITIAL_VISIBLE

  const isTypeDisabled = useCallback((id: string) => disabledTypes.includes(id), [disabledTypes])

  const handleTypeClick = useCallback(
    (typeId: string) => {
      if (!isTypeDisabled(typeId)) onChange(typeId)
    },
    [onChange, isTypeDisabled]
  )

  return (
    <div className="w-full max-w-5xl mx-auto">
      {showSearch && <SelectorHeader keyword={keyword} onKeywordChange={setKeyword} />}

      {filteredTypes.length === 0 ? (
        <EmptyState keyword={keyword} />
      ) : (
        <>
          <BentoGrid
            types={visibleTypes}
            selectedType={value}
            onTypeClick={handleTypeClick}
            isTypeDisabled={isTypeDisabled}
          />

          {hasMore && (
            <div className="flex justify-center mt-8 mb-4">
              <button
                onClick={() => setShowMore(!showMore)}
                className="inline-flex items-center justify-center
                  font-medium rounded-full bg-white
                  hover:bg-purple-50 transition-all duration-200"
                style={{
                  border: '0.71px solid #AD46FF',
                  color: '#834BEB',
                  gap: 13,
                  padding: '7px 24px',
                  fontSize: 14,
                }}
              >
                {showMore ? 'View Less' : 'View More'}
                {showMore ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * SelectorHeader — Inter title + glass-morphism search (Figma match)
 * ═══════════════════════════════════════════════════════════════════════════ */

function SelectorHeader({
  keyword,
  onKeywordChange,
}: {
  keyword: string
  onKeywordChange: (v: string) => void
}) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
      <h1
        className="font-extrabold"
        style={{ color: '#595959', fontFamily: 'Inter, sans-serif', fontSize: 32 }}
      >
        Create QR Code
      </h1>

      <div
        className="flex items-center px-4 gap-3"
        style={{
          background:
            'linear-gradient(130deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.8) 100%)',
          border: '1.45px solid rgba(211,187,255,1)',
          borderRadius: 14,
          boxShadow: '0px 1.93px 19.32px 0px rgba(188,192,204,0.25)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          height: 47,
          width: 292,
        }}
      >
        <Search className="h-4 w-4 text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search"
          value={keyword}
          onChange={e => onKeywordChange(e.target.value)}
          className="flex-1 text-sm bg-transparent
            text-gray-700 placeholder:text-gray-400
            focus:outline-none"
        />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * BentoGrid — 8-column CSS Grid with varied card spans
 * ═══════════════════════════════════════════════════════════════════════════ */

function BentoGrid({
  types,
  selectedType,
  onTypeClick,
  isTypeDisabled,
}: {
  types: QRCodeTypeDefinition[]
  selectedType: string
  onTypeClick: (id: string) => void
  isTypeDisabled: (id: string) => boolean
}) {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3"
      style={{ gridAutoFlow: 'dense', gridAutoRows: '86px' }}
      role="listbox"
      aria-label="QR code types"
    >
      <AnimatePresence mode="popLayout">
        {types.map((type, i) => {
          const isWide = WIDE_TYPES.has(type.id)
          const isTall = TALL_TYPES.has(type.id)
          const isIconOnly = ICON_ONLY_TYPES.has(type.id)
          const isCompact = COMPACT_CHEVRON_TYPES.has(type.id)
          const isStandard = !isWide && !isTall && !isIconOnly && !isCompact

          return (
            <motion.div
              key={type.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.25,
                delay: Math.min(i * 0.02, 0.25),
                ease: 'easeOut',
              }}
              className={
                [
                  isWide ? 'col-span-2 lg:col-span-4' : '',
                  isStandard || isTall ? 'lg:col-span-2' : '',
                  isTall ? 'row-span-2' : '',
                ]
                  .filter(Boolean)
                  .join(' ') || undefined
              }
            >
              {isIconOnly ? (
                <IconOnlyCard
                  type={type}
                  isSelected={type.id === selectedType}
                  isDisabled={isTypeDisabled(type.id)}
                  onClick={() => onTypeClick(type.id)}
                />
              ) : isCompact ? (
                <CompactChevronCard
                  type={type}
                  isSelected={type.id === selectedType}
                  isDisabled={isTypeDisabled(type.id)}
                  onClick={() => onTypeClick(type.id)}
                />
              ) : isTall ? (
                <TallCard
                  type={type}
                  isSelected={type.id === selectedType}
                  isDisabled={isTypeDisabled(type.id)}
                  onClick={() => onTypeClick(type.id)}
                />
              ) : (
                <StandardCard
                  type={type}
                  isSelected={type.id === selectedType}
                  isDisabled={isTypeDisabled(type.id)}
                  onClick={() => onTypeClick(type.id)}
                />
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * Shared card helpers
 * ═══════════════════════════════════════════════════════════════════════════ */

interface CardProps {
  type: QRCodeTypeDefinition
  isSelected: boolean
  isDisabled: boolean
  onClick: () => void
}

const cardBase = (isDisabled: boolean) =>
  `group cursor-pointer select-none transition-all duration-200 ease-out
   hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500
   ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`

const cardStyle = (isSelected: boolean, bg: string = CARD_BG) => ({
  background: bg,
  borderRadius: 14,
  boxShadow: CARD_SHADOW,
  border: isSelected ? '2px dashed #a855f7' : '2px solid transparent',
})

/* ═══════════════════════════════════════════════════════════════════════════════
 * StandardCard — icon + name + purple chevron (wide & standard cards)
 * ═══════════════════════════════════════════════════════════════════════════ */

function StandardCard({ type, isSelected, isDisabled, onClick }: CardProps) {
  return (
    <div
      role="option"
      aria-selected={isSelected}
      tabIndex={isDisabled ? -1 : 0}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className={`flex items-center gap-3 h-full px-3 ${cardBase(isDisabled)}`}
      style={cardStyle(isSelected)}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0">
        <Image
          src={type.icon}
          alt=""
          width={40}
          height={40}
          className="object-contain"
          unoptimized
        />
      </div>

      <p
        className="flex-1 font-normal truncate"
        style={{ color: '#36454f', fontSize: 17, fontFamily: 'Inter, sans-serif' }}
      >
        {type.name}
      </p>

      <ChevronRight className="h-[18px] w-[10px] shrink-0" style={{ color: '#ae83f9' }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * IconOnlyCard — social media compact card (icon only, no label)
 * ═══════════════════════════════════════════════════════════════════════════ */

function IconOnlyCard({ type, isSelected, isDisabled, onClick }: CardProps) {
  return (
    <div
      role="option"
      aria-selected={isSelected}
      tabIndex={isDisabled ? -1 : 0}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className={`flex items-center justify-center h-full ${cardBase(isDisabled)}`}
      style={cardStyle(isSelected)}
      title={type.name}
    >
      <Image
        src={type.icon}
        alt={type.name}
        width={49}
        height={49}
        className="object-contain"
        unoptimized
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * CompactChevronCard — icon + chevron, no text (call, messenger, x, snapchat)
 * ═══════════════════════════════════════════════════════════════════════════ */

function CompactChevronCard({ type, isSelected, isDisabled, onClick }: CardProps) {
  return (
    <div
      role="option"
      aria-selected={isSelected}
      tabIndex={isDisabled ? -1 : 0}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className={`flex items-center justify-between h-full px-4 ${cardBase(isDisabled)}`}
      style={cardStyle(isSelected)}
      title={type.name}
    >
      <Image
        src={type.icon}
        alt={type.name}
        width={49}
        height={49}
        className="object-contain"
        unoptimized
      />
      <ChevronRight className="h-[18px] w-[10px] shrink-0" style={{ color: '#ae83f9' }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * TallCard — restaurant menu / preview card (spans 2 rows)
 * ═══════════════════════════════════════════════════════════════════════════ */

function TallCard({ type, isSelected, isDisabled, onClick }: CardProps) {
  return (
    <div
      role="option"
      aria-selected={isSelected}
      tabIndex={isDisabled ? -1 : 0}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className={`flex flex-col h-full p-3 ${cardBase(isDisabled)}`}
      style={cardStyle(isSelected)}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0">
          <Image
            src={type.icon}
            alt=""
            width={40}
            height={40}
            className="object-contain"
            unoptimized
          />
        </div>
        <p
          className="flex-1 font-normal truncate"
          style={{ color: '#36454f', fontSize: 17, fontFamily: 'Inter, sans-serif' }}
        >
          {type.name}
        </p>
        <ChevronRight className="h-[18px] w-[10px] shrink-0" style={{ color: '#ae83f9' }} />
      </div>

      {/* Preview area — restaurant menu cards */}
      <div className="mt-2 flex gap-2 flex-1 min-h-0">
        <div
          className="flex-1 rounded-lg overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #8B7355 0%, #6B5842 100%)', opacity: 0.7 }}
        />
        <div
          className="flex-1 rounded-lg overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #7B6548 0%, #5E4A36 100%)', opacity: 0.5 }}
        />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * EmptyState
 * ═══════════════════════════════════════════════════════════════════════════ */

function EmptyState({ keyword }: { keyword: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <Search className="h-7 w-7 text-gray-400" />
      </div>
      <p className="text-lg font-medium text-gray-700">No QR types found</p>
      <p className="mt-1 text-sm text-gray-500 max-w-xs">
        {keyword.trim() ? `No results for "${keyword}"` : 'No types available'}
      </p>
    </div>
  )
}
