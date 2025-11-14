import { LucideIcon } from "lucide-react";

interface EventDetailsItemProps {
  icon: LucideIcon;
  alt: string;
  label: string;
}

export const EventDetailsItem = ({ icon: Icon, alt, label }: EventDetailsItemProps) => (
  <div className="flex-row-gap-2 items-center">
    <Icon size={16} />
    <p>{label}</p>
  </div>
);