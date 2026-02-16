"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  featuredTypes,
  standardTypes,
  communicationTypes,
  advancedTypes,
  callTypes,
  paymentTypes,
  extendedTypes,
  type QRCodeType,
} from "@/data/qr-types";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ── QR Type Card Component ──────────────────────────────────────────
function QRTypeCard({
  type,
  onClick,
}: {
  type: QRCodeType;
  onClick: () => void;
}) {
  const isIconOnly = type.cardSize === "icon-only";
  const isWide = type.cardSize === "wide";
  const isTall = type.cardSize === "tall";

  // Icon-only squared card (social media branded icons)
  if (isIconOnly && type.brandedIcon) {
    return (
      <button
        onClick={onClick}
        className="group relative flex items-center justify-center rounded-2xl bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 dark:bg-gray-800 aspect-square"
        title={type.name}
      >
        <Image
          src={type.brandedIcon}
          alt={type.name}
          width={36}
          height={36}
          className="rounded-lg"
        />
      </button>
    );
  }

  // Wide card (featured items like URL/LINK and VCard)
  if (isWide) {
    return (
      <button
        onClick={onClick}
        className="group flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.99] dark:bg-gray-800"
      >
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ background: "rgba(175, 71, 175, 0.1)" }}
        >
          <type.icon
            className="h-5 w-5"
            style={{ color: "var(--karsaaz-primary)" }}
          />
        </div>
        <span className="flex-1 text-left text-sm font-semibold text-gray-800 dark:text-gray-100 uppercase tracking-wide">
          {type.name}
        </span>
        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[var(--karsaaz-primary)] transition-colors" />
      </button>
    );
  }

  // Tall card (Restaurant Menu with preview placeholder)
  if (isTall) {
    return (
      <button
        onClick={onClick}
        className="group flex flex-col rounded-2xl bg-white shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.99] dark:bg-gray-800 row-span-2"
      >
        <div className="flex items-center gap-3 px-4 pt-4 pb-2">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "rgba(175, 71, 175, 0.1)" }}
          >
            <type.icon
              className="h-4 w-4"
              style={{ color: "var(--karsaaz-primary)" }}
            />
          </div>
          <span className="flex-1 text-left text-sm font-semibold text-gray-800 dark:text-gray-100">
            {type.name}
          </span>
          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[var(--karsaaz-primary)] transition-colors" />
        </div>
        <div className="flex-1 flex items-center justify-center px-4 pb-4">
          <div className="w-full h-full min-h-[80px] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
            <type.icon className="h-10 w-10 text-gray-300 dark:text-gray-500" />
          </div>
        </div>
      </button>
    );
  }

  // Standard card (default)
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.99] dark:bg-gray-800"
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: "rgba(175, 71, 175, 0.1)" }}
      >
        {type.brandedIcon ? (
          <Image
            src={type.brandedIcon}
            alt={type.name}
            width={20}
            height={20}
            className="rounded"
          />
        ) : (
          <type.icon
            className="h-4 w-4"
            style={{ color: "var(--karsaaz-primary)" }}
          />
        )}
      </div>
      <span className="flex-1 text-left text-sm font-medium text-gray-800 dark:text-gray-100">
        {type.name}
      </span>
      {type.isPremium && (
        <span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-full dark:bg-purple-900/30 dark:text-purple-400">
          +
        </span>
      )}
      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[var(--karsaaz-primary)] transition-colors" />
    </button>
  );
}

// ── Mixed Grid Row Component ────────────────────────────────────────
function QRTypeRow({
  types,
  onSelect,
}: {
  types: QRCodeType[];
  onSelect: (id: string) => void;
}) {
  // Determine grid layout based on card sizes in this row
  const hasWide = types.some((t) => t.cardSize === "wide");
  const hasIconOnly = types.some((t) => t.cardSize === "icon-only");
  const hasTall = types.some((t) => t.cardSize === "tall");

  if (hasWide) {
    // Row with wide cards: 2 columns
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {types.map((type) => (
          <QRTypeCard
            key={type.id}
            type={type}
            onClick={() => onSelect(type.id)}
          />
        ))}
      </div>
    );
  }

  if (hasTall || hasIconOnly) {
    // Mixed row: standard + icon-only cards
    const standardCards = types.filter(
      (t) => t.cardSize !== "icon-only"
    );
    const iconCards = types.filter((t) => t.cardSize === "icon-only");

    return (
      <div className="flex flex-wrap gap-3">
        {standardCards.map((type) => (
          <div key={type.id} className={cn(
            "flex-1 min-w-[160px]",
            type.cardSize === "tall" && "row-span-2 min-w-[160px]"
          )}>
            <QRTypeCard
              type={type}
              onClick={() => onSelect(type.id)}
            />
          </div>
        ))}
        {iconCards.map((type) => (
          <div key={type.id} className="w-[52px]">
            <QRTypeCard
              type={type}
              onClick={() => onSelect(type.id)}
            />
          </div>
        ))}
      </div>
    );
  }

  // Default: uniform grid
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {types.map((type) => (
        <QRTypeCard
          key={type.id}
          type={type}
          onClick={() => onSelect(type.id)}
        />
      ))}
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────
export default function CreateQRCodePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showMore, setShowMore] = useState(false);

  const handleSelect = (id: string) => {
    router.push(`/dashboard/qrcodes/new/${id}`);
  };

  // All main types flattened for search
  const allMainTypes = useMemo(
    () => [
      ...featuredTypes,
      ...standardTypes,
      ...communicationTypes,
      ...advancedTypes,
      ...callTypes,
      ...paymentTypes,
    ],
    []
  );

  const allTypes = useMemo(
    () => [...allMainTypes, ...extendedTypes],
    [allMainTypes]
  );

  // Search filtering
  const isSearching = search.trim().length > 0;
  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return allTypes.filter((type) =>
      type.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, isSearching, allTypes]);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Create QR Code
        </h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            className="pl-9 rounded-xl border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {isSearching ? (
        /* ── Search Results ── */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {searchResults.length > 0 ? (
            searchResults.map((type) => (
              <QRTypeCard
                key={type.id}
                type={{ ...type, cardSize: "standard" }}
                onClick={() => handleSelect(type.id)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No QR types found for &ldquo;{search}&rdquo;
            </div>
          )}
        </div>
      ) : (
        /* ── Figma Grid Layout ── */
        <div className="space-y-3">
          {/* Row 1: Featured (wide cards) */}
          <QRTypeRow types={featuredTypes} onSelect={handleSelect} />

          {/* Row 2: Standard types */}
          <QRTypeRow types={standardTypes} onSelect={handleSelect} />

          {/* Row 3: Communication types (email + social icons) */}
          <QRTypeRow types={communicationTypes} onSelect={handleSelect} />

          {/* Row 4: Advanced types */}
          <QRTypeRow types={advancedTypes} onSelect={handleSelect} />

          {/* Row 5: Call types */}
          <QRTypeRow types={callTypes} onSelect={handleSelect} />

          {/* Row 6: Payment types */}
          <QRTypeRow types={paymentTypes} onSelect={handleSelect} />

          {/* Extended types (View More) */}
          {showMore && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
              {extendedTypes.map((type) => (
                <QRTypeCard
                  key={type.id}
                  type={{ ...type, cardSize: "standard" }}
                  onClick={() => handleSelect(type.id)}
                />
              ))}
            </div>
          )}

          {/* View More Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setShowMore(!showMore)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-2"
              style={{
                borderColor: "var(--karsaaz-primary)",
                color: "var(--karsaaz-primary)",
              }}
            >
              {showMore ? "View Less" : "View More"}
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  showMore && "rotate-180"
                )}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
