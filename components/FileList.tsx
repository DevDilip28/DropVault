"use client";

import { useEffect, useState } from "react";
import { Folder, Image as ImageIcon, FileText, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function FileList({ userId }) {
    const [files, setFiles] = useState([]);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [folderPath, setFolderPath] = useState([]);

    const fetchFiles = async () => {
        const url = currentFolder
            ? `/api/files?parentId=${currentFolder}`
            : `/api/files`;

        const res = await fetch(url);
        const data = await res.json();
        setFiles(data);
    };

    useEffect(() => {
        fetchFiles();
    }, [currentFolder]);

    const openFolder = (folder) => {
        setCurrentFolder(folder.id);
        setFolderPath([...folderPath, folder]);
    };

    const goBack = () => {
        const newPath = [...folderPath];
        newPath.pop();
        setFolderPath(newPath);

        const newFolder = newPath.length ? newPath[newPath.length - 1].id : null;
        setCurrentFolder(newFolder);
    };

    return (
        <div className="space-y-4">

            <div className="flex items-center gap-2 text-gray-600 mb-4">
                {folderPath.length > 0 && (
                    <button
                        onClick={goBack}
                        className="flex items-center gap-1 text-sm text-indigo-600 hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                )}

                <span className="font-medium text-gray-900">
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">

                {files.map((file) =>
                    file.isFolder ? (
                        <button
                            key={file.id}
                            onClick={() => openFolder(file)}
                            className="p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-center"
                        >
                            <Folder className="h-10 w-10 text-indigo-600" />
                            <p className="mt-2 text-sm font-medium text-gray-900 truncate w-full text-center">
                                {file.name}
                            </p>
                        </button>
                    ) : (
                        <div
                            key={file.id}
                            className="p-3 bg-white border rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
                            onClick={() => window.open(file.fileUrl, "_blank")}
                        >
                            <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">

                                {file.type.startsWith("image/") ? (
                                    <Image
                                        src={file.thumbnailUrl || file.fileUrl}
                                        alt={file.name}
                                        width={200}
                                        height={200}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <FileText className="h-10 w-10 text-gray-400" />
                                )}

                            </div>

                            <p className="mt-2 text-sm font-medium text-gray-900 truncate">
                                {file.name}
                            </p>

                            <p className="text-xs text-gray-400">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    )
                )}
            </div>

            {files.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <ImageIcon className="h-12 w-12 mx-auto mb-3" />
                    <p>No files here yet</p>
                </div>
            )}
        </div>
    );
}
