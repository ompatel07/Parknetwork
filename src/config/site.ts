/**
 * ─────────────────────────────────────────────────────────────────────
 *  PARK LIVE NETWORK — SITE CONFIG
 * ─────────────────────────────────────────────────────────────────────
 *  This is the ONLY file that holds brand, contact and business data.
 *  Values marked  // PLACEHOLDER  still need the client's confirmation.
 *  Values marked  // CLIENT  were supplied by the client.
 *
 *  Content rules:
 *   - No guaranteed earnings / income claims.
 *   - No testimonials unless genuine and approved.
 *   - Platform logos only where the client has worked with / is
 *     authorised to show that platform (see `platforms`).
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
  | "mic"
  | "heart"
  | "video"
  | "network"
  | "globe"
  | "trend"
  | "lock"
  | "scale"
  | "users"
  | "spark";

export type SocialPlatform = "instagram" | "linkedin" | "youtube" | "facebook" | "telegram" | "x";

export type FaqCategory = "General" | "Applying" | "Agencies & partners" | "Support & safety";

export type FormType = "agency" | "host" | "coin-seller" | "partnership" | "support" | "team";

export const site = {
  name: "Park Live Network",
  shortName: "Park Live",
  tagline: "Connecting Digital Platforms. Empowering Global Communities.", // CLIENT
  slogan: "Connecting Platforms. Empowering People. Growing Globally.", // CLIENT
  description:
    "Park Live Network is a digital platform management and network development company for live streaming, audio chat, dating, social and short-video applications — 70+ apps managed and 500,000+ active users across our network.", // CLIENT
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.parklivenetwork.com", // PLACEHOLDER domain

  /** Homepage banner — CLIENT */
  hero: {
    eyebrow: "Global digital network",
    title: "Your global partner in",
    accent: "digital platform management.",
    intro: "Managing 70+ applications. Connecting 500,000+ active users. Building a global professional network.",
    categories: ["Live Streaming", "Audio Chat", "Social Networking", "Dating Apps", "Short Videos"],
  },

  /** About copy — CLIENT */
  about: {
    headline: "Connecting digital platforms.",
    accent: "Empowering global communities.",
    paragraphs: [
      "Park Live Network is a digital platform management and network development company specializing in live streaming applications, audio chat rooms, group voice chat platforms, dating applications and short-video platforms.",
      "With experience managing and supporting more than 70 applications, we focus on accelerating platform growth, developing strong management networks, expanding user communities and building sustainable digital ecosystems.",
      "Our network reports a community of 500,000 active users and a team of 5,000 professional employees and network members operating across multiple countries. Through our global presence, dedicated teams and platform-focused management strategies, we aim to connect people, empower creators, support agencies and help digital platforms grow in competitive international markets.",
    ],
    commitment:
      "Park Live Network is committed to innovation, operational excellence, professional management and long-term partnerships across the digital entertainment industry.",
    vision: "To become a leading global partner for digital entertainment and social communication platforms.",
    mission:
      "To empower platforms, creators, agencies and communities through effective management, international collaboration and scalable growth strategies.",
    globalVision: {
      title: "Building the future of",
      accent: "digital entertainment.",
      paragraphs: [
        "Park Live Network believes the future of digital entertainment lies in meaningful connections, innovative technology and strong global communities.",
        "Our goal is to expand our international network, strengthen platform management capabilities, empower creators and agencies, and help digital applications achieve sustainable growth.",
        "From live streaming and audio chat communities to social networking and short-video platforms, we work toward an interconnected digital ecosystem that creates opportunities for users, creators, business partners and platform owners.",
      ],
    },
  },

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
      display: "+91 72041 45912", // CLIENT — customer support number
      /** Digits only, with country code, no "+" — used for wa.me links */
      number: "917204145912", // CLIENT
      greeting: "Hi Park Live Network, I would like to know more.",
    },
    /** Customer support phone (tel: link) */
    phone: { display: "+91 72041 45912", href: "tel:+917204145912" }, // CLIENT
    email: "hello@parklivenetwork.com", // PLACEHOLDER — client to provide
    supportEmail: "support@parklivenetwork.com", // PLACEHOLDER — client to provide
    /** Where every form submission is delivered */
    formRecipient: "hello@parklivenetwork.com", // PLACEHOLDER
    supportHours: "Mon – Sat · 10:00 – 19:00 IST", // PLACEHOLDER
    responseTime: "We aim to reply within 1–2 working days.", // PLACEHOLDER
    /** Set to null to hide */
    address: null as string | null, // PLACEHOLDER
  },

  /** CLIENT — official social accounts */
  socials: [
    { platform: "instagram", label: "Instagram", handle: "@park_liv_enetwork", href: "https://www.instagram.com/park_liv_enetwork/" },
    { platform: "linkedin", label: "LinkedIn", handle: "Park Live Network", href: "https://www.linkedin.com/company/higo-live-stream-group-chat/" },
    { platform: "youtube", label: "YouTube", handle: "@bm_sgamer", href: "https://www.youtube.com/@bm_sgamer" },
  ] satisfies { platform: SocialPlatform; label: string; handle: string; href: string }[],

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
   * Company at a glance — CLIENT reported figures.
   * Client to confirm they reflect current reporting data.
   * `text` replaces the animated number (e.g. "Global").
   */
  stats: {
    show: true,
    items: [
      { value: 70, suffix: "+", label: "Applications managed", note: "Platform management and growth support" },
      { value: 500, suffix: "K+", label: "Active users", note: "Across the network" },
      { value: 5000, suffix: "", label: "Professionals", note: "Employees and network members" },
      { value: 0, suffix: "", text: "Global", label: "International network", note: "Teams operating across countries" },
    ] as { value: number; suffix: string; text?: string; label: string; note: string }[],
  },

  /** Leadership — CLIENT. Photos live in /public/team. */
  team: [
    { name: "N Karthik Naidu", role: "Founder & CEO", code: "CEO", photo: "/team/karthik-naidu.jpg" },
    { name: "Malik", role: "Co-founder", code: "CO-FOUNDER", photo: "/team/malik.jpg" },
    { name: "Jalal", role: "Managing Director", code: "MD", photo: "/team/jalal.jpg" },
    { name: "Dev", role: "Chief Operating Officer", code: "COO", photo: "/team/dev.jpg" },
    { name: "Danshka", role: "General Manager", code: "GM", photo: "/team/danshka.jpg" },
  ],

  /**
   * Platform ecosystem — CLIENT: platforms the team has worked with.
   * Client must confirm each relationship is accurate and that showing
   * the logo is permitted. Set `show: false` to hide every logo.
   */
  platforms: {
    show: true,
    total: 70,
    items: [
      { name: "BIGO LIVE", category: "Live streaming platform", logo: "/platforms/bigo-live.jpg" },
      { name: "TikTok", category: "Short-video platform", logo: "/platforms/tiktok.jpg" },
      { name: "Likee", category: "Short-video & creator platform", logo: "/platforms/likee.jpg" },
      { name: "ShareChat", category: "Social networking platform", logo: "/platforms/sharechat.jpg" },
      { name: "YoYo", category: "Social & voice chat platform", logo: "/platforms/yoyo.jpg" },
    ],
    categories: ["Live streaming", "Audio chat rooms", "Group voice chat", "Dating apps", "Social networking", "Short video"],
    disclaimer:
      "Platform names and logos are trademarks of their respective owners, shown to identify platforms our teams have worked with.",
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

  /** Core services — CLIENT */
  services: [
    {
      slug: "live-streaming",
      icon: "stream",
      title: "Live Streaming Platform Management",
      short: "Hosts, agencies and growth strategies for live-streaming apps.",
      description:
        "We support live-streaming platforms through creator and host recruitment, agency development, performance monitoring and community growth strategies.",
      points: ["Creator & host recruitment", "Agency development", "Performance monitoring", "Community growth"],
    },
    {
      slug: "audio-chat",
      icon: "audio",
      title: "Audio Chat & Group Voice Rooms",
      short: "Active voice communities with well-run rooms and hosts.",
      description:
        "We help develop active voice communities, manage room operations, coordinate hosts and support agency networks.",
      points: ["Voice community building", "Room operations", "Host coordination", "Agency network support"],
    },
    {
      slug: "dating-social",
      icon: "heart",
      title: "Dating & Social Networking Apps",
      short: "Engaged users, healthy communities and sustainable growth.",
      description:
        "We focus on user engagement, community development, onboarding support and sustainable platform growth.",
      points: ["User engagement", "Community development", "Onboarding support", "Sustainable growth"],
    },
    {
      slug: "short-video",
      icon: "video",
      title: "Short-Video Platforms",
      short: "Creators, content communities and audience growth.",
      description:
        "We support creator acquisition, content community development, audience engagement and network expansion.",
      points: ["Creator acquisition", "Content communities", "Audience engagement", "Network expansion"],
    },
    {
      slug: "app-agency-network",
      icon: "network",
      title: "Application & Agency Network Management",
      short: "Teams, agencies and workflows coordinated at scale.",
      description:
        "We coordinate management teams, agency partners, recruitment initiatives, operational workflows and performance-based growth programmes.",
      points: ["Management teams", "Agency partners", "Recruitment initiatives", "Performance programmes"],
    },
  ] satisfies {
    slug: string;
    icon: IconName;
    title: string;
    short: string;
    description: string;
    points: string[];
  }[],

  /** Why choose Park Live Network — CLIENT */
  whyChoose: [
    { title: "Proven management experience", text: "Experience managing more than 70 applications across the digital entertainment ecosystem." },
    { title: "Large professional network", text: "A reported network of 5,000 professionals and 500,000 active users." },
    { title: "International operations", text: "Teams and network relationships spanning multiple countries, supporting cross-border collaboration." },
    { title: "Growth-focused strategies", text: "Structured recruitment, agency development, community engagement and operational support." },
    { title: "Long-term partnerships", text: "Lasting relationships with application owners, platform operators, agencies and creators." },
  ],

  /** Values — from the client's commitment statement */
  values: [
    { title: "Innovation", text: "New ideas, tools and formats that keep platforms and communities ahead." },
    { title: "Operational excellence", text: "Clear processes, reliable teams and steady day-to-day execution." },
    { title: "Professional management", text: "Structured, accountable management for every platform we support." },
    { title: "Long-term partnerships", text: "Relationships built to last with owners, agencies and creators." },
  ],

  /** Trust & compliance */
  trust: [
    { icon: "lock", title: "Data protection", text: "Personal details are collected only when needed and handled securely." },
    { icon: "scale", title: "Platform rules", text: "Our teams follow each platform's policies and local regulations." },
    { icon: "shield", title: "Creator safety", text: "Verified adults only, clear guidelines and fast action on reports." },
    { icon: "handshake", title: "Business transparency", text: "Roles, responsibilities and any commercial terms agreed in writing." },
  ] satisfies { icon: IconName; title: string; text: string }[],

  /** Partnership opportunities — who we partner with */
  audiences: [
    { title: "Application owners", text: "Grow your app's community, hosts and agency network with an experienced management partner." },
    { title: "Agencies", text: "Join a structured network with clear onboarding, reporting and a dedicated contact." },
    { title: "Investors", text: "Explore opportunities across live streaming, audio, social and short-video platforms." },
    { title: "Creators", text: "Find the right platform, training and support to build an audience." },
  ],

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
   * PLACEHOLDER — client to confirm every answer.
   * The first five are shown on the homepage.
   */
  faqs: [
    {
      category: "General",
      q: "What does Park Live Network do?",
      a: "We're a digital platform management and network development company. We manage and support live streaming, audio chat, group voice chat, dating and short-video applications — more than 70 so far — through creator and host recruitment, agency development and community growth strategies.",
    },
    {
      category: "Agencies & partners",
      q: "I own an app — can you help it grow?",
      a: "Yes. Send the business partnership form on the Partnership page with a short summary of your platform and goals. Our team will review it and arrange a call.",
    },
    {
      category: "Applying",
      q: "Who can apply to join Park Live Network?",
      a: "Anyone aged 18 or older who meets the eligibility requirements for the role. Each role lists its own requirements on the Careers page.",
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
      category: "General",
      q: "Which platforms do you work with?",
      a: "Our teams have managed and supported more than 70 applications across live streaming, audio chat, social networking, dating and short video. Contact us to discuss a specific platform.",
    },
    {
      category: "General",
      q: "Which countries do you work in?",
      a: "Our teams and network members operate across multiple countries. If you're unsure whether we support your region, contact us — we'll let you know.",
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
      q: "Will you ever ask for my password or OTP?",
      a: "Never. Park Live Network will never ask for passwords, one-time codes or card details. If someone does, please report it to our support team.",
    },
    {
      category: "Support & safety",
      q: "How do I contact support?",
      a: "Call or WhatsApp our customer support number, send an email or use the support form on the Contact page. Include a reference ID if you have one so we can help faster.",
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
