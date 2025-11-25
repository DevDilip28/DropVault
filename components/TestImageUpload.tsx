"use client";

import { useState } from "react";
import { upload } from "@imagekit/next";

export default function TestImageUpload() {
  const [log, setLog] = useState("");

  function add(msg: string) {
    setLog((l) => l + "\n" + msg);
  }

  async function handleUpload(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    add("▶ File selected: " + file.name);

    try {
      // 1. GET ImageKit Auth
      const authRes = await fetch("/api/imagekit-auth");
      const auth = await authRes.json();
      add("✔ Auth received");

      // 2. Upload to ImageKit
      add("▶ Uploading to ImageKit...");
      const res = await upload({
        file,
        fileName: file.name,
        ...auth, // token, expire, signature
      });

      add("✔ Upload Success!");
      add(JSON.stringify(res, null, 2));

      add("📸 File URL: " + res.url);

    } catch (err: any) {
      console.error(err);
      add("❌ Upload error:");
      add(err?.message);
    }
  }

  return (
    <div>
      <h2>📤 Test Image Upload</h2>

      <input
        type="file"
        onChange={handleUpload}
        style={{ marginTop: 10 }}
      />

      <pre
        style={{
          background: "#111",
          color: "lime",
          padding: 15,
          marginTop: 20,
          height: 250,
          overflow: "auto",
        }}
      >
        {log}
      </pre>
    </div>
  );
}
