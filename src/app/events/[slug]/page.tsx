import { notFound } from 'next/navigation';
import { EventDetailsPage } from '@/src/app/feature/events/components/event-details/event-details-page';
import { EventDetailsPageProps } from '@/src/app/feature/events/types/event-types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const getEvent = async (slug: string) => {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${BASE_URL}/api/events/${slug}`, { 
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch event');
    }
    
    const data = await response.json();
    return data.event;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
};

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  const resolvedEventId = typeof event.id === 'string' ? event.id : event._id?.toString?.() ?? '';

  // Transform the event data to match the expected props
  const eventProps: EventDetailsPageProps = {
    event: {
      id: resolvedEventId,
      title: event.title,
      description: event.description,
      image: event.image,
      overview: event.overview,
      date: event.date,
      time: event.time,
      location: event.location,
      mode: event.mode,
      audience: event.audience,
      agenda: event.agenda,
      organizer: event.organizer,
      tags: event.tags,
    },
  };

  return <EventDetailsPage {...eventProps} />;
}
