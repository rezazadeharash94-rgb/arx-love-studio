import { HomeExperience } from "@/components/HomeExperience";
import { getData } from "@/lib/data";
import { currentDashboardMonthKey } from "@/lib/persian";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const { settings, months, goals, checklist, media } = await getData();

  return (
    <HomeExperience
      settings={settings}
      months={months}
      goals={goals}
      checklist={checklist}
      media={media}
      currentMonthKey={currentDashboardMonthKey()}
    />
  );
}
