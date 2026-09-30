"use client";

import { Trash2 } from "lucide-react";
import { deleteEvent } from "@/app/dashboard/events/actions";

interface Props {
  id: string;
}

export function DeleteEventButton({ id }: Props) {
  return (
    <button
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const ok = window.confirm(
          "Are you sure you want to delete this event?"
        );

        if (!ok) return;

        await deleteEvent(id);
      }}
      className="rounded-md p-2 text-red-500 transition hover:bg-red-50 hover:text-red-600"
      title="Delete Event"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}