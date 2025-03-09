"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Image as ImageIcon, Link } from "lucide-react";

export default function ScannerScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [urlInputVisible, setUrlInputVisible] = useState(false);
    const [urlInput, setUrlInput] = useState("");

    useEffect(() => {
        console.log("ScannerScreen mounted");
    }, []);

    const processImage = async (uri: string) => {
        setIsLoading(true);
        try {
            console.log("Navigating to HighlightScreen with params:", { imageUri: uri });
            router.push(`/imageHighlight?imageUri=${encodeURIComponent(uri)}`);
        } catch (error) {
            console.error("Error in processImage:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadImage = async () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.onchange = async (event: any) => {
            const file = event.target.files[0];
            if (file) {
                const imageUrl = URL.createObjectURL(file);
                await processImage(imageUrl);
            }
        };
        fileInput.click();
    };

    const handlePasteLink = () => {
        setUrlInputVisible(!urlInputVisible);
    };

    const handleSubmitUrl = () => {
        const query = urlInput.trim();
        if (!query) {
            console.log("No URL provided");
            setUrlInputVisible(false);
            setUrlInput("");
            return;
        }
        setUrlInputVisible(false);
        setIsLoading(true);
        setTimeout(() => {
            try {
                router.push(`/imageFactcheck?query=${encodeURIComponent(query)}`);
            } catch (error) {
                console.error("Error in handleSubmitUrl:", error);
            } finally {
                setIsLoading(false);
                setUrlInput("");
            }
        }, 2000);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold">Text Recognition</h1>
            <p className="text-lg text-gray-400 mb-6">Select an Option</p>

            <div className="space-y-4 w-full max-w-sm">
                <button
                    onClick={handleUploadImage}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-3 w-full bg-green-500 py-3 rounded-lg shadow-lg hover:bg-green-600 transition"
                >
                    {isLoading ? "Loading..." : <ImageIcon size={24} />}
                    <span>Upload Image</span>
                </button>

                <button
                    onClick={handlePasteLink}
                    className="flex items-center justify-center gap-3 w-full bg-blue-500 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
                >
                    <Link size={24} />
                    <span>{urlInputVisible ? "Hide URL Input" : "Paste URL"}</span>
                </button>

                {urlInputVisible && (
                    <div className="flex flex-col bg-gray-800 p-4 rounded-lg space-y-2">
                        <input
                            type="text"
                            className="bg-gray-700 text-white px-3 py-2 rounded w-full"
                            placeholder="https://example.com"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                        />
                        <div className="flex justify-between">
                            <button onClick={() => setUrlInputVisible(false)} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
                                Cancel
                            </button>
                            <button onClick={handleSubmitUrl} className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
