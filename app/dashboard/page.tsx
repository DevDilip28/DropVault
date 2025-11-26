import DashboardContent from "@/components/DashboardContent";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  return (
    <DashboardContent
      userId={userId!}
      userName={user?.firstName || "User"}
    />
  );
}
