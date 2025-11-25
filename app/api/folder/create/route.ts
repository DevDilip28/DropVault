import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      name: string;
      parentId: string | null;
      userId: string;
    };

    const { name, parentId } = body;

    if (body.userId !== userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!name.trim())
      return NextResponse.json({ error: "Folder name required" }, { status: 400 });

    let finalPath = `/${name.trim()}`;

    if (parentId) {
      const [parent] = await db
        .select()
        .from(files)
        .where(
          and(eq(files.id, parentId), eq(files.userId, userId), eq(files.isFolder, true))
        );

      if (!parent)
        return NextResponse.json({ error: "Parent folder not found" }, { status: 404 });

      finalPath = `${parent.path}/${name.trim()}`;
    }

    const folder = {
      id: uuidv4(),
      name: name.trim(),
      path: finalPath,
      size: 0,
      type: "folder",
      fileUrl: null,
      thumbnailUrl: null,
      userId,
      parentId,
      isFolder: true,
      isStarred: false,
      isTrash: false,
    };

    const [created] = await db.insert(files).values(folder).returning();
    return NextResponse.json(created);
  } catch (err) {
    console.error("FOLDER CREATE ERROR", err);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}
