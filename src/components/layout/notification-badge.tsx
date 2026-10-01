"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function useNotificationCount() {
  const searchParams =
    useSearchParams();

  const eventId =
    searchParams.get("event");

  const [count, setCount] =
    useState(0);

  const [resolvedEventId, setResolvedEventId] =
    useState<string | null>(
      eventId
    );

  useEffect(() => {
    let cancelled = false;

    async function loadCount() {
      try {
        const query = eventId
          ? `?event=${encodeURIComponent(
              eventId
            )}`
          : "";

        const response =
          await fetch(
            `/api/notifications/count${query}`,
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          return;
        }

        const data =
          await response.json();

        if (cancelled) {
          return;
        }

        setCount(
          Number(data.count || 0)
        );

        setResolvedEventId(
          data.eventId
            ? String(data.eventId)
            : eventId
        );
      } catch (error) {
        console.error(
          "Failed to load notification count:",
          error
        );
      }
    }

    loadCount();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  return {
    count,
    eventId: resolvedEventId,
  };
}