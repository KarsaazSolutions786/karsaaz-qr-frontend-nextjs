"use client";

import { useQRWizard, type QRType } from "@/store/use-qr-wizard";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
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

/* ── All visible types (before "View More") ── */
const mainTypes = [
  ...featuredTypes,
  ...standardTypes,
  ...communicationTypes,
  ...advancedTypes,
  ...callTypes,
  ...paymentTypes,
];

export default function TypeSelection() {
  const { qrType, setQRType } = useQRWizard();
  const [search, setSearch] = useState("");
  const [showMore, setShowMore] = useState(false);

  const handleSelect = (type: QRCodeType) => {
    setQRType(type.id as QRType);
  };

  /* ── Filter logic ── */
  const filterTypes = (types: QRCodeType[]) =>
    search.trim()
      ? types.filter((t) =>
          t.name.toLowerCase().includes(search.toLowerCase())
        )
      : types;

  const filteredMain = filterTypes(mainTypes);
  const filteredExtended = filterTypes(extendedTypes);

  return (
    <div className="qr-create-page">
      {/* ── Header ── */}
      <div className="qr-create-header">
        <h1 className="qr-create-title">Create QR Code</h1>
        <div className="qr-create-search">
          <Search className="qr-create-search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="qr-create-search-input"
          />
        </div>
      </div>

      {/* ── QR Type Grid ── */}
      <div className="qr-grid">
        {filteredMain.map((type) => (
          <QRTypeCard
            key={type.id}
            type={type}
            isSelected={qrType === type.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* ── Extended types (View More) ── */}
      {filteredExtended.length > 0 && (
        <>
          {showMore && (
            <div className="qr-grid qr-grid--extended">
              {filteredExtended.map((type) => (
                <QRTypeCard
                  key={type.id}
                  type={type}
                  isSelected={qrType === type.id}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )}

          <button
            className="qr-view-more-btn"
            onClick={() => setShowMore(!showMore)}
          >
            <span>View {showMore ? "Less" : "More"}</span>
            <ChevronDown
              className={cn("qr-view-more-icon", showMore && "qr-view-more-icon--open")}
            />
          </button>
        </>
      )}
    </div>
  );
}

/* ── QR Type Card Component ── */
function QRTypeCard({
  type,
  isSelected,
  onSelect,
}: {
  type: QRCodeType;
  isSelected: boolean;
  onSelect: (type: QRCodeType) => void;
}) {
  const Icon = type.icon;
  const size = type.cardSize || "standard";

  /* Icon-only cards (branded social media icons) */
  if (size === "icon-only") {
    return (
      <button
        onClick={() => onSelect(type)}
        className={cn("qr-card qr-card--icon-only", isSelected && "qr-card--selected")}
        title={type.name}
      >
        {type.brandedIcon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={type.brandedIcon} alt={type.name} className="qr-card-branded-icon" />
        ) : (
          <div className="qr-card-icon-circle">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </button>
    );
  }

  /* Wide cards (URL/LINK, VCard) */
  if (size === "wide") {
    return (
      <button
        onClick={() => onSelect(type)}
        className={cn("qr-card qr-card--wide", isSelected && "qr-card--selected")}
      >
        <div className="qr-card-inner">
          <div className="qr-card-icon-circle">
            {type.brandedIcon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={type.brandedIcon} alt="" className="w-6 h-6 object-contain" />
            ) : (
              <Icon className="w-6 h-6" />
            )}
          </div>
          <span className="qr-card-label">{type.name}</span>
        </div>
        <ChevronRight className="qr-card-chevron" />
      </button>
    );
  }

  /* Tall cards (Restaurant Menu) */
  if (size === "tall") {
    return (
      <button
        onClick={() => onSelect(type)}
        className={cn("qr-card qr-card--tall", isSelected && "qr-card--selected")}
      >
        <div className="qr-card-inner">
          <div className="qr-card-icon-circle">
            {type.brandedIcon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={type.brandedIcon} alt="" className="w-6 h-6 object-contain" />
            ) : (
              <Icon className="w-6 h-6" />
            )}
          </div>
          <span className="qr-card-label">{type.name}</span>
        </div>
        <ChevronRight className="qr-card-chevron" />
      </button>
    );
  }

  /* Standard cards */
  return (
    <button
      onClick={() => onSelect(type)}
      className={cn("qr-card qr-card--standard", isSelected && "qr-card--selected")}
    >
      <div className="qr-card-inner">
        <div className="qr-card-icon-circle">
          {type.brandedIcon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={type.brandedIcon} alt="" className="w-6 h-6 object-contain" />
          ) : (
            <Icon className="w-6 h-6" />
          )}
        </div>
        <span className="qr-card-label">{type.name}</span>
      </div>
      <ChevronRight className="qr-card-chevron" />
    </button>
  );
}
