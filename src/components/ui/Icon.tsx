import {
  AudioLines,
  BriefcaseBusiness,
  Building2,
  Clapperboard,
  Coins,
  Crown,
  Globe,
  Handshake,
  Heart,
  Lock,
  Mic,
  Network,
  Radio,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
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
  heart: Heart,
  video: Clapperboard,
  network: Network,
  globe: Globe,
  trend: TrendingUp,
  lock: Lock,
  scale: Scale,
  users: Users,
  spark: Sparkles,
} satisfies Record<IconName, React.ComponentType<LucideProps>>;

/** Renders a config icon name as a lucide icon. */
export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const C = map[name];
  return <C aria-hidden strokeWidth={1.6} {...props} />;
}
