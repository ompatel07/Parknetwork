import { site } from "@/config/site";
import { Hero } from "@/components/sections/home/Hero";
import { Manifesto } from "@/components/sections/home/Manifesto";
import { Multiview } from "@/components/sections/home/Multiview";
import { RolesStack } from "@/components/sections/home/RolesStack";
import { Countdown } from "@/components/sections/home/Countdown";
import { OnAirReel } from "@/components/sections/home/OnAirReel";
import { GlobeSection } from "@/components/sections/shared/GlobeSection";
import { FaqTeaser } from "@/components/sections/home/FaqTeaser";
import { GoLive } from "@/components/sections/home/GoLive";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Multiview />
      <RolesStack />
      <Countdown />
      <OnAirReel />
      <GlobeSection channel="06" />
      <div className="relative border-y border-line bg-bg/60 py-6 backdrop-blur-sm md:py-10" aria-label="Countries we serve">
        <VelocityMarquee items={site.regions.map((r) => r.name)} />
        <VelocityMarquee items={[...site.regions].reverse().map((r) => r.name)} speed={-50} outline />
      </div>
      <FaqTeaser channel="07" />
      <GoLive channel="08" />
    </>
  );
}
