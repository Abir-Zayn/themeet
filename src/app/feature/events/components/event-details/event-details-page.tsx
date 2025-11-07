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
    <section id="event">
      <h2>{event.title}</h2>
      <div className="header">
        <h1>Description</h1>
        <p className="mt-2">{event.description}</p>
      </div>

      <div>
        <div className="content">
          {hasImage && (
            <Image
              src={event.image as string}
              alt="Event Banner"
              width={500}
              height={500}
              className="banner"
              priority
            />
          )}
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{event.overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
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
          </section>

          <EventAgenda agendaItems={event.agenda} />
          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{event.organizer}</p>
          </section>

          <EventTag tags={event.tags} />
        </div>
        <aside className="booking">
          <p className="text-lg font-semibold">Booking Form</p>
        </aside>
      </div>
    </section>
  );
};
