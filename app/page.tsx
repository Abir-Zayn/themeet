import React from "react";
import ExploreBtn from "./components/explore-btn";
import EventCard from "@/components/eventCard";
import { events } from "@/lib/constant";

const page = () => {
  return (
    <section>
      <h1 className="text-center">
        The colon for every dev
        <br /> event You can&apos;t miss.
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, Conferences . All here{" "}
      </p>
      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        {events.map((event, index) => (
          <div key={index} className="p-5">
            <h4 className="text-lg font-semibold">{event.title}</h4>\
            <EventCard
              title={event.title}
              image="/images/event1.png"
              location={event.location}
              slug={event.slug}
              date={event.date}
              time={event.time}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
export default page;
