import React from "react";
import ExploreBtn from "./components/explore-btn";
import EventCard from "@/src/app/feature/events/components/eventCard";
import { IEvent } from "@/src/lib/database/event.model";

export const dynamic = 'force-dynamic';

const getEvents = async () => {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${BASE_URL}/api/events`, { 
      cache: 'no-store' // Ensure fresh data in development
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    
    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

const Home = async () => {
  const events = await getEvents();

  return (
    <section>
      <h1 className="text-center">
        The colon for every dev
        <br /> event You can't miss.
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, Conferences . All here
      </p>
      <ExploreBtn />

      <div className="mt-20 space-y-7 ml-20">
        <h3>Featured Events</h3>
        {events.length > 0 ? (
          <ul className="flex gap-6 overflow-x-auto pb-4">
            {events.map((event: IEvent) => (
              <li key={event.title} className="min-w-[380px] flex-shrink-0">
                <EventCard
                  title={event.title}
                  image={event.image}
                  location={event.location}
                  slug={event.slug}
                  date={event.date}
                  time={event.time}
                  totalParticipants={typeof event.totalParticipants === 'number' ? event.totalParticipants : 0}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center p-8">
            <p>No events available at the moment. Check back later!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
