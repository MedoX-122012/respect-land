import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnnouncementLoading } from "@/components/sections/announcement-banner";
import { MaintenancePage } from "@/components/maintenance";
import { getSettings } from "@/lib/queries";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let maintenance = false;
  try {
    const settings = await getSettings();
    maintenance = settings?.maintenanceMode ?? false;
  } catch {
    maintenance = false;
  }

  if (maintenance) {
    return <MaintenancePage />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementLoading />
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}