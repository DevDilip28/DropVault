import UploadFile from "@/components/UploadFile";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();

  return (
    <div>
      <h1>Dashboard</h1>

      <UploadFile userId={userId!} parentId={null} />
    </div>
  );
}
