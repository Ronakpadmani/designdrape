export type Customer = {
  id: string;
  uid: string;
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
  notes?: string;
  role: string;
  createdAt?: Date;
  createdByAdmin?: boolean;
};

export type GarmentLengthKey =
  | "blouse"
  | "pant"
  | "kurti"
  | "lehenga"
  | "gown"
  | "shirt";

export type GarmentLengths = {
  blouse?: string;
  pant?: string;
  kurti?: string;
  lehenga?: string;
  gown?: string;
  shirt?: string;
  otherName?: string;
  otherValue?: string;
};

export type Measurement = {
  id: string;
  userId: string;
  chest: string;
  waist: string;
  hips: string;
  shoulder: string;
  frontNeck: string;
  backNeck: string;
  sleeve: string;
  garmentLengths?: GarmentLengths;
  /** @deprecated — migrated to garmentLengths */
  blouseLength?: string;
  /** @deprecated — migrated to garmentLengths */
  pantLength?: string;
  /** @deprecated — migrated to garmentLengths */
  kurtiLength?: string;
  thigh: string;
  cuff: string;
  notes: string;
  updatedByAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export const EMPTY_GARMENT_LENGTHS: Required<GarmentLengths> = {
  blouse: "",
  pant: "",
  kurti: "",
  lehenga: "",
  gown: "",
  shirt: "",
  otherName: "",
  otherValue: "",
};

export const EMPTY_MEASUREMENT = {
  userId: "",
  chest: "",
  waist: "",
  hips: "",
  shoulder: "",
  frontNeck: "",
  backNeck: "",
  sleeve: "",
  garmentLengths: { ...EMPTY_GARMENT_LENGTHS },
  thigh: "",
  cuff: "",
  notes: "",
};

export type MeasurementFormState = typeof EMPTY_MEASUREMENT;

type BodyFieldKey = keyof Omit<
  MeasurementFormState,
  "garmentLengths"
>;

export type MeasurementFieldConfig = {
  key: BodyFieldKey;
  label: string;
  placeholder: string;
};

/** Body & limb measurements */
export const MEASUREMENT_FIELDS: MeasurementFieldConfig[] = [
  { key: "chest", label: "Chest", placeholder: 'e.g. 38"' },
  { key: "waist", label: "Waist", placeholder: 'e.g. 32"' },
  { key: "hips", label: "Hips", placeholder: 'e.g. 36"' },
  { key: "shoulder", label: "Shoulder", placeholder: 'e.g. 16"' },
  { key: "sleeve", label: "Sleeve", placeholder: 'e.g. 24"' },
  { key: "thigh", label: "Thigh", placeholder: 'e.g. 22"' },
  { key: "cuff", label: "Cuff", placeholder: 'e.g. 8"' },
];

/** Neck — front & back (kurta, blouse, shirt) */
export const NECK_FIELDS: MeasurementFieldConfig[] = [
  { key: "frontNeck", label: "Front Neck", placeholder: 'e.g. 7"' },
  { key: "backNeck", label: "Back Neck", placeholder: 'e.g. 8"' },
];

export const GARMENT_LENGTH_PRESETS: {
  key: GarmentLengthKey;
  label: string;
  placeholder: string;
}[] = [
  { key: "blouse", label: "Blouse", placeholder: 'e.g. 14"' },
  { key: "pant", label: "Pant", placeholder: 'e.g. 40"' },
  { key: "kurti", label: "Kurti", placeholder: 'e.g. 42"' },
  { key: "lehenga", label: "Lehenga", placeholder: 'e.g. 42"' },
  { key: "gown", label: "Gown", placeholder: 'e.g. 55"' },
  { key: "shirt", label: "Shirt", placeholder: 'e.g. 28"' },
];

/** Max garment length slots (6 presets + 1 other) */
export const GARMENT_LENGTH_SLOT_COUNT = GARMENT_LENGTH_PRESETS.length + 1;

export const BASE_MEASUREMENT_FIELD_COUNT =
  MEASUREMENT_FIELDS.length + NECK_FIELDS.length;

export const TOTAL_MEASUREMENT_SLOT_COUNT =
  BASE_MEASUREMENT_FIELD_COUNT + GARMENT_LENGTH_SLOT_COUNT;

function migrateLegacyLengths(
  m: Partial<Measurement> & Record<string, unknown>
): typeof EMPTY_GARMENT_LENGTHS {
  const existing = (m.garmentLengths as GarmentLengths) || {};

  return {
    blouse: existing.blouse || (m.blouseLength as string) || "",
    pant: existing.pant || (m.pantLength as string) || "",
    kurti:
      existing.kurti ||
      (m.kurtiLength as string) ||
      (m.length as string) ||
      "",
    lehenga: existing.lehenga || "",
    gown: existing.gown || "",
    shirt: existing.shirt || "",
    otherName: existing.otherName || "",
    otherValue: existing.otherValue || "",
  };
}

/** Map Firestore records to the form shape (includes legacy length migration) */
export function normalizeMeasurementForm(
  m: Partial<Measurement> & Record<string, unknown>
): MeasurementFormState {
  return {
    userId: (m.userId as string) || "",
    chest: (m.chest as string) || "",
    waist: (m.waist as string) || "",
    hips: (m.hips as string) || "",
    shoulder: (m.shoulder as string) || "",
    frontNeck: (m.frontNeck as string) || (m.neck as string) || "",
    backNeck: (m.backNeck as string) || "",
    sleeve: (m.sleeve as string) || "",
    garmentLengths: migrateLegacyLengths(m),
    thigh: (m.thigh as string) || "",
    cuff: (m.cuff as string) || "",
    notes: (m.notes as string) || "",
  };
}

export function sanitizeGarmentLengths(
  lengths: GarmentLengths
): GarmentLengths {
  const cleaned: GarmentLengths = {};

  for (const { key } of GARMENT_LENGTH_PRESETS) {
    const value = lengths[key]?.trim();
    if (value) cleaned[key] = value;
  }

  const otherName = lengths.otherName?.trim();
  const otherValue = lengths.otherValue?.trim();
  if (otherName && otherValue) {
    cleaned.otherName = otherName;
    cleaned.otherValue = otherValue;
  }

  return cleaned;
}

export function countFilledGarmentLengths(lengths?: GarmentLengths): number {
  if (!lengths) return 0;

  let count = GARMENT_LENGTH_PRESETS.filter((p) =>
    lengths[p.key]?.trim()
  ).length;

  if (lengths.otherName?.trim() && lengths.otherValue?.trim()) {
    count += 1;
  }

  return count;
}

export function getGarmentLengthDisplayEntries(
  lengths?: GarmentLengths
): { label: string; value: string }[] {
  if (!lengths) return [];

  const entries: { label: string; value: string }[] = [];

  for (const { key, label } of GARMENT_LENGTH_PRESETS) {
    const value = lengths[key]?.trim();
    if (value) entries.push({ label, value });
  }

  if (lengths.otherName?.trim() && lengths.otherValue?.trim()) {
    entries.push({
      label: lengths.otherName.trim(),
      value: lengths.otherValue.trim(),
    });
  }

  return entries;
}

export function countFilledFields(m: Measurement | MeasurementFormState): number {
  const bodyCount = [...MEASUREMENT_FIELDS, ...NECK_FIELDS].filter((f) =>
    m[f.key]?.trim()
  ).length;

  const lengths =
    "garmentLengths" in m && m.garmentLengths
      ? m.garmentLengths
      : migrateLegacyLengths(m as Partial<Measurement>);

  return bodyCount + countFilledGarmentLengths(lengths);
}
