import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { User, Mail, Lock, LogIn, ShieldCheck, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const response = await fetch(`${API_URL}/api/user-logins`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast.success("Login successful! Welcome to DermaCare.");
                localStorage.setItem("userAuthenticated", "true");
                localStorage.setItem("userName", formData.name);
                // Redirect to home or dashboard immediately
                navigate("/");
            } else {
                toast.error("Failed to process login");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Connection error. Is the backend running?");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <section className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
                <div className="container px-4 flex justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md"
                    >
                        <div className="glass-card p-8 rounded-[2rem] border border-primary/10 shadow-2xl relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />

                            <div className="text-center mb-8 relative z-10">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                                    <HeartPulse className="w-8 h-8 text-primary animate-pulse" />
                                </div>
                                <h1 className="text-3xl font-display font-bold text-foreground">Welcome Back</h1>
                                <p className="text-muted-foreground mt-2">Access your patient portal securely</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            className="pl-11 h-12 rounded-xl bg-background/50 border-primary/10 focus:border-primary"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            className="pl-11 h-12 rounded-xl bg-background/50 border-primary/10 focus:border-primary"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-11 h-12 rounded-xl bg-background/50 border-primary/10 focus:border-primary"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm py-2">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 rounded border-primary/20 text-primary accent-primary" />
                                        <span className="text-muted-foreground">Remember me</span>
                                    </label>
                                    <button type="button" className="text-primary hover:underline font-medium">Forgot password?</button>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-lg shadow-primary/20"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <LogIn className="w-5 h-5" />
                                            Sign In
                                        </div>
                                    )}
                                </Button>
                            </form>

                        </div>

                        <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground text-sm">
                            <ShieldCheck className="w-4 h-4 text-success" />
                            <span>HIPAA Compliant Security</span>
                        </div>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
};

export default Login;
