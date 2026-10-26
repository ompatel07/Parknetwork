import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { site } from "@/config/site";
import { LegalPage } from "@/components/sections/shared/LegalPage";

export const metadata: Metadata = pageMeta({ title: "Privacy Policy", description: `How ${site.name} collects, uses, stores and protects the personal information of applicants, agencies, partners and website visitors.`, path: "/privacy" });

/* PLACEHOLDER — TO BE REVIEWED BY CLIENT/LEGAL before launch */
export default function PrivacyPage() {
  const c = site.contact;
  return (
    <LegalPage
      channel="07"
      title="Privacy"
      accent="policy."
      lead="How we collect, use and protect the information you share with us."
      sections={[
        {
          id: "who",
          title: "Who we are",
          body: (
            <p>
              This website is operated by {site.legal.companyName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;). For any privacy
              question, contact us at <a href={`mailto:${c.email}`}>{c.email}</a>.
            </p>
          ),
        },
        {
          id: "collect",
          title: "What we collect",
          body: (
            <>
              <p>We only collect what you choose to send us through our forms or messages, such as:</p>
              <ul>
                <li>Your name or display name, country and contact details (WhatsApp number or email).</li>
                <li>Details you share about your experience, agency, business or enquiry.</li>
                <li>Confirmations you give, such as being 18 or older and agreeing to this policy.</li>
              </ul>
              <p>We never ask for passwords, one-time passcodes, private keys or payment card details.</p>
            </>
          ),
        },
        {
          id: "use",
          title: "How we use it",
          body: (
            <ul>
              <li>To review and respond to your application, registration or enquiry.</li>
              <li>To verify eligibility for a role, including age.</li>
              <li>To provide support and keep our community safe.</li>
              <li>To meet legal obligations where they apply.</li>
            </ul>
          ),
        },
        {
          id: "share",
          title: "Sharing",
          body: (
            <p>
              We don&apos;t sell your information. We share it only with service providers that help us run this website
              and deliver messages (for example, hosting and email delivery), and only as needed for those purposes.
            </p>
          ),
        },
        {
          id: "retention",
          title: "Retention & security",
          body: (
            <p>
              Submissions are accessible only to authorised staff and kept only as long as needed for the purpose they
              were collected for, then deleted. We use encrypted connections (HTTPS) and reasonable safeguards to
              protect your data.
            </p>
          ),
        },
        {
          id: "rights",
          title: "Your choices",
          body: (
            <p>
              You can ask us to access, correct or delete the information you&apos;ve shared at any time by emailing{" "}
              <a href={`mailto:${c.email}`}>{c.email}</a>.
            </p>
          ),
        },
        {
          id: "cookies",
          title: "Cookies & analytics",
          body: (
            <p>
              This site uses only what&apos;s necessary for it to work. If analytics are added later, this section will
              explain what is collected and how to opt out.
            </p>
          ),
        },
        {
          id: "changes",
          title: "Changes",
          body: <p>We may update this policy. The date at the side of this page shows when it last changed.</p>,
        },
      ]}
    />
  );
}
