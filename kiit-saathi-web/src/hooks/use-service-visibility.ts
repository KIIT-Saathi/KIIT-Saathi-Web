"use client";

import { useEffect, useState } from "react";

export function useServiceVisibility() {
  const [visibilityMap, setVisibilityMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [hasFetchedData, setHasFetchedData] = useState(false);

  useEffect(() => {
    async function loadVisibility() {
      try {
        const res = await fetch("/api/service-visibility");
        const json = await res.json();

        if (!res.ok) throw new Error(json.error);

        const map: Record<string, any> = {};
        json.services.forEach((item: any) => {
          map[item.service_id] = {
            visible: item.visible,
            replaced_text: item.replaced_text,
          };
        });

        setVisibilityMap(map);
        setHasFetchedData(true);
      } catch (err) {
        console.error("Visibility fetch failed:", err);
        setHasFetchedData(true);
      } finally {
        setLoading(false);
      }
    }

    loadVisibility();
  }, []);

  return { visibilityMap, loading, hasFetchedData };
}
