/**
 * ─────────────────────────────────────────────────────────────────────
 *  PARK LIVE NETWORK — SITE CONFIG
 * ─────────────────────────────────────────────────────────────────────
 *  This is the ONLY file that holds brand, contact and business data.
 *  Every value marked  // PLACEHOLDER  must be confirmed by the client
 *  before launch. Search this file for "PLACEHOLDER" to find them all.
 *
 *  Content rules (from the client brief):
 *   - No guaranteed earnings / income claims.
 *   - No testimonials unless genuine and approved.
 *   - No third-party app names or logos without written permission.
 * ─────────────────────────────────────────────────────────────────────
 */

export type IconName =
  | "audio"
  | "stream"
  | "agency"
  | "host"
  | "coins"
  | "handshake"
  | "shield"
  | "crown"
  | "briefcase"
  | "mic";

export type SocialPlatform = "instagram" | "facebook" | "youtube" | "telegram" | "x";

export type FaqCategory = "General" | "Applying" | "Agencies & partners" | "Support & safety";

export type FormType ="agency" | "host" | "coin-seller" | "partnership" | "support" | "team";

export const site = {
  name: "Park Live Network",
  shortName: "Park Live",
  /** PLACEHOLDER — client to approve or replace the tagline */
  tagline: "Connecting Communities Through Live Streaming & Audio Chat",
  /** PLACEHOLDER — short description used for SEO and social sharing */
  /** Hero headline split for display — keep in sync with the tagline. PLACEHOLDER */
  hero: {
    lines: ["Connecting", "communities"],
    tail: "through live streaming & audio chat.",
    intro:
      "We recruit and support hosts, coordinate agencies and build partnerships — so every live room and audio chat runs with care.",
  },
  description:
    "Park Live Network supports live-streaming and audio chat communities through host support, agency coordination, coin seller services and business partnerships.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.parklivenetwork.com", // PLACEHOLDER domain

  /**
   * Animations. "system" respects the visitor's device setting
   * ("reduce motion" / Windows "Animation effects" off) and offers a
   * one-click "Enable animations" button. "on" always animates (visitors
   * can still switch motion off from the footer).
   */
  motion: { default: "system" as "system" | "on" },
  locale: "en_IN",
  language: "en",

  contact: {
    whatsapp: {
      display: "+91 00000 00000", // PLACEHOLDER
      /** Digits only, with country code, no "+" — used for wa.me links */
      number: "910000000000", // PLACEHOLDER
      greeting: "Hi Park Live Network, I would like to know more.",
    },
    email: "hello@parklivenetwork.com", // PLACEHOLDER
    supportEmail: "support@parklivenetwork.com", // PLACEHOLDER
    /** Where every form submission is delivered */
    formRecipient: "hello@parklivenetwork.com", // PLACEHOLDER
    supportHours: "Mon – Sat · 10:00 – 19:00 IST", // PLACEHOLDER
    responseTime: "We aim to reply within 1–2 working days.", // PLACEHOLDER
    /** Set to null to hide */
    address: null as string | null, // PLACEHOLDER
  },

  socials: [
    { platform: "instagram", label: "Instagram", href: "https://instagram.com/PLACEHOLDER" },
    { platform: "facebook", label: "Facebook", href: "https://facebook.com/PLACEHOLDER" },
    { platform: "youtube", label: "YouTube", href: "https://youtube.com/@PLACEHOLDER" },
    { platform: "telegram", label: "Telegram", href: "https://t.me/PLACEHOLDER" },
  ] satisfies { platform: SocialPlatform; label: string; href: string }[], // PLACEHOLDER URLs

  legal: {
    companyName: "Park Live Network", // PLACEHOLDER — registered legal entity name
    registration: null as string | null, // PLACEHOLDER — e.g. company registration no.
    jurisdiction: "India", // PLACEHOLDER
    lastUpdated: "2026-10-25", // PLACEHOLDER
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Careers", href: "/careers" },
    { label: "Partnership", href: "/partnership" },
    { label: "Contact", href: "/contact" },
  ],

  footerNav: {
    explore: [
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Careers", href: "/careers" },
      { label: "Partnership", href: "/partnership" },
    ],
    support: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },

  /**
   * PLACEHOLDER — every number here must be verified by the client.
   * Set `show: false` to hide the stats strip entirely.
   */
  stats: {
    show: true,
    items: [
      { value: 1200, suffix: "+", label: "Hosts supported" }, // PLACEHOLDER
      { value: 80, suffix: "+", label: "Partner agencies" }, // PLACEHOLDER
      { value: 12, suffix: "", label: "Countries reached" }, // PLACEHOLDER
      { value: 24, suffix: "/7", label: "Live operations" }, // PLACEHOLDER
    ],
  },

  /** PLACEHOLDER — confirm every region served. lat/lng drive the world map pings. */
  regions: [
    { name: "India", code: "IN", lat: 22.5, lng: 79 },
    { name: "Bangladesh", code: "BD", lat: 23.7, lng: 90.4 },
    { name: "Nepal", code: "NP", lat: 28.2, lng: 84.1 },
    { name: "Sri Lanka", code: "LK", lat: 7.9, lng: 80.8 },
    { name: "Pakistan", code: "PK", lat: 30.4, lng: 69.3 },
    { name: "United Arab Emirates", code: "AE", lat: 24.4, lng: 54.4 },
    { name: "Saudi Arabia", code: "SA", lat: 24.7, lng: 46.7 },
    { name: "Indonesia", code: "ID", lat: -2.5, lng: 118 },
    { name: "Philippines", code: "PH", lat: 12.9, lng: 121.8 },
    { name: "Malaysia", code: "MY", lat: 4.2, lng: 101.9 },
    { name: "Egypt", code: "EG", lat: 26.8, lng: 30.8 },
    { name: "Nigeria", code: "NG", lat: 9.1, lng: 8.7 },
  ],

  /** PLACEHOLDER — keep only the services the business actually provides. */
  services: [
    {
      slug: "audio-chat-rooms",
      icon: "audio",
      title: "Audio Chat Rooms",
      short: "Voice-first rooms where communities gather, talk and stay.",
      description:
        "We help set up and run audio chat rooms with clear room rules, trained hosts and active moderation, so conversations stay friendly and engaging.",
      points: ["Room setup & themes", "Host scheduling", "Moderation guidelines", "Community engagement"],
    },
    {
      slug: "live-streaming-management",
      icon: "stream",
      title: "Live Streaming Management",
      short: "Planning, scheduling and day-to-day support for live hosts.",
      description:
        "From show planning to on-air etiquette, we support hosts with schedules, content guidance and quality checks so every stream feels professional.",
      points: ["Stream planning", "Quality checks", "Content guidance", "Performance reviews"],
    },
    {
      slug: "agency-management",
      icon: "agency",
      title: "Agency Management",
      short: "Structured onboarding and coordination for partner agencies.",
      description:
        "We coordinate with partner agencies on onboarding, host rosters, reporting and communication, with clear processes at every step.",
      points: ["Agency onboarding", "Roster coordination", "Regular reporting", "Dedicated contact"],
    },
    {
      slug: "host-recruitment",
      icon: "host",
      title: "Host Recruitment & Support",
      short: "Finding, training and supporting new on-air talent.",
      description:
        "We recruit eligible adult hosts, walk them through verification and training, and stay available for support once they are live.",
      points: ["Eligibility checks", "Onboarding training", "Ongoing support", "Safety guidance"],
    },
    {
      slug: "coin-seller-services",
      icon: "coins",
      title: "Coin Seller Services",
      short: "Authorised coin seller coordination in supported regions.",
      description:
        "We work with approved coin sellers in supported regions, following platform rules and only using permitted payment methods.",
      points: ["Seller verification", "Approved regions only", "Clear seller rules", "Support channel"],
    },
    {
      slug: "bd-partnerships",
      icon: "handshake",
      title: "BD Partnerships",
      short: "Business development partnerships that grow the network.",
      description:
        "We partner with business development teams and organisations that share our standards for transparent, responsible growth.",
      points: ["Partnership review", "Transparent terms", "Joint planning", "Dedicated manager"],
    },
  ] satisfies {
    slug: string;
    icon: IconName;
    title: string;
    short: string;
    description: string;
    points: string[];
  }[],

  /** PLACEHOLDER — confirm roles, duties and eligibility. `form` picks the application form. */
  roles: [
    {
      slug: "super-admin",
      icon: "crown",
      title: "Super Admin",
      summary: "Oversee rooms, teams and day-to-day operations across the network.",
      responsibilities: [
        "Coordinate admins, hosts and agency contacts",
        "Monitor room quality and community guidelines",
        "Escalate and resolve operational issues",
      ],
      eligibility: ["18 years or older", "Prior moderation or team-lead experience", "Strong communication skills"],
      form: "team",
    },
    {
      slug: "coin-seller",
      icon: "coins",
      title: "Coin Seller",
      summary: "Serve users in your region as an authorised, verified coin seller.",
      responsibilities: [
        "Handle coin requests through approved channels",
        "Follow seller rules and permitted payment methods",
        "Keep clear records and respond promptly",
      ],
      eligibility: ["18 years or older", "Based in a supported region", "Able to complete seller verification"],
      form: "coin-seller",
    },
    {
      slug: "bd-agency-admin",
      icon: "briefcase",
      title: "BD Agency Admin",
      summary: "Build and manage an agency of hosts with our team's support.",
      responsibilities: [
        "Recruit and guide hosts within your agency",
        "Coordinate schedules and reporting",
        "Uphold community and safety standards",
      ],
      eligibility: ["18 years or older", "Team or agency management experience", "Available for regular check-ins"],
      form: "team",
    },
    {
      slug: "live-host",
      icon: "mic",
      title: "Live Host",
      summary: "Go on air, host audio rooms and build a community around you.",
      responsibilities: [
        "Host live streams or audio rooms on schedule",
        "Follow community guidelines",
        "Engage respectfully with your audience",
      ],
      eligibility: ["18 years or older", "Smartphone with stable internet", "Comfortable speaking on air"],
      form: "host",
    },
  ] satisfies {
    slug: string;
    icon: IconName;
    title: string;
    summary: string;
    responsibilities: string[];
    eligibility: string[];
    form: FormType;
  }[],

  /** How it works — steps */
  steps: [
    { title: "Apply", text: "Choose a role or partnership and send a short application. It takes a few minutes." },
    { title: "Verification", text: "Our team reviews your details and confirms eligibility, including age verification." },
    { title: "Onboarding", text: "You get guidelines, training and a dedicated contact to help you get set up." },
    { title: "Go Live", text: "Start hosting, managing or partnering — with our team supporting you along the way." },
  ],

  /**
   * PLACEHOLDER — confirm every answer with the client.
   * The first five are shown on the homepage.
   */
  faqs: [
    {
      category: "Applying",
      q: "Who can apply to join Park Live Network?",
      a: "Anyone aged 18 or older who meets the eligibility requirements for the role. Each role lists its own requirements on the Careers page.",
    },
    {
      category: "Applying",
      q: "Is there a fee to apply?",
      a: "Applying is free. If any role ever involves fees or commercial terms, they will be clearly explained in writing before you agree to anything.",
    },
    {
      category: "Applying",
      q: "How long does verification take?",
      a: "Most applications are reviewed within a few working days. We contact you through the method you choose in the form.",
    },
    {
      category: "Agencies & partners",
      q: "How do I register my agency?",
      a: "Use the Agency Registration form on the Partnership page. Our team will review it and reach out to discuss onboarding.",
    },
    {
      category: "General",
      q: "Do you guarantee earnings?",
      a: "No. We do not promise or guarantee any income. Outcomes depend on many factors, and we are always transparent about how things work.",
    },
    {
      category: "Support & safety",
      q: "Will you ever ask for my password or OTP?",
      a: "Never. Park Live Network will never ask for passwords, one-time codes or card details. If someone does, please report it to our support team.",
    },
    {
      category: "General",
      q: "What does Park Live Network do?",
      a: "We support live-streaming and audio chat communities — recruiting and supporting hosts, coordinating agencies, working with approved coin sellers and building business partnerships.",
    },
    {
      category: "General",
      q: "Which countries do you work in?",
      a: "We currently support communities in the countries listed on our About page. If your country isn't listed, contact us — we may still be able to help.",
    },
    {
      category: "Applying",
      q: "What documents do I need for verification?",
      a: "We'll tell you exactly what's needed after you apply. This usually includes confirming your age and identity. We only ask for what's necessary and handle it securely.",
    },
    {
      category: "Applying",
      q: "Can I apply for more than one role?",
      a: "Yes. Submit a separate application for each role you're interested in and mention it in your message — our team will help you choose the best fit.",
    },
    {
      category: "Agencies & partners",
      q: "What does agency onboarding involve?",
      a: "After reviewing your enquiry, we'll schedule a conversation, share our guidelines and agree on how we'll work together — all in writing before anything starts.",
    },
    {
      category: "Agencies & partners",
      q: "How do coin seller enquiries work?",
      a: "Coin seller services are only available in supported regions and with approved payment methods. Send an enquiry and our team will explain what's possible where you are.",
    },
    {
      category: "Support & safety",
      q: "How do I contact support?",
      a: "Message us on WhatsApp, send an email or use the support form on the Contact page. Include a reference ID if you have one so we can help faster.",
    },
    {
      category: "Support & safety",
      q: "How do I report a problem or unsafe behaviour?",
      a: "Contact our support team right away with as much detail as you can. Reports are handled confidentially and taken seriously.",
    },
  ] satisfies { category: FaqCategory; q: string; a: string }[],
};

export type Site = typeof site;
export type Service = Site["services"][number];
export type Role = Site["roles"][number];

/** Helpers derived from config — use these instead of building links by hand. */
export const whatsappHref = (message: string = site.contact.whatsapp.greeting) =>
  `https://wa.me/${site.contact.whatsapp.number}?text=${encodeURIComponent(message)}`;

export const mailHref = (email: string = site.contact.email, subject?: string) =>
  `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
