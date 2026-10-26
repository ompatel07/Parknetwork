import { notFound } from "next/navigation";

/** Any unknown URL renders the site's own 404 page (with header and footer). */
export default function Missing() {
  notFound();
}
