import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";

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
    <Link href={`/events/${slug}`} id="event-card">
      <div className="event-card">
        <Image src={image} alt={title} width={400} height={200} />

        <div className="flex flex-row gap-2">
          <MapPin />
          <p>{location}</p>
        </div>
        <p className="title">{title}</p>

        <div className="datetime">
          <div>
            <Calendar />
            <p>{date}</p>
          </div>
          <div>
            <Clock />
            <p>{time}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
