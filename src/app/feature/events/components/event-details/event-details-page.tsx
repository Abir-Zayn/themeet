import { BookingModal } from "@/src/app/feature/booking/components/booking-modal";
import {
  Calendar,
  Clock1,
  Eclipse,
  LocationEdit,
  UserRoundSearch,
} from "lucide-react";
import Image from "next/image";
import { EventDetailsItem } from "./event-details-item";
import { EventAgendaProps, EventDetailsPageProps, EventTagProps } from "../../types/event-types";

const EventAgenda = ({ agendaItems, children }: EventAgendaProps) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
    {children}
  </div>
);

const EventTag = ({ tags }: EventTagProps) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div key={tag} className="pill">
        {tag}
      </div>
    ))}
  </div>
);

export const EventDetailsPage = ({ event }: EventDetailsPageProps) => {
  const hasImage = typeof event.image === "string" && event.image.trim().length > 0;

  return (
    <section id="event" className="p-4 w-full max-w-6xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">{event.title}</h2>
      
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        <div className="w-full lg:w-2/3">
          <div className="header mb-6">
            <h1 className="text-xl md:text-2xl font-semibold mb-2">Description</h1>
            <p className="text-base md:text-lg">{event.description}</p>
          </div>

          <div className="space-y-6">
            {hasImage && (
              <div className="w-full h-48 md:h-64 lg:h-80 relative rounded-lg overflow-hidden">
                <Image
                  src={event.image as string}
                  alt="Event Banner"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">Overview</h2>
              <p className="text-base md:text-lg">{event.overview}</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Event Details</h2>
              <div className="space-y-2 text-base md:text-lg">
                <EventDetailsItem
                  icon={Calendar}
                  alt="Event Date"
                  label={event.date}
                />
                <EventDetailsItem
                  icon={Clock1}
                  alt="clock"
                  label={event.time}
                />
                <EventDetailsItem
                  icon={LocationEdit}
                  alt="Location"
                  label={event.location}
                />
                <EventDetailsItem
                  icon={Eclipse}
                  alt="Mode"
                  label={event.mode}
                />
                <EventDetailsItem
                  icon={UserRoundSearch}
                  alt="Audience"
                  label={event.audience}
                />
              </div>
            </section>

            <div className="agenda space-y-2">
              <h2 className="text-xl font-semibold">Agenda</h2>
              <ul className="list-disc pl-5 space-y-1">
                {event.agenda.map((item, index) => (
                  <li key={index} className="text-base md:text-lg">{item}</li>
                ))}
              </ul>
            </div>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">About the Organizer</h2>
              <p className="text-base md:text-lg">{event.organizer}</p>
            </section>

            <div className="pt-2">
              <EventTag tags={event.tags} />
            </div>
          </div>
        </div>
        
        <aside className="w-full lg:w-1/3 mt-6 lg:mt-0">
          <div className=" rounded-lg shadow-md p-6 sticky top-4">
            <p className="text-lg md:text-xl font-semibold mb-4">Booking Form</p>
            <div className="space-y-4">
              <BookingModal
                eventId={event.id}
                trigger={
                  <button className="w-full bg-primary text-black py-2 px-4 rounded-md text-sm md:text-base transition-colors">
                    Register Now
                  </button>
                }
              />
              <button className="w-full border border-primary text-primary hover:bg-primary/10 py-2 px-4 rounded-md text-sm md:text-base transition-colors">
                Add to Calendar
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};
