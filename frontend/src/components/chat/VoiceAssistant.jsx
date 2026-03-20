import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, Navigation, Sparkles, Command, ShieldCheck, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

// Navigation commands dataset
const COMMAND_DATASET = {
    "navigation": [
        { "page": "Home", "route": "/", "keywords": ["home", "main", "index", "start", "homepage"] },
        { "page": "About", "route": "/about", "keywords": ["about", "about us", "who we are", "company", "info"] },
        { "page": "Services", "route": "/services", "keywords": ["services", "what you do", "treatments", "care", "show services"] },
        { "page": "Appointment", "route": "/appointment", "keywords": ["appointment", "book", "schedule", "visit", "doctor", "book visit"] },
        { "page": "Prescription", "route": "/prescription", "keywords": ["prescription", "medicine", "medication", "analyze", "image", "find solution of problem", "find solution"] },
        { "page": "Contact", "route": "/contact", "keywords": ["contact", "call", "reach", "support", "help", "location", "address", "send message"] },
        { "page": "Face Recognition", "route": "/face-recognition", "keywords": ["face", "face recognition", "mood", "emotion", "expression", "analyze face", "detect mood"] }
    ],
    "triggers": ["navigate to", "go to", "open", "show me", "take me to", "switch to"],
    "conversation": [
        { "keywords": ["hy", "hi", "hello", "hey", "greetings"], "response": "Hello! I am your DermaCare voice assistant. How can I help you today?" },
        { "keywords": ["how are you", "how are things", "how's it going"], "response": "I'm doing great, thank you for asking! I'm ready to help you navigate our services." },
        { "keywords": ["who are you", "what is your name"], "response": "I am the DermaCare AI Voice Assistant, designed to help you find skin care solutions quickly." },
        { "keywords": ["how can you help", "what can you do", "help me"], "response": "I can help you navigate to our services, book appointments, find prescriptions, or open the detailed chatbot for specific skin concerns." }
    ]
};

export const VoiceAssistant = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const [recognition, setRecognition] = useState(null);
    const [isSupported, setIsSupported] = useState(true);
    const [status, setStatus] = useState("idle"); // idle, listening, processing, success, error

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setIsSupported(false);
            return;
        }

        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";

        rec.onresult = (event) => {
            let currentInterim = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    const result = event.results[i][0].transcript.toLowerCase();
                    setTranscript((prev) => prev + result + " ");
                    handleVoiceCommand(result);
                } else {
                    currentInterim += event.results[i][0].transcript;
                }
            }
            setInterimTranscript(currentInterim);
        };

        rec.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
            setStatus("error");
        };

        rec.onend = () => {
            setIsListening(false);
            if (status === "listening") setStatus("idle");
        };

        setRecognition(rec);
    }, [navigate]);

    const speak = (text) => {
        if (!window.speechSynthesis) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        const voices = window.speechSynthesis.getVoices();

        // Priority list for a "lady" voice
        const ladyVoice = voices.find(v => v.name === 'Google US English' && v.lang === 'en-US') ||
            voices.find(v => v.name.includes('Samantha')) ||
            voices.find(v => v.name.includes('Zira')) ||
            voices.find(v => v.name.includes('Female')) ||
            voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'));

        if (ladyVoice) utterance.voice = ladyVoice;
        utterance.pitch = 1.1;
        utterance.rate = 1;

        window.speechSynthesis.speak(utterance);
    };

    const handleVoiceCommand = (text) => {
        const cleanText = text.toLowerCase().trim();

        // Check functional commands
        if (cleanText.includes("chatbot") || cleanText.includes("chat") || cleanText.includes("help") || cleanText.includes("ai doctor")) {
            setStatus("success");
            speak("Here is your result");
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('openChatbot'));
                onClose();
                setTranscript("");
                setStatus("idle");
            }, 1500);
            return;
        }

        for (const nav of COMMAND_DATASET.navigation) {
            const matchedKeyword = nav.keywords.find(keyword => cleanText.includes(keyword));
            if (matchedKeyword) {
                setStatus("success");
                speak("Here is your result");
                setTimeout(() => {
                    navigate(nav.route);
                    onClose();
                    setTranscript("");
                    setStatus("idle");
                }, 1500);
                return;
            }
        }

        // Check conversational commands
        for (const convo of COMMAND_DATASET.conversation) {
            const matchedKeyword = convo.keywords.find(keyword => cleanText.includes(keyword));
            if (matchedKeyword) {
                setStatus("success");
                speak(convo.response);
                setTimeout(() => {
                    setStatus("idle");
                }, 4000);
                return;
            }
        }

        // Out of domain query
        setStatus("error");
        speak("this is out of dermacare information please find info related to us");
        setTimeout(() => {
            setStatus("idle");
        }, 3000);
    };

    const toggleListening = useCallback(() => {
        if (!recognition) return;

        if (isListening) {
            recognition.stop();
            setIsListening(false);
            setStatus("idle");
        } else {
            setTranscript("");
            setInterimTranscript("");
            recognition.start();
            setIsListening(true);
            setStatus("listening");
        }
    }, [recognition, isListening]);

    if (!isSupported) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ zIndex: 9999 }}
                    className="fixed inset-0 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
                >
                    {/* Close on Backdrop Click */}
                    <div className="absolute inset-0" onClick={onClose} />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-[95%] sm:w-[90%] max-w-xl bg-card border border-border rounded-[2rem] sm:rounded-[3rem] shadow-[0_30px_90px_rgba(0,0,0,0.5)] overflow-hidden p-6 sm:p-8 lg:p-12"
                    >
                        {/* Professional Accents */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent via-primary to-accent opacity-50" />
                        <div className="absolute -top-32 -right-32 w-80 h-80 bg-accent/10 blur-[120px] rounded-full" />
                        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/10 blur-[120px] rounded-full" />

                        <div className="relative z-10 w-full h-full flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                        <Cpu className="w-7 h-7 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-display font-bold text-2xl text-foreground">
                                            AI Voice Assistant
                                        </h3>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                            <ShieldCheck className="w-3 h-3 text-green-500" />
                                            Live Recognition Active
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted h-10 w-10 border border-border">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Interaction Area */}
                            <div className="flex flex-col gap-8 flex-1">
                                <div className="flex flex-col items-center justify-center py-4">
                                    <div className="relative mb-6">
                                        <AnimatePresence>
                                            {isListening && (
                                                <>
                                                    {[1.2, 1.8].map((s, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ scale: 1, opacity: 0.4 }}
                                                            animate={{ scale: s + 0.4, opacity: 0 }}
                                                            transition={{ duration: 2, repeat: Infinity, delay: idx * 0.4 }}
                                                            className="absolute inset-0 rounded-full border border-primary/40"
                                                        />
                                                    ))}
                                                </>
                                            )}
                                        </AnimatePresence>

                                        <motion.button
                                            onClick={toggleListening}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-700 z-10 shadow-2xl ${isListening ? "bg-red-500" : "bg-primary"
                                                }`}
                                        >
                                            {isListening ? (
                                                <Mic className="w-12 h-12 text-white" />
                                            ) : (
                                                <MicOff className="w-12 h-12 text-white" />
                                            )}
                                        </motion.button>
                                    </div>

                                    <div className="text-center">
                                        <h4 className={`text-xl font-bold tracking-tight ${status === 'success' ? 'text-green-500' : 'text-foreground'}`}>
                                            {status === 'listening' ? "Listening to your voice..." :
                                                status === 'success' ? "Command Recognized" : "Ready to Assist"}
                                        </h4>
                                        <p className="text-sm text-muted-foreground font-medium mt-1">
                                            {isListening ? "Try saying 'Navigate to Services'" : "Tap the mic icon to begin"}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-6 bg-muted/30 rounded-[2rem] border border-border min-h-[140px] flex items-center justify-center text-center">
                                        {transcript || interimTranscript ? (
                                            <p className="text-lg font-semibold leading-relaxed tracking-tight">
                                                {transcript}
                                                <span className="text-muted-foreground/30">{interimTranscript}</span>
                                            </p>
                                        ) : (
                                            <div className="opacity-20 flex flex-col items-center gap-2">
                                                <Command className="w-8 h-8" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Voice Input Feed</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 bg-accent/5 rounded-[2rem] border border-accent/10">
                                        <div className="flex items-center gap-2 mb-4 text-accent text-[11px] font-black uppercase tracking-widest">
                                            <Navigation className="w-4 h-4" />
                                            Smart Commands
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-bold text-muted-foreground/80">
                                            <p className="bg-white/5 py-2 px-3 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors">
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                                Show Services
                                            </p>
                                            <p className="bg-white/5 py-2 px-3 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors">
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                                Send Message
                                            </p>
                                            <p className="bg-white/5 py-2 px-3 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors">
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                                Find Solution
                                            </p>
                                            <p className="bg-white/5 py-2 px-3 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors">
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                                Open Chatbot
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Footer */}
                            <div className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-4">
                                <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    Protocol Secure
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
