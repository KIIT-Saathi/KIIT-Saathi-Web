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
        setError(null);

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        
        if (accessToken) {
          headers["Authorization"] = `Bearer ${accessToken}`;
        }

        console.log("🔍 Fetching events from /api/events...");

        const response = await fetch("/api/events", {
          method: "GET",
          headers,
          credentials: "include",
        });

        console.log("📡 Response status:", response.status);

        const data = await response.json();
        console.log("📊 Response data:", data);

        if (!response.ok) {
          throw new Error(data.message || data.error || "Failed to fetch events");
        }

        // Your API returns { success: true, data: [...] }
        // NOT { events: [...] }
        if (data.success && data.data) {
          console.log("✅ Events loaded:", data.data.length);
          setEvents(data.data);
        } else if (data.data) {
          // Fallback if success field is missing
          console.log("✅ Events loaded (fallback):", data.data.length);
          setEvents(data.data);
        } else {
          console.warn("⚠️ No events data in response");
          setEvents([]);
        }
      } catch (err: any) {
        console.error("❌ Error fetching events:", err);
        setError(err.message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [accessToken]);

  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.event_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .sort((a, b) => {
      return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
    });

  return { events, upcomingEvents, loading, error };
}