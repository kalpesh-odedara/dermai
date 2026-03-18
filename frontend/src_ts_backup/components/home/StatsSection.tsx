 import { motion, useInView } from "framer-motion";
 import { useRef, useEffect, useState } from "react";
 import { Users, Award, Clock, Building2 } from "lucide-react";
 
 const stats = [
   { icon: Users, value: 50000, suffix: "+", label: "Patients Treated" },
   { icon: Award, value: 200, suffix: "+", label: "Expert Doctors" },
   { icon: Clock, value: 25, suffix: "+", label: "Years Experience" },
   { icon: Building2, value: 15, suffix: "", label: "Departments" },
 ];
 
 const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
   const [count, setCount] = useState(0);
   const ref = useRef(null);
   const isInView = useInView(ref, { once: true });
 
   useEffect(() => {
     if (!isInView) return;
     
     const duration = 2000;
     const steps = 60;
     const increment = target / steps;
     let current = 0;
 
     const timer = setInterval(() => {
       current += increment;
       if (current >= target) {
         setCount(target);
         clearInterval(timer);
       } else {
         setCount(Math.floor(current));
       }
     }, duration / steps);
 
     return () => clearInterval(timer);
   }, [isInView, target]);
 
   return (
     <span ref={ref}>
       {count.toLocaleString()}{suffix}
     </span>
   );
 };
 
 export const StatsSection = () => {
   const ref = useRef(null);
   const isInView = useInView(ref, { once: true, margin: "-100px" });
 
   return (
     <section ref={ref} className="py-20 gradient-primary">
       <div className="container mx-auto px-4 lg:px-8">
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
           {stats.map((stat, index) => (
             <motion.div
               key={stat.label}
               initial={{ opacity: 0, y: 30 }}
               animate={isInView ? { opacity: 1, y: 0 } : {}}
               transition={{ duration: 0.5, delay: index * 0.1 }}
               className="text-center"
             >
               <div className="w-16 h-16 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-4">
                 <stat.icon className="w-8 h-8 text-accent" />
               </div>
               <div className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-2">
                 <Counter target={stat.value} suffix={stat.suffix} />
               </div>
               <p className="text-primary-foreground/70">{stat.label}</p>
             </motion.div>
           ))}
         </div>
       </div>
     </section>
   );
 };