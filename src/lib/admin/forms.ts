import { FORMS } from "@/lib/forms/fields";
import type { FormType } from "@/config/site";

export const FORM_TYPES = Object.keys(FORMS) as FormType[];

export function formTitle(form: string) {
  return (FORMS as Record<string, { title: string }>)[form]?.title ?? form;
}

const humanize = (k: string) =>
  k
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());

/** The label the visitor saw for a field, e.g. "agencyName" → "Agency name". */
export function fieldLabel(form: string, key: string) {
  if (key === "contactMethod") return "Preferred contact";
  if (key === "contactValue") return "Contact details";
  const def = (FORMS as Record<string, { fields: { name: string; label: string }[] }>)[form]?.fields.find((f) => f.name === key);
  return def?.label ?? humanize(key);
}

export function showValue(v: unknown): string {
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
