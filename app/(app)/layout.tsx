import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SidebarClient from "@/components/SidebarClient";
import { MobileNav } from "@/components/MobileNav";
import { Toaster } from "sonner";
import TrialBanner from "@/components/TrialBanner";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="app-layout">
      <SidebarClient session={session} />
      <main className="app-main">
        <div style={{ padding: "16px 16px 0" }}>
          <TrialBanner />
        </div>
        {children}
      </main>
      <MobileNav />
      <Toaster richColors position="top-right" />
    </div>
  );
}
