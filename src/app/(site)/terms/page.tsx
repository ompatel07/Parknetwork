import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { site } from "@/config/site";
import { LegalPage } from "@/components/sections/shared/LegalPage";

export const metadata: Metadata = pageMeta({ title: "Terms & Conditions", description: `The terms and conditions for using the ${site.name} website, applying for roles, registering an agency and contacting our team.`, path: "/terms" });

/* PLACEHOLDER — TO BE REVIEWED BY CLIENT/LEGAL before launch */
export default function TermsPage() {
  return (
    <LegalPage
      channel="08"
      title="Terms &"
      accent="conditions."
      lead="The rules for using this website and contacting us through it."
      sections={[
        {
          id: "use",
          title: "Using this website",
          body: (
            <p>
              By using this website you agree to these terms. The site provides information about {site.name} and ways
              to contact us. Please use it lawfully and respectfully.
            </p>
          ),
        },
        {
          id: "eligibility",
          title: "Eligibility",
          body: <p>Applications for any role are open only to people aged 18 or older who meet the stated requirements.</p>,
        },
        {
          id: "conduct",
          title: "Acceptable conduct",
          body: (
            <ul>
              <li>Don&apos;t submit false, misleading or someone else&apos;s information.</li>
              <li>Don&apos;t attempt to disrupt, overload or gain unauthorised access to the website.</li>
              <li>Don&apos;t use the website to send spam or harmful content.</li>
            </ul>
          ),
        },
        {
          id: "no-guarantees",
          title: "No guarantees",
          body: (
            <p>
              Submitting a form does not guarantee a role, partnership or any outcome. We do not promise or guarantee
              earnings or income. Any commercial terms will be agreed separately and in writing.
            </p>
          ),
        },
        {
          id: "ip",
          title: "Intellectual property",
          body: (
            <p>
              The {site.name} name, logo and website content belong to {site.legal.companyName} unless stated otherwise
              and may not be reused without permission.
            </p>
          ),
        },
        {
          id: "liability",
          title: "Limitation of liability",
          body: (
            <p>
              The website is provided &ldquo;as is&rdquo;. To the extent permitted by law, we are not liable for losses
              arising from its use or from temporary unavailability.
            </p>
          ),
        },
        {
          id: "law",
          title: "Governing law",
          body: <p>These terms are governed by the laws of {site.legal.jurisdiction}, subject to legal review.</p>,
        },
        {
          id: "contact",
          title: "Contact",
          body: (
            <p>
              Questions about these terms? Email <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
