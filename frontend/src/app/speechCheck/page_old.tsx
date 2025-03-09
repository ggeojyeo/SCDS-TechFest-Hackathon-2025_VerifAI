"use client";
import { useState, useRef } from 'react';
import { Mic, StopCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Statement } from '../types';

export default function SpeechCheck() {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{
        confidenceScore: number;
        statements: Statement[];
    } | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                await processAudio(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Error accessing microphone. Please ensure you have granted microphone permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsProcessing(true);
        }
    };

    const processAudio = async (audioBlob: Blob) => {
        try {
            const formData = new FormData();
            formData.append("audio", audioBlob, "audio.wav");

            console.log("🔹 Sending audio to backend...");

            const response = await fetch("http://localhost:5000/api/factcheck/audio", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to process audio");
            }

            const data = await response.json();
            console.log("✅ Backend Response:", data);
            setResult(data);
        } catch (error) {
            console.error("❌ Error processing audio:", error);
            alert("Error processing audio. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center text-gray-300 hover:text-white mb-8"
                >
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
                        className={`
              p-8 rounded-full transition-all duration-300
              ${isRecording
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-blue-500 hover:bg-blue-600'
                            }
              ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
            `}
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

                {result && (
                    <div className="space-y-8">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Overall Confidence Score</h2>
                            <div className="w-full bg-gray-700 rounded-full h-4">
                                <div
                                    className="bg-blue-500 rounded-full h-4"
                                    style={{ width: `${result.confidenceScore}%` }}
                                ></div>
                            </div>
                            <p className="text-right mt-2">{result.confidenceScore}%</p>
                        </div>

                        <div className="space-y-6">
                            {result.statements.map((statement, index) => (
                                <div key={index} className="bg-gray-800 rounded-lg p-6">
                                    <p className="text-lg mb-4">{statement.text}</p>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${statement.verdict === 'verified' && 'bg-green-500'}
                      ${statement.verdict === 'partiallyAccurate' && 'bg-yellow-500'}
                      ${statement.verdict === 'false' && 'bg-red-500'}
                      ${statement.verdict === 'unverified' && 'bg-gray-500'}
                    `}>
                                            {statement.verdict}
                                        </span>
                                        <span>Confidence: {statement.confidenceScore}%</span>
                                    </div>
                                    <p className="text-gray-300 mb-4">{statement.explanation}</p>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold">Sources:</h3>
                                        {statement.sources && statement.sources.length > 0 ? (
                                            statement.sources.map((source, sourceIndex) => (
                                                <div key={sourceIndex} className="bg-gray-700 rounded p-4">
                                                    <a
                                                        href={source.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:underline font-medium"
                                                    >
                                                        {source.name}
                                                    </a>
                                                    <p className="text-sm text-gray-300 mt-1">{source.snippet}</p>
                                                    <span className="text-xs text-gray-400">{source.type}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-400">No sources available</p>
                                        )}

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}