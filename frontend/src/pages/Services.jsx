import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Sparkles, Clock, Zap, Stethoscope, Shield, Baby, ArrowRight, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FeedbackForm from "@/components/FeedbackForm";

const services = [
  {
    icon: Sparkles,
    title: "Acne & Scar Treatment",
    shortDesc: "Clear skin solutions",
    fullDesc: "Advanced treatments for active acne and scar reduction using chemical peels, microneedling, and laser therapy.",
    features: ["Chemical Peels", "Microneedling", "Laser Resurfacing", "Customized Regimens"],
    color: "bg-destructive/10",
    iconColor: "text-destructive",
  },
  {
    icon: Clock,
    title: "Anti-Aging & Fillers",
    shortDesc: "Restore youthful skin",
    fullDesc: "Non-surgical rejuvenation treatments to smooth wrinkles, restore volume, and enhance facial contours.",
    features: ["Botox & Dysport", "Dermal Fillers", "Thread Lifts", "PRP Therapy"],
    color: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    icon: Zap,
    title: "Laser Treatments",
    shortDesc: "Hair removal & more",
    fullDesc: "State-of-the-art laser technology for hair removal, pigmentation correction, and vascular lesion treatment.",
    features: ["Hair Removal", "Tattoo Removal", "Pigmentation Correction", "Vein Treatment"],
    color: "bg-success/10",
    iconColor: "text-success",
  },
  {
    icon: Stethoscope,
    title: "Medical Dermatology",
    shortDesc: "Diagnose & treat",
    fullDesc: "Comprehensive care for all skin conditions including eczema, psoriasis, rosacea, and skin infections.",
    features: ["Eczema & Psoriasis", "Mole Removal", "Skin Allergies", "Wart Removal"],
    color: "bg-warning/10",
    iconColor: "text-warning",
  },
  {
    icon: Shield,
    title: "Skin Cancer Screening",
    shortDesc: "Early detection",
    fullDesc: "Thorough body checks and dermoscopy to detect and treat skin cancer at its earliest, most treatable stages.",
    features: ["Full Body Checks", "Dermoscopy", "Biopsy", "Mohs Surgery Referrals"],
    color: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Baby,
    title: "Pediatric Dermatology",
    shortDesc: "Care for kids",
    fullDesc: "Gentle and effective skin care tailored for infants, children, and adolescents.",
    features: ["Eczema Management", "Startmarks", "Skin Infections", "Acne in Teens"],
    color: "bg-cyan-light",
    iconColor: "text-accent",
  },
];
const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedService, setSelectedService] = useState(null);
  return (<Layout>
    {/* Hero */}
    <section className="py-20 lg:py-32 bg-gradient-to-b from-navy-light to-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            Our Services
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Comprehensive <span className="text-accent">Medical Services</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            From routine checkups to specialized treatments, we offer a full spectrum
            of healthcare services to meet your needs.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Services Grid */}
    <section ref={ref} className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (<motion.div key={service.title} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }} onClick={() => setSelectedService(service)} className="group cursor-pointer p-8 rounded-3xl bg-card border border-border hover:border-accent transition-all duration-500 hover:shadow-2xl hover:-translate-y-3">
            <div className={`w-20 h-20 rounded-2xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
              <service.icon className={`w-10 h-10 ${service.iconColor}`} />
            </div>
            <h3 className="font-display font-bold text-2xl text-foreground mb-3 group-hover:text-accent transition-colors">
              {service.title}
            </h3>
            <p className="text-muted-foreground mb-6">
              {service.shortDesc}
            </p>
            <div className="flex items-center text-accent font-medium">
              <span>Learn more</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </motion.div>))}
        </div>
      </div>
    </section>

    {/* Service Modal */}
    <AnimatePresence>
      {selectedService && (<>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-primary/50 backdrop-blur-sm z-50" onClick={() => setSelectedService(null)} />
        <motion.div initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-40%" }} animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }} exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-40%" }} className="fixed left-1/2 top-1/2 w-[90%] max-w-lg bg-card rounded-3xl p-8 shadow-2xl z-50">
          <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>

          <div className={`w-16 h-16 rounded-2xl ${selectedService.color} flex items-center justify-center mb-6`}>
            <selectedService.icon className={`w-8 h-8 ${selectedService.iconColor}`} />
          </div>

          <h3 className="font-display font-bold text-2xl text-foreground mb-4">
            {selectedService.title}
          </h3>
          <p className="text-muted-foreground mb-6">
            {selectedService.fullDesc}
          </p>

          <div className="space-y-3 mb-8">
            {selectedService.features.map((feature, i) => (<motion.div key={feature} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span className="text-foreground">{feature}</span>
            </motion.div>))}
          </div>

          <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl py-6">
            <Link to="/appointment">Book Appointment</Link>
          </Button>
        </motion.div>
      </>)}
    </AnimatePresence>

    <FeedbackForm />


    {/* CTA Section */}
    <section className="py-20 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Need Help Choosing a Service?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Our patient coordinators are here to guide you to the right department
            and specialist for your needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-8 py-6">
              <Link to="/appointment">Schedule Consultation</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl px-8 py-6">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  </Layout>);
};
export default Services;
