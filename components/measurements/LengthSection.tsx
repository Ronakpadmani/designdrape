"use client";

import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  GARMENT_LENGTH_PRESETS,
  countFilledGarmentLengths,
  type GarmentLengthKey,
  type GarmentLengths,
} from "@/types";

type LengthSectionProps = {
  garmentLengths: GarmentLengths;
  onChange: (key: keyof GarmentLengths, value: string) => void;
  defaultOpen?: boolean;
};

export default function LengthSection({
  garmentLengths,
  onChange,
  defaultOpen = false,
}: LengthSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const filledCount = countFilledGarmentLengths(garmentLengths);

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors text-left"
      >
        <div>
          <h3 className="text-xs uppercase tracking-[0.25em] text-[#C9A84C]">
            Length
            {filledCount > 0 && (
              <span className="text-white/40 normal-case tracking-normal ml-2">
                ({filledCount} filled)
              </span>
            )}
          </h3>
          <p className="text-white/35 text-sm mt-1">
            Click to add garment lengths — fill only what you need.
          </p>
        </div>
        {open ? (
          <FaChevronUp className="text-[#C9A84C] shrink-0" size={14} />
        ) : (
          <FaChevronDown className="text-white/40 shrink-0" size={14} />
        )}
      </button>

      {open && (
        <div className="px-5 pb-5 pt-2 space-y-4 border-t border-white/[0.06]">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GARMENT_LENGTH_PRESETS.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                  {label}
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder={placeholder}
                  value={garmentLengths[key as GarmentLengthKey] || ""}
                  onChange={(e) => onChange(key, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/[0.06]">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3">
              Other garment
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-white/35 mb-2">
                  Garment name
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Sharara, Choli…"
                  value={garmentLengths.otherName || ""}
                  onChange={(e) => onChange("otherName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-white/35 mb-2">
                  Length
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder='e.g. 38"'
                  value={garmentLengths.otherValue || ""}
                  onChange={(e) => onChange("otherValue", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
