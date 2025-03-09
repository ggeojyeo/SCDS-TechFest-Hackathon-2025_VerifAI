"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function FactCheckScreen() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const extractedText = searchParams.get("extractedText");
    const factCheckResults = searchParams.get("factCheckResults");
    const imageUri = searchParams.get("imageUri");

    // ✅ Parse fact-check results properly
    const parsedFactCheckResults = factCheckResults ? JSON.parse(decodeURIComponent(factCheckResults)) : [];

    // Auto-redirect after 30 seconds
    useEffect(() => {
        const timer = setTimeout(() => router.replace("/imageUpload"), 30000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            {/* ✅ Header */}
            <div className="text-center mb-6">
                <h1 className="text-4xl font-extrabold">Fact Check Results</h1>
                <p className="text-gray-400 mt-2">Analyzing extracted text & verifying claims</p>
            </div>

            {/* ✅ Image Display - Full-Width Container */}
            {imageUri && (
                <div className="w-full flex justify-center mb-6">
                    <div className="w-full max-w-4xl overflow-hidden rounded-lg border border-gray-700 shadow-lg">
                        <img src={decodeURIComponent(imageUri)} alt="Highlighted" className="w-full h-auto" />
                    </div>
                </div>
            )}

            {/* ✅ Extracted Text */}
            {extractedText && (
                <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold text-gray-300">Extracted Text:</h2>
                    <p className="text-gray-400 mt-2">{decodeURIComponent(extractedText)}</p>
                </div>
            )}

            {/* ✅ Fact Check Results */}
            {parsedFactCheckResults.length > 0 ? (
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-300 mb-4">Fact Check Analysis:</h2>
                    {parsedFactCheckResults.map((claim: any, index: number) => (
                        <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md mb-4 border-l-4 border-blue-500">
                            <p className="text-lg font-bold text-white">{claim.text}</p>
                            {claim.claimReview?.map((review: any, i: number) => (
                                <div key={i} className="mt-3 border-t border-gray-700 pt-3">
                                    <p className="text-blue-400"><strong>Source:</strong> {review.publisher.name}</p>
                                    <p className="text-gray-400"><strong>Verdict:</strong> {review.textualRating}</p>
                                    <a href={review.url} target="_blank" rel="noopener noreferrer" className="text-green-400 underline hover:text-green-300">
                                        Read More
                                    </a>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-center mt-6">No fact-check results found.</p>
            )}

            {/* ✅ Back Button */}
            <div className="text-center mt-8">
                <button
                    onClick={() => router.replace("/imageUpload")}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
                >
                    🔄 Back to Scanner
                </button>
            </div>
        </div>
    );
}
