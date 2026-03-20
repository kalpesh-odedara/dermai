import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Stethoscope, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroHospital from "@/assets/hero-hospital.jpg";
import heroSurgeons from "@/assets/hero-surgeons.jpg";
import heroNurses from "@/assets/hero-nurses.jpg";
import heroBuilding from "@/assets/hero-building.jpg";
const slides = [
  {
    image: heroHospital,
    title: "Radiant Skin Awaits",
    subtitle: "Reveal Your True Beauty",
    description: "Experience world-class dermatology and aesthetic treatments tailored to your unique skin needs.",
  },
  {
    image: heroSurgeons,
    title: "Expert Dermatologists",
    subtitle: "Clinical Precision & Care",
    description: "Our board-certified skin specialists utilize advanced technology for safe and effective results.",
  },
  {
    image: heroNurses,
    title: "Holistic Skin Care",
    subtitle: "Nurturing Your Glow",
    description: "From acne treatment to anti-aging, we provide comprehensive care for healthy, glowing skin.",
  },
  {
    image: heroBuilding,
    title: "Modern Skin Clinic",
    subtitle: "Luxury Meets Science",
    description: "Relax in our state-of-the-art facility designed for your comfort and rejuvenation.",
  },
];
export const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);
  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  return (<section className="relative min-h-[600px] h-[85vh] sm:h-[90vh] lg:h-screen overflow-hidden">
    {/* Background Images */}
    <AnimatePresence mode="wait">
      <motion.div key={current} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.8 }} className="absolute inset-0">
        <img src={slides[current].image} alt={slides[current].title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent md:bg-gradient-to-r sm:bg-gradient-to-b" />
      </motion.div>
    </AnimatePresence>

    {/* Content */}
    <div className="relative z-10 h-full container mx-auto px-4 lg:px-8 flex items-center">
      <div className="max-w-2xl pt-12 sm:pt-0">
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
            <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="inline-block px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-accent/20 text-accent text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              Welcome to MediCare+
            </motion.span>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground mb-2 leading-tight">
              {slides[current].title}
            </h1>
            <h2 className="font-display text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-accent mb-4 sm:mb-6">
              {slides[current].subtitle}
            </h2>
            <p className="text-primary-foreground/80 text-sm sm:text-lg md:text-xl max-w-lg mb-6 sm:mb-8 line-clamp-3 sm:line-clamp-none">
              {slides[current].description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base">
                <Link to="/appointment">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Book Appointment
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-primary/30 backdrop-blur-xl border border-primary-foreground/20 text-primary-foreground hover:bg-primary/50 hover:border-accent/40 rounded-xl px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-all group">
                <Link to="/services">
                  <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Our Services
                </Link>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>

    {/* Navigation Arrows - Hidden on very small screens to avoid clutter, or repositioned */}
    <div className="absolute bottom-24 sm:bottom-32 right-4 sm:right-8 flex items-center gap-2 sm:gap-4 z-20">
      <button onClick={prev} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card/20 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-card/40 transition-all">
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button onClick={next} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card/20 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-card/40 transition-all">
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>

    {/* Slide Indicators - Moved up to avoid overlap with stats bar */}
    <div className="absolute bottom-24 sm:bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
      {slides.map((_, index) => (<button key={index} onClick={() => setCurrent(index)} className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${index === current ? "w-6 sm:w-8 bg-accent" : "w-1.5 sm:w-2 bg-primary-foreground/40"}`} />))}
    </div>

    {/* Quick Stats Bar */}
    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border z-30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-3 divide-x divide-border">
          {[
            { icon: Clock, label: "24/7", value: "Available" },
            { icon: Stethoscope, label: "Expert", value: "Doctors" },
            { icon: Calendar, label: "Same Day", value: "Booking" },
          ].map((stat, index) => (<div key={index} className="flex flex-row items-center justify-center sm:justify-start gap-2 sm:gap-4 py-3 sm:py-6 px-1 sm:px-8 text-left">
            <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
              <stat.icon className="w-4 h-4 sm:w-6 sm:h-6 text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-[8px] sm:text-sm text-muted-foreground uppercase font-medium truncate">{stat.label}</p>
              <p className="font-display font-semibold text-foreground text-[10px] sm:text-base truncate">{stat.value}</p>
            </div>
          </div>))}
        </div>
      </div>
    </motion.div>
  </section>);
};
