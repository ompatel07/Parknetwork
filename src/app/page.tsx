import { site } from "@/config/site";
import { Hero } from "@/components/sections/home/Hero";
import { Manifesto } from "@/components/sections/home/Manifesto";
import { Multiview } from "@/components/sections/home/Multiview";
import { RoleSwitcher } from "@/components/sections/shared/RoleSwitcher";
import { Countdown } from "@/components/sections/home/Countdown";
import { FaqTeaser } from "@/components/sections/home/FaqTeaser";
import { GoLive } from "@/components/sections/home/GoLive";
import { GlobeSection } from "@/components/sections/shared/GlobeSection";
import { Ecosystem } from "@/components/sections/shared/Ecosystem";
import { WhyChoose } from "@/components/sections/shared/WhyChoose";
import { Leadership } from "@/components/sections/shared/Leadership";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Multiview />
      <Ecosystem channel="03" />
      <WhyChoose channel="04" />
      <Leadership channel="05" />
      <RoleSwitcher />
      <Countdown channel="07" />
      <GlobeSection channel="08" />
      <div className="relative border-y border-line bg-bg py-6 md:py-10" aria-label="Serving every country">
        <VelocityMarquee items={["Every country", ...site.regions.map((r) => r.name)]} />
        <VelocityMarquee items={["Every time zone", ...[...site.regions].reverse().map((r) => r.name)]} speed={-50} outline />
      </div>
      <FaqTeaser channel="09" />
      <GoLive channel="10" />
    </>
  );
}
