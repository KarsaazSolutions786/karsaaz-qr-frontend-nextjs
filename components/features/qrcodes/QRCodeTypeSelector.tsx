'use client'

import { useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { QR_TYPES, QRCodeTypeDefinition } from '@/lib/constants/qr-types'
import { filterQrTypes } from '@/lib/constants/qr-type-categories'

/* ═══════════════════════════════════════════════════════════════════════════════
 * Card layout configuration — Figma bento grid (node 3115:4301)
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
  'linkedin',
  'instagram',
  'spotify',
])

/** Compact cards — icon + chevron, no text label */
const COMPACT_CHEVRON_TYPES = new Set(['call', 'facebookmessenger', 'x', 'snapchat'])

/** SMS gets its own special icon-only treatment in the Figma */
const SMS_ICON_ONLY = new Set(['sms'])

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

/**
 * Icon background gradients — extracted from the Figma design.
 * These provide the colored circular/rounded backgrounds behind certain icons.
 */
const ICON_BG: Record<string, { bg: string; radius: number }> = {
  sms: { bg: 'linear-gradient(135deg, #8AB8FF 0%, #00B8DB 100%)', radius: 14 },
  x: { bg: 'linear-gradient(-45deg, #020202 0%, #070707 43%, #434343 100%)', radius: 14 },
  spotify: { bg: 'linear-gradient(135deg, #15CC64 0%, #097939 100%)', radius: 14 },
  email: { bg: 'linear-gradient(135deg, #2196F3 0%, #1798FF 100%)', radius: 11 },
  crypto: { bg: 'linear-gradient(135deg, #FFCE33 15%, #FF944D 85%)', radius: 14 },
  facetime: { bg: '#01CA51', radius: 6 },
  brazilpix: { bg: 'linear-gradient(135deg, #34CAB9 9%, #009F8E 91%)', radius: 14 },
  paypal: { bg: 'rgba(42,171,238,0.5)', radius: 14 },
  linkedin: { bg: 'linear-gradient(135deg, #128ECF 15%, #0472AC 85%)', radius: 14 },
}

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
                  font-medium hover:brightness-95 transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: '0.71px solid #AD46FF',
                  borderRadius: 8,
                  color: '#834BEB',
                  gap: 13,
                  padding: '7px 24px',
                  fontSize: 12,
                  boxShadow:
                    '0px -1.43px 7.85px 0px rgba(0,0,0,0.03), 0px 2.85px 5px 0px rgba(0,0,0,0.04)',
                }}
              >
                {showMore ? 'View Less' : 'View More'}
                {showMore ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * SelectorHeader — title + right-aligned glassmorphism search (Figma match)
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
        className="flex items-center px-5 gap-3"
        style={{
          background:
            'linear-gradient(91.46deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.8) 99.5%)',
          border: '1.45px solid #d3bbff',
          borderRadius: 11,
          boxShadow: '0px 1.93px 19.32px 0px rgba(188,192,204,0.25)',
          backdropFilter: 'blur(11px)',
          WebkitBackdropFilter: 'blur(11px)',
          height: 47,
          width: 292,
        }}
      >
        <Search className="h-5 w-5 shrink-0" style={{ color: '#36454f', opacity: 0.5 }} />
        <input
          type="text"
          placeholder="Search"
          value={keyword}
          onChange={e => onKeywordChange(e.target.value)}
          className="flex-1 text-sm bg-transparent
            text-gray-700 placeholder:text-gray-400
            focus:outline-none"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 17 }}
        />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * BentoGrid — CSS Grid with varied card spans
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
          const isIconOnly = ICON_ONLY_TYPES.has(type.id) || SMS_ICON_ONLY.has(type.id)
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
 * Shared card props & helpers
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

const cardStyle = (isSelected: boolean) => ({
  background: CARD_BG,
  borderRadius: 14,
  boxShadow: CARD_SHADOW,
  border: isSelected ? '1px solid rgba(173, 70, 255, 0.8)' : '1px solid transparent',
})

/** Renders an icon with optional colored background (Figma design) */
function TypeIcon({ type, size = 40 }: { type: QRCodeTypeDefinition; size?: number }) {
  const bgConfig = ICON_BG[type.id]

  if (bgConfig) {
    return (
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          background: bgConfig.bg,
          borderRadius: bgConfig.radius,
          width: 49,
          height: 49,
        }}
      >
        <Image
          src={type.icon}
          alt=""
          width={size * 0.7}
          height={size * 0.7}
          className="object-contain"
          unoptimized
        />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center shrink-0" style={{ width: 48, height: 48 }}>
      <Image
        src={type.icon}
        alt=""
        width={size}
        height={size}
        className="object-contain"
        unoptimized
      />
    </div>
  )
}

/** Chevron arrow matching Figma style */
function CardChevron() {
  return (
    <svg
      width="10"
      height="18"
      viewBox="0 0 10 18"
      fill="none"
      className="shrink-0"
      style={{ color: '#ae83f9' }}
    >
      <path
        d="M1 1L9 9L1 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * StandardCard — icon + name + purple chevron
 * ═══════════════════════════════════════════════════════════════════════════ */

function StandardCard({ type, isSelected, isDisabled, onClick }: CardProps) {
  const isVcardPlus = type.id === 'vcard-plus'

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
      <div className="relative">
        <TypeIcon type={type} />
        {isVcardPlus && (
          <span
            className="absolute -top-1 -left-1 flex items-center justify-center"
            style={{
              width: 31,
              height: 26,
              color: '#29C1E4',
              fontSize: 18,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            +
          </span>
        )}
      </div>

      <p
        className="flex-1 font-normal truncate"
        style={{ color: '#36454f', fontSize: 17, fontFamily: 'Inter, sans-serif' }}
      >
        {type.name}
      </p>

      <CardChevron />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * IconOnlyCard — social media compact card (icon only, no text, no chevron)
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
      <TypeIcon type={type} size={49} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * CompactChevronCard — icon + chevron, no text label (call, messenger, x, snapchat)
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
      <TypeIcon type={type} />
      <CardChevron />
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
      className={`flex flex-col h-full overflow-hidden ${cardBase(isDisabled)}`}
      style={cardStyle(isSelected)}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 px-3 pt-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0 opacity-70">
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
        <CardChevron />
      </div>

      {/* Preview area — rotated menu cards (Figma node 3115:4525) */}
      <div className="flex-1 flex items-center justify-center relative min-h-0 mt-1">
        <div
          className="rounded-md overflow-hidden opacity-50"
          style={{
            width: 78,
            height: 137,
            transform: 'rotate(-15deg)',
            position: 'absolute',
            left: '15%',
          }}
        >
          <Image
            src="/icons/qr-types/restaurant-menu-preview.png"
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div
          className="rounded-md overflow-hidden opacity-50"
          style={{
            width: 78,
            height: 137,
            transform: 'rotate(15deg)',
            position: 'absolute',
            right: '15%',
          }}
        >
          <Image
            src="/icons/qr-types/restaurant-menu-preview.png"
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: 'right center' }}
            unoptimized
          />
        </div>
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
