import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import SpotlightCard from "@/src/app/components/SpotlightCard";

interface Props {
  title: string;
  image: string;
  location: string;
  slug: string;
  date: string;
  time: string;
}

const EventCard = ({ title, image, slug, location, date, time }: Props) => {
  return (
    <SpotlightCard
      className="w-full overflow-hidden transition-all duration-300 bg-transparent border-transparent rounded-xl group p-0"
      spotlightColor="rgba(0, 229, 255, 0.2)"
    >
      <Link href={`/events/${slug}`} className="block text-foreground hover:text-foreground/80">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2 h-14 overflow-hidden text-foreground">
            {title}
          </h3>
        </div>
        
        <div className="p-4 pt-0 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{time}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 pt-0">
          {/* Additional footer content can go here */}
        </div>
      </Link>
    </SpotlightCard>
  );
};

export default EventCard;
