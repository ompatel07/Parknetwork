import type { FormType } from "@/config/site";
import { CONTACT_METHODS, COUNTRIES } from "./schemas";

type Base = { name: string; label: string; half?: boolean; optional?: boolean; hint?: string };
export type FieldDef =
  | (Base & { kind: "text" | "email" | "tel"; placeholder?: string; autoComplete?: string })
  | (Base & { kind: "textarea"; placeholder?: string; rows?: number })
  | (Base & { kind: "select"; options: readonly string[] })
  | (Base & { kind: "radio"; options: readonly string[] })
  | (Base & { kind: "multi"; options: readonly string[] })
  | (Base & { kind: "checkbox" })
  | (Base & { kind: "contact" });

export type FormDef = {
  title: string;
  submit: string;
  /** Short line shown above the success message */
  success: string;
  fields: FieldDef[];
};

const contact: FieldDef = { kind: "contact", name: "contactMethod", label: "How should we contact you?" };
const countryField: FieldDef = { kind: "select", name: "country", label: "Country", options: COUNTRIES, half: true };

export const FORMS: Record<FormType, FormDef> = {
  agency: {
    title: "Agency registration",
    submit: "Send registration",
    success: "Your agency registration is in.",
    fields: [
      { kind: "text", name: "agencyName", label: "Agency name", half: true, autoComplete: "organization" },
      countryField,
      { kind: "text", name: "contactPerson", label: "Contact person", half: true, autoComplete: "name" },
      { kind: "text", name: "agencyId", label: "Existing agency ID", half: true, optional: true },
      { kind: "tel", name: "whatsapp", label: "WhatsApp number", half: true, placeholder: "+91 …", autoComplete: "tel", hint: "Add WhatsApp or email" },
      { kind: "email", name: "email", label: "Email", half: true, autoComplete: "email", optional: true },
      { kind: "select", name: "experience", label: "Agency experience", options: ["New agency", "Under 1 year", "1–3 years", "3+ years"] },
      { kind: "textarea", name: "message", label: "Tell us about your agency", rows: 4, placeholder: "Size of your team, platforms you work with, what you're looking for…" },
    ],
  },
  host: {
    title: "Host application",
    submit: "Send application",
    success: "Your host application is in.",
    fields: [
      { kind: "text", name: "displayName", label: "Name or display name", half: true, autoComplete: "nickname" },
      countryField,
      { kind: "radio", name: "experience", label: "Hosting experience", options: ["New to hosting", "Some experience", "Experienced host"] },
      { kind: "textarea", name: "about", label: "Anything you'd like us to know?", optional: true, rows: 3, placeholder: "Languages you speak, topics you love, when you're available…" },
      contact,
      { kind: "checkbox", name: "ageConfirm", label: "I confirm I am 18 years or older" },
    ],
  },
  "coin-seller": {
    title: "Coin seller enquiry",
    submit: "Send enquiry",
    success: "Your coin seller enquiry is in.",
    fields: [
      { kind: "text", name: "sellerName", label: "Name", half: true, autoComplete: "name" },
      countryField,
      { kind: "text", name: "sellerId", label: "Existing seller ID", optional: true },
      { kind: "multi", name: "paymentMethods", label: "Payment methods you can accept", options: ["Bank transfer", "UPI", "Mobile wallet", "Other"], hint: "Only methods that are legal and approved where you live" },
      contact,
      { kind: "checkbox", name: "eligibility", label: "I'm 18+ and coin selling is permitted where I live" },
    ],
  },
  partnership: {
    title: "Business partnership",
    submit: "Send proposal",
    success: "Your proposal is in.",
    fields: [
      { kind: "text", name: "company", label: "Company / organisation", half: true, autoComplete: "organization" },
      { kind: "email", name: "businessEmail", label: "Business email", half: true, autoComplete: "email" },
      countryField,
      { kind: "radio", name: "preferredContact", label: "Preferred contact", options: ["Email", "WhatsApp", "Call"], half: true },
      { kind: "textarea", name: "proposal", label: "Proposal summary", rows: 5, placeholder: "Who you are, what you'd like to do together and why it's a good fit…" },
    ],
  },
  support: {
    title: "Customer support",
    submit: "Send message",
    success: "Your message is in.",
    fields: [
      { kind: "text", name: "name", label: "Name or display name", half: true, autoComplete: "name" },
      { kind: "select", name: "category", label: "Topic", half: true, options: ["My application", "Agency", "Coin seller", "Account help", "Report a problem", "Something else"] },
      contact,
      { kind: "textarea", name: "message", label: "How can we help?", rows: 5 },
      { kind: "text", name: "referenceId", label: "Reference ID", optional: true, hint: "If you have one from a previous message" },
    ],
  },
  team: {
    title: "Team application",
    submit: "Send application",
    success: "Your application is in.",
    fields: [
      { kind: "text", name: "fullName", label: "Full name", half: true, autoComplete: "name" },
      countryField,
      { kind: "textarea", name: "experience", label: "Relevant experience", rows: 4, placeholder: "Moderation, team leading, agency work — tell us what you've done." },
      contact,
      { kind: "checkbox", name: "ageConfirm", label: "I confirm I am 18 years or older" },
    ],
  },
};

/** Empty starting values for a form. */
export function defaultsFor(type: FormType, extra: Record<string, unknown> = {}) {
  const values: Record<string, unknown> = { consent: false, ...extra };
  for (const f of FORMS[type].fields) {
    if (f.kind === "checkbox") values[f.name] = false;
    else if (f.kind === "multi") values[f.name] = [];
    else if (f.kind === "contact") {
      values.contactMethod = CONTACT_METHODS[0];
      values.contactValue = "";
    } else if (!(f.name in values)) values[f.name] = "";
  }
  return values;
}
