"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteVendor } from "./actions";

interface Props {
  id: string;
  eventId: string;
}

export function DeleteVendor({
  id,
  eventId,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vendor?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      await deleteVendor(id, eventId);
    } catch (error) {
      console.error(error);
      alert("Failed to delete vendor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      title="Delete vendor"
      className="rounded-md p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  );
}