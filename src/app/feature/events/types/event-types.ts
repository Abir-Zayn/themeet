import { ReactNode } from "react";

export type EventAgendaProps = {
  agendaItems: string[];
  children?: ReactNode;
};

export type EventTagProps = {
  tags: string[];
};

export type EventDetailsPageProps = {
  event: {
    id: string;
    title: string;
    description: string;
    image?: string;
    overview: string;
    date: string;
    time: string;
    location: string;
    mode: string;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
  };
};