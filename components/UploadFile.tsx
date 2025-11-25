"use client";

import { upload } from "@imagekit/next";
import { useState } from "react";

export default function UploadFile({
  userId,
  parentId,
}: {
  userId: string;
  parentId: string | null;
}) {
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);

  async function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validate file extension
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const allowed = ["jpg", "jpeg", "png", "gif", "pdf"];

    if (!allowed.includes(ext)) {
      alert("File type not allowed");
      return;
    }

    // 2. Validate size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      alert("Max size allowed is 20MB");
      return;
    }

    // 3. Get upload auth
    const auth = await fetch("/api/imagekit-auth").then((r) => r.json());

    // 4. Create ImageKit folder path
    const folderPath = parentId
      ? `/dropvault/${userId}/folders/${parentId}`
      : `/dropvault/${userId}/root`;

    setUploading(true);

    // 5. Upload to ImageKit
    const ikRes = await upload({
      file,
      fileName: `${crypto.randomUUID()}.${ext}`,
      folder: folderPath,
      ...auth,
      onProgress: (evt) => {
        setProgress((evt.loaded / evt.total) * 100);
      },
    });

    // 6. Save metadata to DB
    await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imagekit: ikRes,
        userId,
        parentId,
      }),
    });

    setUploading(false);
    alert("Uploaded");
  }

  return (
    <div>
      <input type="file" onChange={handleSelect} />

      {uploading && (
        <progress max={100} value={progress}>
          {progress}%
        </progress>
      )}
    </div>
  );
}
