'use client'

import { useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import {
  QR_TYPES,
  QRCodeTypeDefinition,
} from '@/lib/constants/qr-types'

interface QRCodeTypeSelectorProps {
  value: string
  onChange: (type: string) => void
  disabledTypes?: string[]
  showSearch?: boolean
}

/**
 * QRCodeTypeSelector — Bento grid layout replicating the original
 * Lit Element project's qrcg-qrcode-type-selector.
 *
 * Layout:
 * - Header with "Create QR Code" gradient title + search bar
 * - 2-column bento grid for first 16 types:
 *   Each column (left 0-7, right 8-15) has 3 rows:
 *     Row 1: Full-width card
 *     Row 2: [tall card] + [stacked: card + 2:1 social icons grid]
 *     Row 3: [card] + [1:2 social icons grid]
 * - "View More" button reveals remaining types in a responsive grid
 */
export function QRCodeTypeSelector({
  value,
  onChange,
  disabledTypes = [],
  showSearch = true,
}: QRCodeTypeSelectorProps) {
  const [keyword, setKeyword] = useState('')
  const [showMore, setShowMore] = useState(false)

  const filteredTypes = useMemo(() => {
    if (!keyword.trim()) return QR_TYPES
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = new RegExp(escaped, 'i')
    return QR_TYPES.filter(
      (type) => pattern.test(type.name) || pattern.test(type.id)
    )
  }, [keyword])

  const isTypeDisabled = useCallback(
    (id: string) => disabledTypes.includes(id),
    [disabledTypes]
  )

  const handleTypeClick = useCallback(
    (typeId: string) => {
      if (!isTypeDisabled(typeId)) {
        onChange(typeId)
      }
    },
    [onChange, isTypeDisabled]
  )

  // First 16 types for the bento grid
  const bentoTypes = filteredTypes.slice(0, 16)
  const extraTypes = filteredTypes.slice(16)

  // Split bento types into left (0-7) and right (8-15) columns
  const leftTypes = bentoTypes.slice(0, 8)
  const rightTypes = bentoTypes.slice(8, 16)

  return (
    <div className="w-full">
      {/* ── Search Box Header ──────────────────────────────── */}
      {showSearch && (
        <div className="flex flex-col md:flex-row flex-wrap justify-between items-center mb-8 gap-4">
          {/* Spacer for centering (hidden below xl) */}
          <div className="flex-1 hidden xl:block" />

          {/* Gradient Title */}
          <div className="flex-1 flex justify-center">
            <h1
              className="text-2xl md:text-4xl font-semibold"
              style={{
                background:
                  'linear-gradient(90.77deg, #b048b0 9.76%, #a550b9 31.16%, #8073e0 98.02%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              Create QR Code
            </h1>
          </div>

          {/* Search Input */}
          <div className="flex-1 flex justify-center md:justify-end w-full md:w-auto">
            <div className="flex items-center bg-white rounded-xl px-4 py-2 border border-purple-500 gap-2 w-full max-w-[280px]">
              <input
                type="text"
                placeholder="Search..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1 outline-none text-sm bg-transparent text-gray-700 placeholder:text-gray-400"
              />
              <Search className="w-5 h-5 text-purple-500 flex-shrink-0" />
            </div>
          </div>
        </div>
      )}

      {/* ── Bento Grid — 2 columns ────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <BentoColumn
          types={leftTypes}
          selectedType={value}
          onTypeClick={handleTypeClick}
          isTypeDisabled={isTypeDisabled}
        />

        {/* Right Column */}
        <BentoColumn
          types={rightTypes}
          selectedType={value}
          onTypeClick={handleTypeClick}
          isTypeDisabled={isTypeDisabled}
        />
      </div>

      {/* ── View More Section ──────────────────────────────── */}
      {extraTypes.length > 0 && (
        <>
          {showMore && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
              {extraTypes.map((type) => (
                <TypeCard
                  key={type.id}
                  type={type}
                  isSelected={type.id === value}
                  isDisabled={isTypeDisabled(type.id)}
                  onClick={() => handleTypeClick(type.id)}
                />
              ))}
            </div>
          )}

          <div className="flex justify-center my-10">
            <button
              onClick={() => setShowMore(!showMore)}
              className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full text-white font-normal text-base cursor-pointer border-none"
              style={{
                background: 'linear-gradient(to bottom, #c084fc, #8b5cf6)',
                width: '180px',
                height: '40px',
              }}
            >
              {showMore ? 'View Less' : 'View More'}
              {showMore ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * Bento Column
 * ═══════════════════════════════════════════════════════════════════════════ */

interface BentoColumnProps {
  types: QRCodeTypeDefinition[]
  selectedType: string
  onTypeClick: (typeId: string) => void
  isTypeDisabled: (typeId: string) => boolean
}

/**
 * One column of the bento grid (8 types max):
 *   Row 1 [0]:     Full-width card
 *   Row 2 [1-4]:   [Tall card] + [card + social_first(2fr 1fr)]
 *   Row 3 [5-7]:   [Card]       + [social_second(1fr 2fr)]
 */
function BentoColumn({
  types,
  selectedType,
  onTypeClick,
  isTypeDisabled,
}: BentoColumnProps) {
  if (types.length === 0) return null

  // Assign to local consts so TypeScript can narrow properly
  const t0 = types[0]
  const t1 = types[1]
  const t2 = types[2]
  const t3 = types[3]
  const t4 = types[4]
  const t5 = types[5]
  const t6 = types[6]
  const t7 = types[7]

  return (
    <div className="flex flex-col gap-2">
      {/* ── Row 1 — Full-width card (index 0) ────────────── */}
      {t0 && (
        <TypeCard
          type={t0}
          isSelected={t0.id === selectedType}
          isDisabled={isTypeDisabled(t0.id)}
          onClick={() => onTypeClick(t0.id)}
        />
      )}

      {/* ── Row 2 — Tall card + stacked ──────────────────── */}
      {types.length > 1 && (
        <div className="grid grid-cols-2 gap-2">
          {/* Left: Tall card (163px height) */}
          {t1 && (
            <TallCard
              type={t1}
              isSelected={t1.id === selectedType}
              isDisabled={isTypeDisabled(t1.id)}
              onClick={() => onTypeClick(t1.id)}
            />
          )}

          {/* Right: Stacked — regular card + 2:1 social icons */}
          <div className="flex flex-col gap-2">
            {t2 && (
              <TypeCard
                type={t2}
                isSelected={t2.id === selectedType}
                isDisabled={isTypeDisabled(t2.id)}
                onClick={() => onTypeClick(t2.id)}
              />
            )}

            {/* social_first_container: grid-template-columns: 2fr 1fr */}
            <div className="grid gap-2" style={{ gridTemplateColumns: '2fr 1fr' }}>
              {t3 && (
                <SocialIconCard
                  type={t3}
                  isSelected={t3.id === selectedType}
                  isDisabled={isTypeDisabled(t3.id)}
                  onClick={() => onTypeClick(t3.id)}
                />
              )}
              {t4 && (
                <SocialIconCard
                  type={t4}
                  isSelected={t4.id === selectedType}
                  isDisabled={isTypeDisabled(t4.id)}
                  onClick={() => onTypeClick(t4.id)}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Row 3 — Card + social_second_container ────────── */}
      {types.length > 5 && (
        <div className="grid grid-cols-2 gap-2">
          {/* Left: Regular card */}
          {t5 && (
            <TypeCard
              type={t5}
              isSelected={t5.id === selectedType}
              isDisabled={isTypeDisabled(t5.id)}
              onClick={() => onTypeClick(t5.id)}
            />
          )}

          {/* Right: social_second_container: grid-template-columns: 1fr 2fr */}
          <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 2fr' }}>
            {t6 && (
              <SocialIconCard
                type={t6}
                isSelected={t6.id === selectedType}
                isDisabled={isTypeDisabled(t6.id)}
                onClick={() => onTypeClick(t6.id)}
              />
            )}
            {t7 && (
              <SocialIconCard
                type={t7}
                isSelected={t7.id === selectedType}
                isDisabled={isTypeDisabled(t7.id)}
                onClick={() => onTypeClick(t7.id)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * Card Components
 * ═══════════════════════════════════════════════════════════════════════════ */

interface TypeCardProps {
  type: QRCodeTypeDefinition
  isSelected: boolean
  isDisabled: boolean
  onClick: () => void
  variant?: 'default' | 'item5'
}

/**
 * Standard type card — icon + name + right chevron.
 * Matches original `.card` styles.
 */
function TypeCard({
  type,
  isSelected,
  isDisabled,
  onClick,
}: TypeCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={`
        flex items-center justify-between
        rounded-[20px] px-3 py-3
        cursor-pointer select-none
        transition-all duration-200 ease-in-out
        hover:-translate-y-0.5
        ${isSelected ? 'ring-2 ring-purple-600' : ''}
        ${isDisabled ? 'opacity-50 pointer-events-none' : ''}
      `}
      style={{
        background: 'linear-gradient(90deg, #fff 0%, #f6f6f6 100%)',
        boxShadow:
          '0 4px 4px 0 rgba(0,0,0,0), 0 -4px 11px 0 #d5d5d5, 0 4px 4px 0 #cecece',
      }}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <Image
            src={type.icon}
            alt={type.name}
            width={32}
            height={32}
            className="object-contain"
            unoptimized
          />
        </div>
        <span className="text-sm font-medium text-[#2b2b2b]">{type.name}</span>
      </div>
      <Image
        src="/icons/qr-types/rightShevronIcon.svg"
        alt=""
        width={18}
        height={18}
        className="flex-shrink-0"
        unoptimized
      />
    </div>
  )
}

interface TallCardProps {
  type: QRCodeTypeDefinition
  isSelected: boolean
  isDisabled: boolean
  onClick: () => void
}

/**
 * Tall card (.item1) — 163px height, used in Row 2 left slot.
 */
function TallCard({ type, isSelected, isDisabled, onClick }: TallCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={`
        flex items-center justify-between
        rounded-[20px] px-3 py-3
        cursor-pointer select-none
        transition-all duration-200 ease-in-out
        hover:-translate-y-0.5
        h-[163px]
        ${isSelected ? 'ring-2 ring-purple-600' : ''}
        ${isDisabled ? 'opacity-50 pointer-events-none' : ''}
      `}
      style={{
        background: 'linear-gradient(90deg, #fff 0%, #f6f6f6 100%)',
        boxShadow:
          '0 4px 4px 0 rgba(0,0,0,0), 0 -4px 11px 0 #d5d5d5, 0 4px 4px 0 #cecece',
      }}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-[50px] h-[50px] flex items-center justify-center flex-shrink-0">
          <Image
            src={type.icon}
            alt={type.name}
            width={50}
            height={50}
            className="object-contain"
            unoptimized
          />
        </div>
        <span className="text-sm font-medium text-[#2b2b2b]">{type.name}</span>
      </div>
      <Image
        src="/icons/qr-types/rightShevronIcon.svg"
        alt=""
        width={18}
        height={18}
        className="flex-shrink-0"
        unoptimized
      />
    </div>
  )
}

interface SocialIconCardProps {
  type: QRCodeTypeDefinition
  isSelected: boolean
  isDisabled: boolean
  onClick: () => void
}

/**
 * Social icon card — icon-only, no text label.
 * Used in the 2:1 / 1:2 sub-grids of the bento layout.
 * Matches original `.social_icon_container` styles.
 */
function SocialIconCard({
  type,
  isSelected,
  isDisabled,
  onClick,
}: SocialIconCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={`
        flex items-center justify-center
        rounded-2xl px-3 py-3
        cursor-pointer select-none
        transition-all duration-200 ease-in-out
        hover:-translate-y-0.5
        min-h-[48px]
        ${isSelected ? 'ring-2 ring-purple-600' : ''}
        ${isDisabled ? 'opacity-50 pointer-events-none' : ''}
      `}
      style={{
        background: 'linear-gradient(to right, #ffffff, #f9f8fc)',
        boxShadow:
          '0 4px 4px 0 rgba(0,0,0,0), 0 -4px 11px 0 #d5d5d5, 0 4px 4px 0 #cecece',
      }}
    >
      <div className="w-[47px] h-[47px] flex items-center justify-center">
        <Image
          src={type.icon}
          alt={type.name}
          width={47}
          height={47}
          className="object-contain"
          unoptimized
        />
      </div>
    </div>
  )
}
