import {
  Gamepad2,
  Radio,
  Play,
  Music,
  MonitorPlay,
  Blocks,
  Dice5,
  Sparkles,
  Star,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  gamepad: Gamepad2,
  radio: Radio,
  youtube: Play,
  music: Music,
  twitch: MonitorPlay,
  blocks: Blocks,
  dice: Dice5,
  sparkles: Sparkles,
  star: Star,
};

export function CategoryIcon({
  icon,
  className,
}: {
  icon: string | null | undefined;
  className?: string;
}) {
  const Icon = (icon && iconMap[icon]) || Layers;
  return <Icon className={cn(className ?? "size-5")} />;
}