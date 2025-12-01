import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export function useEvents() {
  const { accessToken } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const headers: HeadersInit = {};
        if (accessToken)
          headers["Authorization"] = `Bearer ${accessToken}`;

        const response = await fetch("/api/events", {
          headers,
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch events");
        }

        setEvents(data.events || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [accessToken]);

  const upcomingEvents = events
    .filter(event => new Date(event.event_date) > new Date())
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

  return { events, upcomingEvents, loading, error };
}
