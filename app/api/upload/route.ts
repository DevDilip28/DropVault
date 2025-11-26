import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = (await request.json()) as {
            imagekit: {
                name: string;
                size: number;
                filePath: string;
                url: string;
                fileType?: string;
                mime?: string;
                thumbnailUrl?: string;
            };
            userId: string;
            parentId: string | null;
        };

        const { imagekit, parentId, userId: bodyUserId } = body;

        if (bodyUserId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!imagekit?.url || !imagekit?.filePath) {
            return NextResponse.json({ error: "Invalid ImageKit data" }, { status: 400 });
        }

        let finalParentId: string | null = null;

        if (parentId) {
            const [folder] = await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.id, parentId),
                        eq(files.userId, userId),
                        eq(files.isFolder, true)
                    )
                );

            if (!folder) {
                return NextResponse.json(
                    { error: "Parent folder not found" },
                    { status: 404 }
                );
            }

            finalParentId = parentId;
        }

        const newFile = {
            name: imagekit.name || "untitled",
            path: imagekit.filePath,
            size: imagekit.size,
            type: imagekit.mime || imagekit.fileType || "file",
            fileUrl: imagekit.url,
            thumbnailUrl: imagekit.thumbnailUrl || null,
            userId,
            parentId: finalParentId,
            isFolder: false,
            isStarred: false,
            isTrash: false,
        };


        const [created] = await db.insert(files).values(newFile).returning();

        return NextResponse.json(created);
    } catch (error) {
        console.error("UPLOAD ERROR:", error);
        return NextResponse.json(
            { error: "Failed to save file" },
            { status: 500 }
        );
    }
}
