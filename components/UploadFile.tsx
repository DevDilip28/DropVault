"use client";

import { useState, useRef } from "react";
import { upload } from "@imagekit/next";
import { Upload, FileUp, X, AlertTriangle } from "lucide-react";

export default function UploadFile({ userId, parentId }) {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleSelect = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const ext = selected.name.split(".").pop().toLowerCase();
    const allowed = ["jpg", "jpeg", "png", "gif", "pdf"];

    if (!allowed.includes(ext)) {
      setError("File type not allowed");
      return;
    }
    if (selected.size > 20 * 1024 * 1024) {
      setError("Max 20MB allowed");
      return;
    }

    setFile(selected);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return;

    const ext = file.name.split(".").pop();
    setUploading(true);
    setProgress(0);

    const auth = await fetch("/api/imagekit-auth").then((r) => r.json());

    const folderPath = parentId
      ? `/dropvault/${userId}/folders/${parentId}`
      : `/dropvault/${userId}/root`;

    const ikRes = await upload({
      file,
      fileName: `${crypto.randomUUID()}.${ext}`,
      folder: folderPath,
      ...auth,
      onProgress: (evt) => setProgress((evt.loaded / evt.total) * 100),
    });

    await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagekit: ikRes, userId, parentId }),
    });

    setFile(null);
    setError("");
    setUploading(false);
    setProgress(0);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">

      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white text-gray-700 shadow-sm hover:bg-gray-50"
      >
        <FileUp className="h-4 w-4 text-indigo-600" />
        Choose File
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleSelect}
        className="hidden"
      />

      <div className="p-8 border border-dashed border-gray-300 rounded-xl bg-white text-center shadow-sm hover:border-indigo-300 transition">

        {!file ? (
          <div className="space-y-3">
            <Upload className="h-10 w-10 text-gray-400 mx-auto" />
            <p className="text-gray-700 font-medium">Drag & drop your file here</p>
            <p className="text-gray-500 text-sm">Max size 20MB • JPG, PNG, GIF, PDF</p>
          </div>
        ) : (
          <div className="space-y-4">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileUp className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setFile(null);
                  setError("");
                }}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="flex gap-2 items-center p-3 rounded-lg bg-red-50 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 bg-indigo-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              {uploading ? `Uploading ${progress.toFixed(0)}%` : "Upload File"}
            </button>
          </div>
        )}
      </div>

      <div className="bg-gray-50 border rounded-xl p-4 text-sm text-gray-600">
        <p>✓ Files are private</p>
        <p>✓ Stored securely in your vault</p>
        <p>✓ Supports JPG, PNG, GIF, PDF</p>
        <p>✓ Max file size — 20MB</p>
      </div>

    </div>
  );
}
