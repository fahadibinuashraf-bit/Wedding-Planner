"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { toggleTaskStatus } from "@/app/dashboard/tasks/actions";

interface Props {
  id: string;
  status: string | null;
}

export function TaskCheckbox({
  id,
  status,
}: Props) {
  return (
    <Checkbox
      checked={status === "completed"}
      onCheckedChange={async (checked) => {
        await toggleTaskStatus(id, checked === true);
      }}
    />
  );
}