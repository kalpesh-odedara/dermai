import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as faceapi from "face-api.js";
import {
    Camera, CameraOff, ScanFace, Sparkles, Brain, Heart,
    RotateCcw, Clock, Shield, Zap, TrendingUp, Activity,
    Sunrise, Sunset, Apple, ShoppingBag, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";

// ── Mood dataset ──
const MOOD_DATA = {
    happy: {
        emoji: "😊", label: "Happy", color: "#22c55e",
        gradientFrom: "#22c55e", gradientTo: "#16a34a",
        description: "You're radiating positive energy! Your facial expression shows genuine happiness and warmth.",
        tips: [
            "Share your positivity with someone today",
            "Capture this moment in a gratitude journal",
            "Engage in activities that maintain this joyful state",
            "Use this energy to tackle a challenging task",
        ],
    },
    sad: {
        emoji: "😢", label: "Sad", color: "#3b82f6",
        gradientFrom: "#3b82f6", gradientTo: "#2563eb",
        description: "It looks like you might be feeling a bit down. Remember, it's okay to feel this way.",
        tips: [
            "Take a few deep breaths and practice mindfulness",
            "Reach out to a friend or loved one for support",
            "Listen to uplifting music or watch something comforting",
            "Consider a short walk outdoors to boost your mood",
        ],
    },
    angry: {
        emoji: "😠", label: "Angry", color: "#ef4444",
        gradientFrom: "#ef4444", gradientTo: "#dc2626",
        description: "Your expression suggests frustration or anger. Let's channel that energy positively.",
        tips: [
            "Try the 4-7-8 breathing technique to calm down",
            "Step away from the situation briefly if possible",
            "Write down what's bothering you to process emotions",
            "Engage in physical activity to release tension",
        ],
    },
    confused: {
        emoji: "🤔", label: "Confused", color: "#f59e0b",
        gradientFrom: "#f59e0b", gradientTo: "#d97706",
        description: "You seem to be contemplating something. Curiosity and reflection are signs of a thoughtful mind.",
        tips: [
            "Break the problem into smaller, manageable parts",
            "Take a short break to clear your mind",
            "Discuss your thoughts with someone you trust",
            "Write down your questions to organize your thinking",
        ],
    },
};

// ── Skin Type dataset ──
const SKIN_TYPE_DATA = {
    oily: {
        emoji: "✨", label: "Oily Skin", color: "#f59e0b",
        gradientFrom: "#f59e0b", gradientTo: "#d97706",
        description: "Your skin shows high specular reflection, particularly in the T-zone. This identifies an oily skin type.",
        tips: [
            "Use a gentle, foaming cleanser twice daily",
            "Incorporate niacinamide to regulate oil production",
            "Don't skip moisturizer; opt for oil-free, gel-based ones",
            "Use blotting papers for mid-day shine control",
        ],
        carePlan: {
            morning: ["Salicylic acid cleanser", "Niacinamide serum", "Oil-free moisturizer", "SPF 50+ Sunscreen"],
            evening: ["Foaming cleanser", "Retinol (2nd night)", "Lightweight night cream"],
            diet: ["Limit dairy and sugar", "Zinc-rich foods (seeds)", "3L water daily"],
            products: ["CeraVe Foaming Cleanser", "The Ordinary Niacinamide", "LRP Effaclar Mat"]
        },
        referenceUrl: "https://www.aad.org/public/everyday-care/skin-care-basics/dry/oily-skin"
    },
    dry: {
        emoji: "🧴", label: "Dry Skin", color: "#3b82f6",
        gradientFrom: "#3b82f6", gradientTo: "#2563eb",
        description: "Your skin appears to have lower moisture levels and higher texture variance, typical of dry skin.",
        tips: [
            "Use a creamy, non-foaming cleanser",
            "Apply moisturizer to damp skin to lock in hydration",
            "Use products with hyaluronic acid and ceramics",
            "Avoid hot water when washing your face",
        ],
        carePlan: {
            morning: ["Creamy cleanser", "Hyaluronic acid", "Rich moisturizer", "Hydrating Sunscreen"],
            evening: ["Milk cleanser", "Face oil or heavy cream", "Overnight mask (weekly)"],
            diet: ["Healthy fats (Avocado, Nuts)", "Omega-3 (Fish/Seeds)", "Limit caffeine"],
            products: ["Cetaphil Gentle Cleanser", "Neutrogena Hydro Boost", "Weleda Skin Food"]
        },
        referenceUrl: "https://www.mayoclinic.org/diseases-conditions/dry-skin/symptoms-causes/syc-20353885"
    },
    normal: {
        emoji: "🌟", label: "Normal Skin", color: "#22c55e",
        gradientFrom: "#22c55e", gradientTo: "#16a34a",
        description: "Your skin shows a healthy balance of moisture and oil with minimal highlights or visible texture.",
        tips: [
            "Maintain your current balanced routine",
            "Use SPF daily to prevent environmental damage",
            "Stay hydrated and maintain a healthy diet",
            "Exfoliate gently once a week to maintain glow",
        ],
        carePlan: {
            morning: ["Gentle cleanser", "Vitamin C serum", "Light moisturizer", "SPF 30+ Sunscreen"],
            evening: ["Gentle cleanser", "Peptide moisturizer", "Eye cream"],
            diet: ["Balanced anti-oxidants", "Green tea", "Fresh fruits & leafy greens"],
            products: ["Fresh Soy Face Cleanser", "Kiehl's Ultra Facial Cream", "Clinique Dramatically Different"]
        },
        referenceUrl: "https://www.healthline.com/health/beauty-skin-care/skin-types-guide"
    },
};


// Smart mood detection: aggregate expression scores into 4 mood categories
// Uses multiple heuristics to ensure all 4 moods are detectable
function determineMood(expressions) {
    const neutral = expressions.neutral || 0;
    const happy = expressions.happy || 0;
    const sad = expressions.sad || 0;
    const angry = (expressions.angry || 0) + (expressions.disgusted || 0);
    // Boost confused signals — fearful/surprised are naturally harder to trigger
    const confused = ((expressions.fearful || 0) + (expressions.surprised || 0)) * 1.5;

    const moodScores = { happy, sad, angry, confused };

    // Sort moods by score descending
    const sorted = Object.entries(moodScores).sort((a, b) => b[1] - a[1]);
    let [bestMood, bestScore] = sorted[0];
    const secondScore = sorted[1][1];

    // ── Heuristic 1: Neutral-dominant face with weak emotions → "Confused"
    // A truly neutral/thinking/contemplative face should be "confused" not "happy"
    if (neutral > 0.5 && bestScore < 0.2) {
        bestMood = "confused";
        bestScore = neutral * 0.4 + confused;
    }

    // ── Heuristic 2: Wide eyes / surprise → "Confused" (NOT angry)
    // face-api.js sometimes misclassifies wide-open eyes as angry/disgusted.
    // If the raw "surprised" signal is notable, override to confused.
    const rawSurprised = expressions.surprised || 0;
    const rawFearful = expressions.fearful || 0;
    const rawAngry = expressions.angry || 0;
    if ((rawSurprised > 0.15 || rawFearful > 0.15) && bestMood === "angry") {
        bestMood = "confused";
        bestScore = confused;
    }

    // ── Heuristic 3: Angry only when raw angry/disgusted clearly dominates
    // Prevent false positives: angry needs to be at least 2x the confused score
    if (bestMood === "angry" && confused > 0 && angry < confused * 2) {
        bestMood = "confused";
        bestScore = confused;
    }

    // ── Heuristic 4: Ambiguous emotions → "Confused"
    // When the top two moods are very close in score, the face is indeterminate
    if (bestScore > 0.01 && secondScore > 0.01) {
        const ratio = secondScore / bestScore;
        if (ratio > 0.7 && bestMood !== "confused") {
            bestMood = "confused";
            bestScore = bestScore + secondScore;
        }
    }

    // Compute confidence as percentage of total
    const totalEmotional = Object.values(moodScores).reduce((a, b) => a + b, 0) + (neutral * 0.1);
    const confidencePercent = totalEmotional > 0.01
        ? Math.round((bestScore / (totalEmotional || 1)) * 100)
        : 50;

    return {
        mood: bestMood,
        score: bestScore,
        confidence: Math.max(30, Math.min(confidencePercent, 99)),
        allScores: { happy, sad, angry, confused, neutral },
    };
}

// Simple mapping for the live HUD label
const EXPRESSION_TO_MOOD = {
    happy: "happy",
    sad: "sad",
    angry: "angry",
    disgusted: "angry",
    fearful: "confused",
    surprised: "confused",
    neutral: "happy",
};

// ── Heuristic Skin Type Detection ──
function analyzeSkinType(video, detection) {
    if (!detection || !detection.landmarks) return { type: "normal", confidence: 50 };

    try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        const landmarks = detection.landmarks;
        const forehead = landmarks.getJawOutline().slice(0, 1); // Approximation for forehead area
        const nose = landmarks.getNose();
        const leftCheek = landmarks.getJawOutline().slice(0, 4);
        const rightCheek = landmarks.getJawOutline().slice(13, 17);

        // Function to get brightness and variance from a region
        const getRegionStats = (points) => {
            if (!points || points.length === 0) return { mean: 128, variance: 0, max: 128 };

            const minX = Math.min(...points.map(p => p.x));
            const maxX = Math.max(...points.map(p => p.x));
            const minY = Math.min(...points.map(p => p.y));
            const maxY = Math.max(...points.map(p => p.y));

            const startX = Math.max(0, Math.floor(minX));
            const startY = Math.max(0, Math.floor(minY));
            const endX = Math.min(canvas.width, Math.ceil(maxX));
            const endY = Math.min(canvas.height, Math.ceil(maxY));
            const width = Math.max(1, endX - startX);
            const height = Math.max(1, endY - startY);

            try {
                const imageData = ctx.getImageData(startX, startY, width, height);
                const data = imageData.data;
                let totalIntensity = 0;
                const intensities = [];

                for (let i = 0; i < data.length; i += 4) {
                    const intensity = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    totalIntensity += intensity;
                    intensities.push(intensity);
                }

                const pixelCount = Math.max(1, data.length / 4);
                const mean = totalIntensity / pixelCount;
                const variance = intensities.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (intensities.length || 1);
                const max = intensities.length > 0 ? Math.max(...intensities) : 128;

                return { mean, variance, max };
            } catch (err) {
                console.warn("Region stats failed:", err);
                return { mean: 128, variance: 0, max: 128 };
            }
        };

        const noseStats = getRegionStats(nose);
        const lCheekStats = getRegionStats(leftCheek);
        const rCheekStats = getRegionStats(rightCheek);

        // Oiliness heuristic: High max brightness (specular highlight) on nose compared to cheeks
        const oilRatio = noseStats.max / ((lCheekStats.mean + rCheekStats.mean) / 2 || 1);
        const drynessVariance = (lCheekStats.variance + rCheekStats.variance) / 2;

        console.log("🧬 Skin Stats:", { oilRatio, drynessVariance, noseMax: noseStats.max });

        if (oilRatio > 1.35 || noseStats.max > 230) {
            return { type: "oily", confidence: Math.min(95, Math.round(oilRatio * 60)) };
        } else if (drynessVariance > 400 || (lCheekStats.mean + rCheekStats.mean) / 2 < 80) {
            return { type: "dry", confidence: Math.min(95, Math.round(drynessVariance / 10)) };
        } else {
            return { type: "normal", confidence: 85 };
        }
    } catch (e) {
        console.warn("Skin analysis failed:", e);
        return { type: "normal", confidence: 50 };
    }
}

// ── Model URL (jsdelivr hosts face-api.js weights) ──
const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";

// ── Component ──
const FaceRecognition = () => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("userAuthenticated") === "true";
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const animFrameRef = useRef(null);
    const detectingRef = useRef(false);
    const knownFacesRef = useRef([]); // session persistence: [{ descriptor, result }]

    const [cameraActive, setCameraActive] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [loadingModels, setLoadingModels] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [currentMood, setCurrentMood] = useState(null);
    const [currentSkinType, setCurrentSkinType] = useState(null);
    const [confidence, setConfidence] = useState(0);
    const [skinConfidence, setSkinConfidence] = useState(0);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");
    const [liveExpression, setLiveExpression] = useState(null);

    // Load face-api models on mount
    useEffect(() => {
        let cancelled = false;
        const loadModels = async () => {
            try {
                setLoadingModels(true);
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                ]);
                if (!cancelled) {
                    setModelsLoaded(true);
                    console.log("✅ Face-api models loaded successfully");
                }
            } catch (e) {
                console.error("❌ Model load error:", e);
                if (!cancelled) setError("Failed to load AI models. Please check your internet connection and refresh.");
            } finally {
                if (!cancelled) setLoadingModels(false);
            }
        };
        loadModels();
        return () => { cancelled = true; };
    }, []);

    // Start camera
    const startCamera = useCallback(async () => {
        if (!isAuthenticated) {
            alert("Please sign in to use Face Recognition");
            navigate("/login");
            return;
        }
        try {
            setError("");
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Wait for video metadata to load before playing
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play().then(() => {
                        setCameraActive(true);
                        console.log("✅ Camera started");
                    }).catch((err) => {
                        console.error("Video play error:", err);
                        setError("Could not start video playback.");
                    });
                };
            }
        } catch (err) {
            console.error("Camera error:", err);
            setError("Camera access denied. Please allow camera permissions in your browser.");
        }
    }, []);

    // Stop camera
    const stopCamera = useCallback(() => {
        detectingRef.current = false;
        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
        setLiveExpression(null);
    }, []);

    // Cleanup on unmount
    useEffect(() => () => stopCamera(), [stopCamera]);

    // Live face-detection overlay loop
    useEffect(() => {
        if (!cameraActive || !modelsLoaded) return;

        detectingRef.current = true;

        const detect = async () => {
            if (!detectingRef.current) return;

            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (!video || !canvas || video.readyState < 2) {
                animFrameRef.current = requestAnimationFrame(detect);
                return;
            }

            try {
                // Match canvas to actual video dimensions
                const displaySize = { width: video.videoWidth, height: video.videoHeight };
                faceapi.matchDimensions(canvas, displaySize);

                const result = await faceapi
                    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
                    .withFaceLandmarks()
                    .withFaceExpressions();

                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (result) {
                    const resized = faceapi.resizeResults(result, displaySize);

                    // Draw bounding box
                    const { x, y, width, height } = resized.detection.box;
                    ctx.strokeStyle = "#a78bfa";
                    ctx.lineWidth = 2;
                    ctx.setLineDash([6, 4]);
                    ctx.strokeRect(x, y, width, height);
                    ctx.setLineDash([]);

                    // Corner accents
                    const cornerLen = 16;
                    ctx.strokeStyle = "#8b5cf6";
                    ctx.lineWidth = 3;
                    ctx.beginPath(); ctx.moveTo(x, y + cornerLen); ctx.lineTo(x, y); ctx.lineTo(x + cornerLen, y); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(x + width - cornerLen, y); ctx.lineTo(x + width, y); ctx.lineTo(x + width, y + cornerLen); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(x, y + height - cornerLen); ctx.lineTo(x, y + height); ctx.lineTo(x + cornerLen, y + height); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(x + width - cornerLen, y + height); ctx.lineTo(x + width, y + height); ctx.lineTo(x + width, y + height - cornerLen); ctx.stroke();

                    // Live expression — use smart mood detection
                    const liveResult = determineMood(result.expressions);
                    const liveMoodData = MOOD_DATA[liveResult.mood];
                    setLiveExpression({ name: liveResult.mood, score: liveResult.score, label: liveMoodData?.label || liveResult.mood });

                    ctx.fillStyle = liveMoodData?.color || "#8b5cf6";
                    ctx.font = "bold 14px Inter, sans-serif";
                    ctx.fillText(`${liveMoodData?.emoji || ''} ${liveMoodData?.label || liveResult.mood} (${liveResult.confidence}%)`, x, y - 10);
                } else {
                    setLiveExpression(null);
                }
            } catch (err) {
                // Silently continue on detection errors
                console.warn("Detection frame error:", err);
            }

            if (detectingRef.current) {
                animFrameRef.current = requestAnimationFrame(detect);
            }
        };

        // Start detection after a small delay so video is ready
        const timer = setTimeout(() => {
            if (detectingRef.current) detect();
        }, 500);

        return () => {
            detectingRef.current = false;
            clearTimeout(timer);
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
                animFrameRef.current = null;
            }
        };
    }, [cameraActive, modelsLoaded]);

    // Capture & Analyze
    const captureAndAnalyze = async () => {
        if (!isAuthenticated) {
            alert("Please sign in to perform analysis");
            navigate("/login");
            return;
        }
        if (!videoRef.current || !modelsLoaded) return;
        setAnalyzing(true);
        setError("");

        try {
            const video = videoRef.current;
            if (video.readyState < 2) {
                setError("Camera is not ready yet. Please wait a moment.");
                setAnalyzing(false);
                return;
            }

            const result = await faceapi
                .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.4 }))
                .withFaceLandmarks()
                .withFaceExpressions();

            if (!result) {
                setError("No face detected. Please position your face clearly in the camera and try again.");
                setAnalyzing(false);
                return;
            }

            const moodResult = determineMood(result.expressions);
            const skinResult = analyzeSkinType(video, result);

            console.log("🎯 Mood analysis:", moodResult);
            console.log("🧪 Skin analysis:", skinResult);

            setCurrentMood(moodResult.mood);
            setConfidence(moodResult.confidence);
            setCurrentSkinType(skinResult.type);
            setSkinConfidence(skinResult.confidence);

            setHistory((prev) => [
                { mood: moodResult.mood, skin: skinResult.type, confidence: moodResult.confidence, time: new Date() },
                ...prev.slice(0, 9),
            ]);
        } catch (e) {
            console.error("Analysis error:", e);
            setError(`Analysis failed: ${e.message || "Unknown error"}. Please ensure you are in a well-lit area.`);
        } finally {
            setAnalyzing(false);
        }
    };

    const reset = () => {
        setCurrentMood(null);
        setCurrentSkinType(null);
        setConfidence(0);
        setSkinConfidence(0);
        setError("");
    };

    const activeMood = currentMood ? MOOD_DATA[currentMood] : null;
    const activeSkin = currentSkinType ? SKIN_TYPE_DATA[currentSkinType] : null;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-24 pb-16 px-4 lg:px-8">
                <div className="container mx-auto max-w-6xl">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                            <Brain className="w-4 h-4" />
                            AI-Powered Analysis
                        </div>
                        <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            Face <span className="text-accent">Recognition</span>
                        </h1>
                        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                            Real-time AI analysis of your mood and skin type.
                            Simply look at the camera to detect how you feel and your skin's condition.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Camera Panel (left 3 cols) */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-3 flex flex-col gap-6 order-1"
                        >
                            <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-500 via-accent to-violet-500 opacity-60 z-10" />

                                {/* Status bar */}
                                <div className="relative z-10 flex items-center justify-between px-6 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">
                                        <ScanFace className="w-4 h-4 text-violet-400" />
                                        Live Camera Feed
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {modelsLoaded && (
                                            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-500">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                AI Ready
                                            </span>
                                        )}
                                        {loadingModels && (
                                            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-yellow-500">
                                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                                Loading Models…
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Video area */}
                                <div className="relative aspect-square sm:aspect-video bg-black flex items-center justify-center overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        style={{ display: cameraActive ? "block" : "none", width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
                                    />
                                    <canvas
                                        ref={canvasRef}
                                        style={{ display: cameraActive ? "block" : "none", position: "absolute", top: 0, left: 0, width: "100%", height: "100%", transform: "scaleX(-1)" }}
                                    />

                                    {/* Live expression HUD */}
                                    {cameraActive && liveExpression && (
                                        <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/10">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-violet-300 mb-1">Detected</p>
                                            <p className="text-white font-bold text-lg capitalize">
                                                {MOOD_DATA[liveExpression.name]?.emoji}{" "}
                                                {liveExpression.label}
                                            </p>
                                            <div className="mt-1 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-violet-500 rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${liveExpression.score * 100}%` }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Camera off placeholder */}
                                    {!cameraActive && (
                                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                            <div className="w-24 h-24 rounded-full bg-muted/30 border-2 border-dashed border-border flex items-center justify-center">
                                                <CameraOff className="w-10 h-10 opacity-40" />
                                            </div>
                                            <p className="text-sm font-medium">Camera is off</p>
                                        </div>
                                    )}
                                </div>

                                {/* Controls bar */}
                                <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 border-t border-border bg-card/80 backdrop-blur-sm">
                                    {!cameraActive ? (
                                        <Button
                                            onClick={startCamera}
                                            disabled={loadingModels}
                                            className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-8 py-5 text-sm font-bold gap-2"
                                        >
                                            <Camera className="w-5 h-5" />
                                            {loadingModels ? "Loading AI Models…" : "Start Camera"}
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                onClick={captureAndAnalyze}
                                                disabled={analyzing || !modelsLoaded}
                                                className="flex-1 sm:flex-initial bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-4 sm:px-8 py-5 text-sm font-bold gap-2"
                                            >
                                                {analyzing ? (
                                                    <>
                                                        <Activity className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                                                        Analyzing…
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        Capture
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                onClick={stopCamera}
                                                variant="outline"
                                                className="flex-1 sm:flex-initial rounded-xl px-4 sm:px-6 py-5 text-sm font-bold gap-2 border-border"
                                            >
                                                <CameraOff className="w-4 h-4" />
                                                Stop
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl px-6 py-4 text-sm font-medium"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* History */}
                            {history.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="bg-card border border-border rounded-3xl p-6"
                                >
                                    <div className="flex items-center gap-2 mb-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                                        <Clock className="w-4 h-4 text-violet-400" />
                                        Recent Analyses
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {history.map((h, i) => {
                                            const m = MOOD_DATA[h.mood];
                                            const s = SKIN_TYPE_DATA[h.skin];
                                            return (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="flex items-center gap-3 bg-muted/30 rounded-xl px-4 py-2 border border-border"
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-xl leading-none">{m.emoji}</span>
                                                        <span className="text-[10px] uppercase font-black opacity-40 mt-1">Mood</span>
                                                    </div>
                                                    <div className="w-px h-8 bg-border" />
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-xl leading-none">{s?.emoji || "❓"}</span>
                                                        <span className="text-[10px] uppercase font-black opacity-40 mt-1">Skin</span>
                                                    </div>
                                                    <div className="ml-1">
                                                        <p className="text-xs font-bold" style={{ color: m.color }}>{m.label}</p>
                                                        <p className="text-[10px] text-muted-foreground">
                                                            {h.confidence}% · {h.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Result Panel (right 2 cols) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2 flex flex-col gap-6 order-2"
                        >
                            <AnimatePresence mode="wait">
                                {(activeMood && activeSkin) ? (
                                    <motion.div
                                        key={currentMood + currentSkinType}
                                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl"
                                    >
                                        {/* Result Header - Switch between Mood and Skin */}
                                        <div className="flex border-b border-border">
                                            <button className="flex-1 p-4 text-sm font-bold border-b-2 border-accent bg-accent/5">Analysis Results</button>
                                        </div>

                                        <div className="p-6 space-y-8">
                                            {/* Mood Section */}
                                            <div className="relative p-5 rounded-2xl bg-secondary/30 border border-border overflow-hidden">
                                                <div className="absolute top-0 right-0 p-3 opacity-10">
                                                    <Brain className="w-12 h-12" />
                                                </div>
                                                <div className="flex items-center gap-4 mb-4">
                                                    <span className="text-5xl">{activeMood.emoji}</span>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Detected Mood</p>
                                                        <h3 className="text-2xl font-bold" style={{ color: activeMood.color }}>{activeMood.label}</h3>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-2">
                                                        <span>Confidence</span>
                                                        <span style={{ color: activeMood.color }}>{confidence}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full rounded-full"
                                                            style={{ background: activeMood.color }}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${confidence}%` }}
                                                            transition={{ duration: 0.8 }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Skin Type Section */}
                                            <div className="relative p-5 rounded-2xl bg-secondary/30 border border-border overflow-hidden">
                                                <div className="absolute top-0 right-0 p-3 opacity-10">
                                                    <ScanFace className="w-12 h-12" />
                                                </div>
                                                <div className="flex items-center gap-4 mb-4">
                                                    <span className="text-5xl">{activeSkin.emoji}</span>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Detected Skin Type</p>
                                                        <h3 className="text-2xl font-bold" style={{ color: activeSkin.color }}>{activeSkin.label}</h3>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-2">
                                                        <span>Accuracy</span>
                                                        <span style={{ color: activeSkin.color }}>{skinConfidence}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full rounded-full"
                                                            style={{ background: activeSkin.color }}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${skinConfidence}%` }}
                                                            transition={{ duration: 0.8, delay: 0.2 }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Descriptions */}
                                            <div className="space-y-4">
                                                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                                                    <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-1">Dermatologist Note</p>
                                                    <p className="text-xs text-foreground/80 leading-relaxed">{activeSkin.description}</p>
                                                </div>
                                                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                                                    <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-1">Mood Insight</p>
                                                    <p className="text-xs text-foreground/80 leading-relaxed">{activeMood.description}</p>
                                                </div>
                                            </div>

                                            {/* Combined Tips */}
                                            <div>
                                                <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                                    <Zap className="w-3.5 h-3.5 text-accent" />
                                                    Personalized Tips
                                                </p>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {activeSkin.tips.slice(0, 2).map((tip, i) => (
                                                        <div key={`s-${i}`} className="flex items-start gap-2 bg-accent/5 rounded-lg px-3 py-2 border border-accent/10">
                                                            <Sparkles className="w-3 h-3 mt-0.5 text-accent" />
                                                            <span className="text-[11px] font-medium">{tip}</span>
                                                        </div>
                                                    ))}
                                                    {activeMood.tips.slice(0, 2).map((tip, i) => (
                                                        <div key={`m-${i}`} className="flex items-start gap-2 bg-violet-500/5 rounded-lg px-3 py-2 border border-violet-500/10">
                                                            <Heart className="w-3 h-3 mt-0.5 text-violet-400" />
                                                            <span className="text-[11px] font-medium">{tip}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <Button
                                                onClick={reset}
                                                variant="outline"
                                                className="w-full rounded-xl py-5 gap-2 font-bold border-border"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                                Scan Again
                                            </Button>
                                        </div>

                                        {/* Care Plan Section */}
                                        <div className="bg-secondary/20 p-6 border-t border-border space-y-6">
                                            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-foreground">
                                                <Sparkles className="w-4 h-4 text-accent" />
                                                Tailored Care Plan
                                            </div>

                                            <div className="flex items-center justify-between p-3 rounded-xl bg-accent/5 border border-accent/20">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-4 h-4 text-accent" />
                                                    <span className="text-[11px] font-bold text-accent uppercase tracking-tighter">Verified Reference</span>
                                                </div>
                                                <a 
                                                    href={activeSkin.referenceUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground hover:text-accent transition-colors uppercase"
                                                >
                                                    View Study <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Morning Routine */}
                                                <div className="bg-card/50 border border-border rounded-2xl p-4">
                                                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-orange-400">
                                                        <Sunrise className="w-4 h-4" /> Morning Routine
                                                    </div>
                                                    <ul className="space-y-2">
                                                        {activeSkin.carePlan.morning.map((step, i) => (
                                                            <li key={i} className="text-[11px] flex items-center gap-2 text-muted-foreground">
                                                                <div className="w-1 h-1 rounded-full bg-orange-400" /> {step}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Evening Routine */}
                                                <div className="bg-card/50 border border-border rounded-2xl p-4">
                                                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-indigo-400">
                                                        <Sunset className="w-4 h-4" /> Evening Routine
                                                    </div>
                                                    <ul className="space-y-2">
                                                        {activeSkin.carePlan.evening.map((step, i) => (
                                                            <li key={i} className="text-[11px] flex items-center gap-2 text-muted-foreground">
                                                                <div className="w-1 h-1 rounded-full bg-indigo-400" /> {step}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Diet Plan */}
                                                <div className="bg-card/50 border border-border rounded-2xl p-4">
                                                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-green-400">
                                                        <Apple className="w-4 h-4" /> Recommended Diet
                                                    </div>
                                                    <ul className="space-y-2">
                                                        {activeSkin.carePlan.diet.map((item, i) => (
                                                            <li key={i} className="text-[11px] flex items-center gap-2 text-muted-foreground">
                                                                <div className="w-1 h-1 rounded-full bg-green-400" /> {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Recommended Products */}
                                                <div className="bg-card/50 border border-border rounded-2xl p-4">
                                                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-accent">
                                                        <ShoppingBag className="w-4 h-4" /> Expert Recommendations
                                                    </div>
                                                    <ul className="space-y-2">
                                                        {activeSkin.carePlan.products.map((item, i) => (
                                                            <li key={i} className="text-[11px] flex items-center gap-2 text-muted-foreground">
                                                                <div className="w-1 h-1 rounded-full bg-accent" /> {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="placeholder"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="bg-card border border-border rounded-3xl p-8 text-center"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-violet-500/10 border-2 border-dashed border-violet-500/20 flex items-center justify-center mx-auto mb-6">
                                            <ScanFace className="w-9 h-9 text-violet-400 opacity-60" />
                                        </div>
                                        <h3 className="font-display font-bold text-xl text-foreground mb-2">
                                            Ready to Scan
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-6">
                                            Position your face clearly for an AI analysis of your <strong>mood</strong> and <strong>skin type</strong>.
                                        </p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex flex-col items-center gap-1 bg-muted/30 rounded-xl p-3 border border-border">
                                                <span className="text-2xl">😊</span>
                                                <span className="text-[10px] font-bold uppercase tracking-tighter">Detect Mood</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1 bg-muted/30 rounded-xl p-3 border border-border">
                                                <span className="text-2xl">✨</span>
                                                <span className="text-[10px] font-bold uppercase tracking-tighter">Scan Skin</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Info card */}
                            <div className="bg-card border border-border rounded-3xl p-6">
                                <div className="flex items-center gap-2 mb-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                                    <Shield className="w-4 h-4 text-green-400" />
                                    Privacy & Security
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    All facial analysis is processed <strong>locally in your browser</strong>.
                                    We analyze light patterns and texture to estimate skin type without uploading any data.
                                    Your privacy is our top priority.
                                </p>
                            </div>

                            {/* How-it-works card */}
                            <div className="bg-card border border-border rounded-3xl p-6">
                                <div className="flex items-center gap-2 mb-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                                    <Brain className="w-4 h-4 text-violet-400" />
                                    How It Works
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { step: "1", text: "Camera captures your face in real-time" },
                                        { step: "2", text: "AI detects facial landmarks & expressions" },
                                        { step: "3", text: "Skin texture & light reflection is analyzed" },
                                        { step: "4", text: "Mood and Skin Type results are displayed" },
                                    ].map((item) => (
                                        <div key={item.step} className="flex items-center gap-3">
                                            <span className="w-7 h-7 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center text-xs font-black">
                                                {item.step}
                                            </span>
                                            <span className="text-xs font-medium text-foreground/70">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaceRecognition;
