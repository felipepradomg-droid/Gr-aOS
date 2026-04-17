import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SidebarClient from "@/components/SidebarClient";
export default async function AppLayout({ children }: {children: React.ReactNode }) { const session = await getServerSession(authOptions);
if (!session) redirect("/login");
return (
<div className="app-layout">
<SidebarClient session={session} />
<main className="app-main">{children}</main>
</div>
);
}
