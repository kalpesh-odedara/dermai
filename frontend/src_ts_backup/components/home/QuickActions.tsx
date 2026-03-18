 import { motion } from "framer-motion";
 import { useInView } from "framer-motion";
 import { useRef } from "react";
 import { Link } from "react-router-dom";
 import { Calendar, FileText, Stethoscope, Phone, Ambulance, Pill } from "lucide-react";
 
 const actions = [
   {
     icon: Calendar,
     title: "Book Appointment",
     description: "Schedule a visit with our specialists",
     link: "/appointment",
     color: "bg-cyan-light",
     iconColor: "text-accent",
   },
   {
     icon: FileText,
     title: "Get Prescription",
     description: "Access your digital prescriptions",
     link: "/prescription",
     color: "bg-navy-light",
     iconColor: "text-primary",
   },
   {
     icon: Stethoscope,
     title: "Find a Doctor",
     description: "Browse our expert medical team",
     link: "/services",
     color: "bg-cyan-light",
     iconColor: "text-accent",
   },
   {
     icon: Ambulance,
     title: "Emergency",
     description: "24/7 emergency services",
     link: "/contact",
     color: "bg-destructive/10",
     iconColor: "text-destructive",
   },
   {
     icon: Pill,
     title: "Pharmacy",
     description: "Order medicines online",
     link: "/services",
     color: "bg-success/10",
     iconColor: "text-success",
   },
   {
     icon: Phone,
     title: "Telemedicine",
     description: "Virtual consultations available",
     link: "/appointment",
     color: "bg-warning/10",
     iconColor: "text-warning",
   },
 ];
 
 export const QuickActions = () => {
   const ref = useRef(null);
   const isInView = useInView(ref, { once: true, margin: "-100px" });
 
   return (
     <section className="py-20 lg:py-32 bg-background" ref={ref}>
       <div className="container mx-auto px-4 lg:px-8">
         <motion.div
           initial={{ opacity: 0, x: -30 }}
           animate={isInView ? { opacity: 1, x: 0 } : {}}
           transition={{ duration: 0.6 }}
           className="text-center mb-16"
         >
           <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
             Quick Access
           </span>
           <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
             How Can We Help You?
           </h2>
           <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
             Access our services quickly and easily. Your health journey starts here.
           </p>
         </motion.div>
 
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {actions.map((action, index) => (
             <motion.div
               key={action.title}
               initial={{ opacity: 0, y: 30 }}
               animate={isInView ? { opacity: 1, y: 0 } : {}}
               transition={{ duration: 0.5, delay: index * 0.1 }}
             >
               <Link
                 to={action.link}
                 className="group block p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-accent/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
               >
                 <div className={`w-16 h-16 rounded-2xl ${action.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                   <action.icon className={`w-7 h-7 ${action.iconColor}`} />
                 </div>
                 <h3 className="font-display font-semibold text-xl text-foreground mb-2 group-hover:text-accent transition-colors">
                   {action.title}
                 </h3>
                 <p className="text-muted-foreground">
                   {action.description}
                 </p>
               </Link>
             </motion.div>
           ))}
         </div>
       </div>
     </section>
   );
 };