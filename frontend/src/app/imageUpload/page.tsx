"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Link as LinkIcon, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function ImageCheck() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [urlInputVisible, setUrlInputVisible] = useState(false);
    const [urlInput, setUrlInput] = useState("");

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
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
            <div className="max-w-4xl mx-auto">
                {/* 🔙 Back Button */}
                <Link href="/" className="inline-flex items-center text-gray-300 hover:text-white mb-8">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                </Link>

                {/* 🏆 Title Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Image Analysis</h1>
                    <p className="text-gray-300">Upload an image or provide a URL to extract and verify text</p>
                </div>

                {/* 🌟 Upload & URL Sections */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* 📸 Image Upload Section */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
                        <div
                            className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer"
                            onClick={handleUploadImage}
                        >
                            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-300">
                                Drag and drop your image here, or click to select
                            </p>
                            <button
                                className="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                            >
                                {isLoading ? "Processing..." : "Choose File"}
                            </button>
                        </div>
                    </div>

                    {/* 🔗 URL Input Section */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Enter Image URL</h2>
                        <div className="space-y-4">
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleSubmitUrl}
                                className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                            >
                                Analyze Image
                            </button>
                        </div>
                    </div>
                </div>

                {/* 🏆 Image Analysis Processing Message */}
                <div className="mt-8 text-center text-gray-400">
                    {isLoading ? (
                        <p className="text-lg">Processing image, please wait...</p>
                    ) : (
                        <p>Image analysis functionality is live! Upload or paste a URL to test.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
