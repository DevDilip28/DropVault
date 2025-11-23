import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { form } from "@heroui/theme";
import { and, eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import { use } from "react";
import { v4 as uuidv4 } from "uuid";
import { tr } from "zod/v4/locales";

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const formUserId = formData.get("userId") as string;
        const parentId = formData.get("parentId") as string || null;

        if (formUserId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        if (parentId) {
            const parentFolder = await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.id, parentId),
                        eq(files.userId, userId),
                        eq(files.isFolder, true)
                    )
                )
        }

        if (!parentId) {
            return NextResponse.json({ error: "Parent folder not found" }, { status: 401 });
        }

        if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
            return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(buffer);

        const folderPath = parentId ? `/dropvault/${userId}/folder/${parentId}` : `/dropvault/${userId}`;

        const originalFileName = file.name;
        const fileExtension = originalFileName.split('.').pop()?.toLowerCase() || '';

        if (!fileExtension || fileExtension.trim() === "") {
            return NextResponse.json(
                { error: "File has no extension" },
                { status: 400 }
            );
        }

        const allowedExtensions = ["jpg", "png", "gif", "pdf"];

        if (!allowedExtensions.includes(fileExtension)) {
            return NextResponse.json({ error: "Invalid file extension" }, { status: 400 });
        }

        const uniqueFileName = `${uuidv4()}.${fileExtension}`;

        const uploadResponse = await imagekit.upload({
            file: fileBuffer,
            fileName: uniqueFileName,
            folder: folderPath,
            useUniqueFileName: false,
        })

        const fileData = {
            name: originalFileName,
            path: uploadResponse.filePath,
            size: file.size,
            type: file.type,
            fileUrl: uploadResponse.url,
            thumbnailUrl: uploadResponse.thumbnailUrl || null,
            userId: userId,
            parentId: parentId,
            isFolder: false,
            isStarred: false,
            isTrash: false,
        };

        const [newFile] = await db.insert(files).values(fileData).returning();

        return NextResponse.json(newFile);

    } catch (error) {
        console.error("File upload error:", error);
        return NextResponse.json({ error: "Failed to uplaod file" }, { status: 500 });
    }
}
