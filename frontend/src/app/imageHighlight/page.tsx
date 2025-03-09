"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:5000"; // Update to your backend URL

export default function HighlightScreen() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const imageUri = searchParams.get("imageUri");

    const [highlights, setHighlights] = useState<{ x: number; y: number; width: number; height: number }[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const startPoint = useRef<{ x: number; y: number } | null>(null);


    if (!imageUri) {
        return <div className="text-white text-center">Error: No image data provided</div>;
    }

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        startPoint.current = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
        setIsDrawing(true);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!isDrawing || !startPoint.current) return;

        const { offsetX, offsetY } = event.nativeEvent;

        const newHighlight = {
            x: Math.min(startPoint.current.x, offsetX),
            y: Math.min(startPoint.current.y, offsetY),
            width: Math.abs(offsetX - startPoint.current.x),
            height: Math.abs(offsetY - startPoint.current.y),
        };

        setHighlights((prev) => (prev.length > 0 ? [...prev.slice(0, -1), newHighlight] : [newHighlight]));
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        startPoint.current = null;
    };

    const handleConfirm = async () => {
        if (highlights.length === 0) return;

        try {
            setIsDrawing(false);

            // 🔹 Convert image URI to Blob
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const file = new File([blob], "highlighted-image.png", { type: "image/png" });

            const formData = new FormData();
            formData.append("file", file); // ✅ Send Image
            formData.append("highlights", JSON.stringify(highlights)); // ✅ Send Highlight Data

            const apiResponse = await fetch(`${API_BASE_URL}/api/tvbd`, {
                method: "POST",
                body: formData, // ✅ Send as FormData
            });

            const data = await apiResponse.json();
            console.log("✅ Server Response:", data);

            // ✅ Redirect with extracted text
            router.push(`/imageFactcheck?extractedText=${encodeURIComponent(data.extractedText)}&factCheckResults=${encodeURIComponent(JSON.stringify(data.factCheckResults))}&imageUri=${encodeURIComponent(imageUri)}`);
        } catch (error) {
            console.error("❌ Error sending data to backend:", error);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold">Highlight Text</h1>
            <p className="text-gray-400 mb-4">Click and drag to highlight text</p>

            <div
                className="relative border border-gray-600 p-2 cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <img src={imageUri} alt="Highlightable" className="max-w-full h-auto" />
                {highlights.map((highlight, index) => (
                    <div
                        key={index}
                        className="absolute bg-yellow-300 opacity-50 border border-yellow-500"
                        style={{
                            left: highlight.x,
                            top: highlight.y,
                            width: highlight.width,
                            height: highlight.height,
                            position: "absolute",
                        }}
                    />
                ))}
            </div>

            <button
                onClick={handleConfirm}
                disabled={highlights.length === 0}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
                Confirm Selection ✅
            </button>
        </div>
    );
}
