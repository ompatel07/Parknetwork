import {
  AudioLines,
  BriefcaseBusiness,
  Building2,
  Coins,
  Crown,
  Handshake,
  Mic,
  Radio,
  ShieldCheck,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/config/site";

const map = {
  audio: AudioLines,
  stream: Radio,
  agency: Building2,
  host: Mic,
  coins: Coins,
  handshake: Handshake,
  shield: ShieldCheck,
  crown: Crown,
  briefcase: BriefcaseBusiness,
  mic: Mic,
} satisfies Record<IconName, React.ComponentType<LucideProps>>;

/** Renders a config icon name as a lucide icon. */
export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const C = map[name];
  return <C aria-hidden strokeWidth={1.6} {...props} />;
}
