import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Generate secure upload auth params 
        const { token, expire, signature } = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
        });

        return NextResponse.json({
            token,
            expire,
            signature,
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        });
    } catch (error) {
        console.error("ImageKit auth error:", error);
        return NextResponse.json(
            { error: "Failed to generate upload credentials" },
            { status: 500 }
        );
    }
}
