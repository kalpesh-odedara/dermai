import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const FeedbackForm = () => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("userAuthenticated") === "true";
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        rating: 0,
        message: "",
    });
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error("Please sign in to provide feedback");
            navigate("/login");
            return;
        }
        if (formData.rating === 0) {
            toast.error("Please provide a rating");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsSubmitted(true);
                toast.success("Thank you for your feedback!");
                setFormData({ name: "", email: "", rating: 0, message: "" });
            } else {
                const data = await response.json();
                toast.error(data.error || "Failed to submit feedback");
            }
        } catch (error) {
            toast.error("Connection error. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto p-12 rounded-3xl bg-card border border-border text-center shadow-2xl"
            >
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <h3 className="text-3xl font-display font-bold text-foreground mb-4">Feedback Received!</h3>
                <p className="text-muted-foreground text-lg mb-8">
                    Thank you for helping us improve our services. Your input is valuable to our team.
                </p>
                <Button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-8 py-6"
                >
                    Send Another Feedback
                </Button>
            </motion.div>
        );
    }

    return (
        <section className="py-20 bg-background/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                            Feedback
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                            Share Your <span className="text-accent">Experience</span>
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            We value your thoughts. Help us provide the best dermatological care.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid md:grid-cols-1 gap-8 bg-card p-8 md:p-12 rounded-3xl border border-border shadow-xl relative"
                    >
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground ml-1">Full Name</label>
                                <Input
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="rounded-xl bg-background border-border h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="rounded-xl bg-background border-border h-12"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-medium text-foreground ml-1">How would you rate our services?</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        className="transition-transform hover:scale-110 active:scale-95 p-1"
                                    >
                                        <Star
                                            className={`w-8 h-8 transition-colors duration-300 ${star <= (hoveredRating || formData.rating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-muted border-none"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1">Your Message</label>
                            <Textarea
                                placeholder="Tell us about your experience..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                className="rounded-xl bg-background border-border min-h-[150px] resize-none"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto ml-auto bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-12 py-6 flex items-center gap-2 group"
                        >
                            {isSubmitting ? (
                                "Submitting..."
                            ) : (
                                <>
                                    Submit Feedback
                                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default FeedbackForm;
