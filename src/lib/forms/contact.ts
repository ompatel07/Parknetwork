/**
 * Pulls a display name, email and phone number out of any form's data, so
 * every submission can be listed, searched and replied to the same way.
 */
const NAME_KEYS = ["name", "fullName", "contactPerson", "displayName", "sellerName", "agencyName", "company"];
const EMAIL_KEYS = ["email", "businessEmail"];
const PHONE_KEYS = ["whatsapp", "phone", "mobile"];

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function extractContact(data: Record<string, unknown>) {
  const name = NAME_KEYS.map((k) => str(data[k])).find(Boolean) ?? "";
  let email = EMAIL_KEYS.map((k) => str(data[k])).find(looksLikeEmail) ?? null;
  let phone = PHONE_KEYS.map((k) => str(data[k])).find(Boolean) ?? null;

  // The shared "How should we contact you?" field: contactMethod + contactValue
  const method = str(data.contactMethod).toLowerCase();
  const value = str(data.contactValue);
  if (value) {
    if (method === "email" && !email && looksLikeEmail(value)) email = value;
    else if (method && method !== "email" && !phone) phone = value;
  }
  return { name, email, phone };
}

/** Digits only (with country code) for wa.me links, or null if it isn't a usable number. */
export function waNumber(phone: string | null | undefined) {
  const d = (phone ?? "").replace(/\D/g, "");
  return d.length >= 8 ? d : null;
}
