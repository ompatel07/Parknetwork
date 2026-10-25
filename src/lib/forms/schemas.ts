import { z } from "zod";
import { site, type FormType } from "@/config/site";

/**
 * Validation for every form — shared by the browser (instant feedback) and
 * the server action (the real gatekeeper). Never ask for passwords, OTPs
 * or card details here.
 */

export const COUNTRIES = [...site.regions.map((r) => r.name), "Other"] as const;
export const CONTACT_METHODS = ["WhatsApp", "Email"] as const;

const req = (label: string, min = 2, max = 120) =>
  z
    .string()
    .trim()
    .min(min, { error: min <= 1 ? `${label} is required` : `${label} must be at least ${min} characters` })
    .max(max, { error: `${label} is too long` });

const optional = (max = 120) => z.string().trim().max(max).optional().or(z.literal(""));
const country = z.string().min(1, { error: "Please choose a country" });
const consent = z.literal(true, { error: "Please accept the privacy notice to continue" });
const adult = z.literal(true, { error: "You must be 18 or older to apply" });
const phoneRe = /^\+?[0-9 ()-]{7,20}$/;

/** "Contact me via WhatsApp/Email" + the matching value, validated together */
const contactFields = {
  contactMethod: z.enum(CONTACT_METHODS, { error: "Choose how we should contact you" }),
  contactValue: z.string().trim().min(3, { error: "Please add your WhatsApp number or email" }).max(120),
};
function checkContact(d: { contactMethod: string; contactValue: string }, ctx: z.RefinementCtx) {
  const ok =
    d.contactMethod === "Email" ? z.email().safeParse(d.contactValue).success : phoneRe.test(d.contactValue);
  if (!ok) {
    ctx.addIssue({
      code: "custom",
      path: ["contactValue"],
      message: d.contactMethod === "Email" ? "Enter a valid email address" : "Enter a valid WhatsApp number with country code",
    });
  }
}

export const schemas = {
  agency: z
    .object({
      agencyName: req("Agency name"),
      country,
      contactPerson: req("Contact person"),
      whatsapp: z.string().trim().max(20).optional().or(z.literal("")),
      email: z.email({ error: "Enter a valid email" }).optional().or(z.literal("")),
      agencyId: optional(60),
      experience: z.string().min(1, { error: "Please choose one" }),
      message: req("Message", 10, 1500),
      consent,
    })
    .superRefine((d, ctx) => {
      if (!d.whatsapp && !d.email) {
        ctx.addIssue({ code: "custom", path: ["whatsapp"], message: "Add a WhatsApp number or an email" });
      }
      if (d.whatsapp && !phoneRe.test(d.whatsapp)) {
        ctx.addIssue({ code: "custom", path: ["whatsapp"], message: "Enter a valid WhatsApp number with country code" });
      }
    }),

  host: z
    .object({
      displayName: req("Name"),
      country,
      ageConfirm: adult,
      experience: z.string().min(1, { error: "Please choose one" }),
      about: optional(1000),
      ...contactFields,
      consent,
    })
    .superRefine(checkContact),

  "coin-seller": z
    .object({
      sellerName: req("Name"),
      country,
      sellerId: optional(60),
      paymentMethods: z.array(z.string()).min(1, { error: "Choose at least one method" }),
      ...contactFields,
      eligibility: z.literal(true, { error: "Please confirm your eligibility" }),
      consent,
    })
    .superRefine(checkContact),

  partnership: z.object({
    company: req("Company / organisation"),
    businessEmail: z.email({ error: "Enter a valid business email" }),
    country,
    proposal: req("Proposal summary", 20, 2500),
    preferredContact: z.enum(["Email", "WhatsApp", "Call"], { error: "Choose one" }),
    consent,
  }),

  support: z
    .object({
      name: req("Name"),
      ...contactFields,
      category: z.string().min(1, { error: "Choose a category" }),
      message: req("Message", 10, 2000),
      referenceId: optional(60),
      consent,
    })
    .superRefine(checkContact),

  team: z
    .object({
      fullName: req("Full name"),
      country,
      role: z.string().min(1),
      ageConfirm: adult,
      experience: req("Experience", 10, 1500),
      ...contactFields,
      consent,
    })
    .superRefine(checkContact),
} satisfies Record<FormType, z.ZodType>;

export type FormValues = Record<string, unknown>;
