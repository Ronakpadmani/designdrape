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
  blouseLength: string;
  pantLength: string;
  kurtiLength: string;
  thigh: string;
  cuff: string;
  notes: string;
  updatedByAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
  blouseLength: "",
  pantLength: "",
  kurtiLength: "",
  thigh: "",
  cuff: "",
  notes: "",
};

type MeasurementFieldKey = keyof Omit<
  Measurement,
  "id" | "userId" | "updatedByAdmin" | "createdAt" | "updatedAt"
>;

export type MeasurementFieldConfig = {
  key: MeasurementFieldKey;
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

/** Full length — per garment type (fill only what you stitch) */
export const LENGTH_FIELDS: MeasurementFieldConfig[] = [
  { key: "blouseLength", label: "Blouse Length", placeholder: 'e.g. 14"' },
  { key: "pantLength", label: "Pant Length", placeholder: 'e.g. 40"' },
  { key: "kurtiLength", label: "Kurti Length", placeholder: 'e.g. 42"' },
];

export const ALL_MEASUREMENT_FIELDS: MeasurementFieldConfig[] = [
  ...MEASUREMENT_FIELDS,
  ...NECK_FIELDS,
  ...LENGTH_FIELDS,
];

/** Map old Firestore records to the new shape when editing */
export function normalizeMeasurementForm(
  m: Partial<Measurement> & Record<string, unknown>
): typeof EMPTY_MEASUREMENT {
  return {
    userId: (m.userId as string) || "",
    chest: (m.chest as string) || "",
    waist: (m.waist as string) || "",
    hips: (m.hips as string) || "",
    shoulder: (m.shoulder as string) || "",
    frontNeck: (m.frontNeck as string) || (m.neck as string) || "",
    backNeck: (m.backNeck as string) || "",
    sleeve: (m.sleeve as string) || "",
    blouseLength: (m.blouseLength as string) || "",
    pantLength: (m.pantLength as string) || "",
    kurtiLength: (m.kurtiLength as string) || (m.length as string) || "",
    thigh: (m.thigh as string) || "",
    cuff: (m.cuff as string) || "",
    notes: (m.notes as string) || "",
  };
}

export function countFilledFields(m: Measurement): number {
  return ALL_MEASUREMENT_FIELDS.filter((f) => m[f.key]?.trim()).length;
}
