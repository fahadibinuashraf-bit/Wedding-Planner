import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getProfile, getUser } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const profile = await getProfile();

  return (
    <DashboardShell profile={profile} email={user?.email}>
      {children}
    </DashboardShell>
  );
}
