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
        title: "World-Class Healthcare",
        subtitle: "At Your Fingertips",
        description: "Experience cutting-edge medical care with our state-of-the-art facilities and expert physicians.",
    },
    {
        image: heroSurgeons,
        title: "Expert Surgeons",
        subtitle: "Precision & Care",
        description: "Our board-certified surgeons deliver exceptional outcomes with advanced surgical techniques.",
    },
    {
        image: heroNurses,
        title: "Compassionate Care",
        subtitle: "Every Step of the Way",
        description: "Our dedicated nursing staff ensures you receive personalized attention and comfort.",
    },
    {
        image: heroBuilding,
        title: "Modern Facilities",
        subtitle: "Built for Excellence",
        description: "Advanced medical technology meets patient-centered design in our award-winning campus.",
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
    return (<section className="relative h-[90vh] lg:h-screen overflow-hidden">
       {/* Background Images */}
       <AnimatePresence mode="wait">
         <motion.div key={current} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.8 }} className="absolute inset-0">
           <img src={slides[current].image} alt={slides[current].title} className="w-full h-full object-cover"/>
           <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent"/>
         </motion.div>
       </AnimatePresence>
 
       {/* Content */}
       <div className="relative z-10 h-full container mx-auto px-4 lg:px-8 flex items-center">
         <div className="max-w-2xl">
           <AnimatePresence mode="wait">
             <motion.div key={current} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
               <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="inline-block px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6">
                 Welcome to MediCare+
               </motion.span>
 
               <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground mb-2">
                 {slides[current].title}
               </h1>
               <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-accent mb-6">
                 {slides[current].subtitle}
               </h2>
               <p className="text-primary-foreground/80 text-lg md:text-xl max-w-lg mb-8">
                 {slides[current].description}
               </p>
 
               <div className="flex flex-col sm:flex-row gap-4">
                 <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-8 py-6 text-base">
                   <Link to="/appointment">
                     <Calendar className="w-5 h-5 mr-2"/>
                     Book Appointment
                   </Link>
                 </Button>
                 <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-xl px-8 py-6 text-base">
                   <Link to="/services">
                     <Stethoscope className="w-5 h-5 mr-2"/>
                     Our Services
                   </Link>
                 </Button>
               </div>
             </motion.div>
           </AnimatePresence>
         </div>
       </div>
 
       {/* Navigation Arrows */}
       <div className="absolute bottom-8 right-8 flex items-center gap-4 z-20">
         <button onClick={prev} className="w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-card/40 transition-all">
           <ChevronLeft className="w-6 h-6"/>
         </button>
         <button onClick={next} className="w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-card/40 transition-all">
           <ChevronRight className="w-6 h-6"/>
         </button>
       </div>
 
       {/* Slide Indicators */}
       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
         {slides.map((_, index) => (<button key={index} onClick={() => setCurrent(index)} className={`h-2 rounded-full transition-all duration-300 ${index === current ? "w-8 bg-accent" : "w-2 bg-primary-foreground/40"}`}/>))}
       </div>
 
       {/* Quick Stats Bar */}
       <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="absolute bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border hidden lg:block">
         <div className="container mx-auto px-8">
           <div className="grid grid-cols-3 divide-x divide-border">
             {[
            { icon: Clock, label: "24/7 Emergency", value: "Always Available" },
            { icon: Stethoscope, label: "Expert Doctors", value: "200+ Specialists" },
            { icon: Calendar, label: "Appointments", value: "Same Day Available" },
        ].map((stat, index) => (<div key={index} className="flex items-center gap-4 py-6 px-8">
                 <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                   <stat.icon className="w-6 h-6 text-accent"/>
                 </div>
                 <div>
                   <p className="text-sm text-muted-foreground">{stat.label}</p>
                   <p className="font-display font-semibold text-foreground">{stat.value}</p>
                 </div>
               </div>))}
           </div>
         </div>
       </motion.div>
     </section>);
};
