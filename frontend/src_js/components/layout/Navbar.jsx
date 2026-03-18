import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Appointment", path: "/appointment" },
    { name: "Prescription", path: "/prescription" },
    { name: "Contact", path: "/contact" },
];
export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    return (<nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
       <div className="container mx-auto px-4 lg:px-8">
         <div className="flex items-center justify-between h-16 lg:h-20">
           {/* Logo */}
           <Link to="/" className="flex items-center gap-2">
             <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
               <Heart className="w-5 h-5 text-accent-foreground"/>
             </div>
             <span className="font-display font-bold text-xl text-primary">
               MediCare<span className="text-accent">+</span>
             </span>
           </Link>
 
           {/* Desktop Navigation */}
           <div className="hidden lg:flex items-center gap-1">
             {navLinks.map((link) => (<Link key={link.path} to={link.path} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${location.pathname === link.path
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-primary hover:bg-muted"}`}>
                 {link.name}
               </Link>))}
           </div>
 
           {/* CTA Button */}
           <div className="hidden lg:flex items-center gap-4">
             <a href="tel:+1234567890" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
               <Phone className="w-4 h-4"/>
               <span>Emergency: 911</span>
             </a>
             <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-6">
               <Link to="/appointment">Book Appointment</Link>
             </Button>
           </div>
 
           {/* Mobile Menu Button */}
           <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
             {isOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
           </button>
         </div>
       </div>
 
       {/* Mobile Sidebar */}
       <AnimatePresence>
         {isOpen && (<>
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-primary/20 backdrop-blur-sm lg:hidden z-40" onClick={() => setIsOpen(false)}/>
             <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 bottom-0 w-80 bg-card border-l border-border shadow-2xl lg:hidden z-50">
               <div className="flex flex-col h-full p-6">
                 <div className="flex items-center justify-between mb-8">
                   <span className="font-display font-bold text-xl text-primary">
                     MediCare<span className="text-accent">+</span>
                   </span>
                   <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                     <X className="w-6 h-6"/>
                   </button>
                 </div>
 
                 <div className="flex flex-col gap-2">
                   {navLinks.map((link, index) => (<motion.div key={link.path} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                       <Link to={link.path} onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${location.pathname === link.path
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-muted"}`}>
                         {link.name}
                       </Link>
                     </motion.div>))}
                 </div>
 
                 <div className="mt-auto">
                   <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl py-6">
                     <Link to="/appointment" onClick={() => setIsOpen(false)}>
                       Book Appointment
                     </Link>
                   </Button>
                 </div>
               </div>
             </motion.div>
           </>)}
       </AnimatePresence>
     </nav>);
};
