import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, Heart, Mic, Home, Info, Stethoscope, 
  Calendar, FileText, Phone, UserSquare2 
} from "lucide-react";
import { VoiceAssistant } from "../chat/VoiceAssistant";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "About", path: "/about", icon: Info },
  { name: "Services", path: "/services", icon: Stethoscope },
  { name: "Appointment", path: "/appointment", icon: Calendar },
  { name: "Prescription", path: "/prescription", icon: FileText },
  { name: "Contact", path: "/contact", icon: Phone },
  { name: "Face Recognition", path: "/face-recognition", icon: UserSquare2 },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const location = useLocation();
  
  const userName = localStorage.getItem("userName");
  const isAuthenticated = localStorage.getItem("userAuthenticated") === "true";

  const handleLogout = () => {
    localStorage.removeItem("userAuthenticated");
    localStorage.removeItem("userName");
    window.location.reload();
  };

  return (<>
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/90 backdrop-blur-xl border-b border-primary/20 shadow-lg shadow-primary/5">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight">
              DermaCare<span className="text-accent">+</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.path
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Voice Assistant — opens modal, not a page */}
            <button
              onClick={() => setIsVoiceOpen(true)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-muted-foreground hover:text-primary hover:bg-muted`}
            >
              <Mic className="w-4 h-4 text-accent" />
              Voice Assistant
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Hello, <span className="text-primary font-bold">{userName}</span>
                </span>
                <Button onClick={handleLogout} variant="outline" className="rounded-xl border-accent/20 hover:bg-accent/5">
                  Logout
                </Button>
              </div>
            ) : (
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-6">
                <Link to="/login">Sign In</Link>
              </Button>
            )}
            <Button asChild className="bg-accent hover:bg-accent/90 text-white font-bold rounded-xl px-6 shadow-lg shadow-accent/20">
              <Link to="/appointment">Book Appointment</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white active:scale-95 shadow-inner">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </nav>

    {/* Mobile Sidebar - Moved outside <nav> for full-screen height without clipping */}
    <AnimatePresence>
      {isOpen && (<>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/60 backdrop-blur-md lg:hidden z-40" onClick={() => setIsOpen(false)} />
        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 bottom-0 w-full max-w-[320px] bg-slate-900 border-l border-white/10 shadow-2xl lg:hidden z-50 overflow-hidden">
          {/* Themed background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex flex-col h-full p-8 relative z-10">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-2xl text-white tracking-tight">
                  DermaCare<span className="text-accent">+</span>
                </span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white ring-1 ring-white/10">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <motion.div key={link.path} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold transition-all duration-300 ${
                        isActive
                          ? "bg-accent text-white shadow-xl shadow-accent/30 ring-1 ring-white/20"
                          : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-accent"}`} />
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Voice Assistant mobile button */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: navLinks.length * 0.05 }}>
                <button
                  onClick={() => { setIsOpen(false); setIsVoiceOpen(true); }}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300"
                >
                  <Mic className="w-5 h-5 text-accent" />
                  Voice Assistant
                </button>
              </motion.div>
            </div>

            <div className="mt-auto pt-8 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <div className="px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white">
                    <p className="text-sm text-slate-400">Signed in as</p>
                    <p className="text-base font-bold text-accent">{userName}</p>
                  </div>
                  <Button onClick={handleLogout} variant="outline" className="w-full border-white/20 text-white hover:bg-white/5 rounded-2xl py-6 font-bold">
                    Logout
                  </Button>
                </>
              ) : (
                <Button asChild className="w-full bg-white text-slate-900 hover:bg-white/90 font-bold rounded-2xl py-6 shadow-xl shadow-white/5 text-lg">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Link>
                </Button>
              )}
              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-white font-bold rounded-2xl py-7 shadow-xl shadow-accent/20 text-lg">
                <Link to="/appointment" onClick={() => setIsOpen(false)}>
                  Book Appointment
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </>)}
    </AnimatePresence>
    <VoiceAssistant isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
  </>);
};
