"use client";
import { useState, useRef } from "react";
import { Mic, StopCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Statement } from "../types";

declare global {
    interface Window {
        SpeechRecognition?: any;
        webkitSpeechRecognition?: any;
    }
}

export default function SpeechCheck() {
    const SpeechRecognition =
        typeof window !== "undefined"
            ? window.SpeechRecognition || window.webkitSpeechRecognition
            : null;

    if (!SpeechRecognition) {
        console.error(
            "❌ Web Speech API is not supported in this browser. Use Chrome or Edge."
        );
    }

    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcribedText, setTranscribedText] = useState<string | null>(null);
    const [result, setResult] = useState<{ confidenceScore: number; statements: Statement[] } | null>(null);
    const recognitionRef = useRef<null | SpeechRecognition>(null);

    const startRecording = () => {
        if (!SpeechRecognition) {
            alert("Web Speech API is not supported in your browser. Use Chrome or Edge.");
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognition.lang = "en-US";
            recognition.continuous = false;
            recognition.interimResults = false;

            recognitionRef.current = recognition;
            setIsRecording(true);

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                const transcript = event.results[0][0].transcript;
                setTranscribedText(transcript);
                sendTextToBackend(transcript);
            };

            recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error("Speech Recognition Error:", event);
                alert("Error with speech recognition. Please try again.");
                setIsRecording(false);
            };

            recognition.onend = () => setIsRecording(false);
            recognition.start();
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Error accessing microphone. Please ensure you have granted microphone permissions.");
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsRecording(false);
            setIsProcessing(true);
        }
    };

    const sendTextToBackend = async (text: string) => {
        try {
            setIsProcessing(true);

            const response = await fetch("http://localhost:5000/api/factcheck", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) throw new Error("Failed to process text");

            const data = await response.json();
            console.log("✅ Received Fact Check Data:", JSON.stringify(data, null, 2));  // 🔍 Debugging Output
            setResult(data);
        } catch (error) {
            console.error("❌ Error processing text:", error);
            alert("Error processing text. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center text-gray-300 hover:text-white mb-8">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                </Link>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Speech Fact Checker</h1>
                    <p className="text-gray-300">Speak clearly into your microphone to fact-check statements</p>
                </div>

                <div className="flex justify-center mb-12">
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isProcessing}
                        className={`p-8 rounded-full transition-all duration-300
                            ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}
                            ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isProcessing ? (
                            <Loader2 className="w-12 h-12 animate-spin" />
                        ) : isRecording ? (
                            <StopCircle className="w-12 h-12" />
                        ) : (
                            <Mic className="w-12 h-12" />
                        )}
                    </button>
                </div>

                {transcribedText && (
                    <div className="bg-gray-800 rounded-lg p-6 text-center">
                        <h2 className="text-xl font-semibold">Transcribed Speech</h2>
                        <p className="text-lg text-gray-300 mt-2">{transcribedText}</p>
                    </div>
                )}

                {result && (
                    <div className="space-y-8">
                        <div className="space-y-6">
                            {result.statements.map((statement, index) => (
                                <div key={index} className="bg-gray-800 rounded-lg p-6">

                                    {statement.sources.length > 0 ? (
                                        <div className="mt-2">
                                            <p className="text-gray-400">Fact-checked sources:</p>
                                            {statement.sources.map((source, idx) => (
                                                <div key={idx} className="bg-gray-700 p-4 rounded-lg mb-2">
                                                    <h3 className="text-lg font-semibold mb-2">Source {idx + 1}</h3>

                                                    {/* 🔹 Dynamically display all attributes of each source */}
                                                    {Object.entries(source).map(([key, value]) => (
                                                        <p key={key} className="text-sm text-gray-300">
                                                            <strong>{key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}:</strong>{" "}
                                                            {typeof value === "string" ? (
                                                                key.toLowerCase() === "url" ? (
                                                                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                                                        {value}
                                                                    </a>
                                                                ) : (
                                                                    value
                                                                )
                                                            ) : "Unknown"}
                                                        </p>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400">No sources available</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
