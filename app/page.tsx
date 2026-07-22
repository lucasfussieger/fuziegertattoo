import { getFeedbacks, feedbackStats } from "@/lib/feedback";
import HomeClient from "./home-client";

export const dynamic = "force-dynamic";

export default async function Home() {
  const items = await getFeedbacks();
  const { avg, count } = feedbackStats(items);

  return <HomeClient avg={avg} count={count} />;
}
