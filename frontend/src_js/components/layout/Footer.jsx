import { Link } from "react-router-dom";
import { Heart, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
export const Footer = () => {
    return (<footer className="bg-primary text-primary-foreground">
       <div className="container mx-auto px-4 lg:px-8 py-16">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
           {/* Brand */}
           <div>
             <Link to="/" className="flex items-center gap-2 mb-6">
               <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                 <Heart className="w-5 h-5 text-accent-foreground"/>
               </div>
               <span className="font-display font-bold text-xl">
                 MediCare<span className="text-accent">+</span>
               </span>
             </Link>
             <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
               Providing world-class healthcare services with compassion and excellence. Your health is our priority.
             </p>
             <div className="flex items-center gap-3">
               {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (<a key={i} href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                   <Icon className="w-4 h-4"/>
                 </a>))}
             </div>
           </div>
 
           {/* Quick Links */}
           <div>
             <h4 className="font-display font-semibold text-lg mb-6">Quick Links</h4>
             <ul className="space-y-3">
               {["About Us", "Our Services", "Doctors", "Departments", "Contact"].map((link) => (<li key={link}>
                   <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                     {link}
                   </a>
                 </li>))}
             </ul>
           </div>
 
           {/* Services */}
           <div>
             <h4 className="font-display font-semibold text-lg mb-6">Our Services</h4>
             <ul className="space-y-3">
               {["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Dermatology"].map((service) => (<li key={service}>
                   <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                     {service}
                   </a>
                 </li>))}
             </ul>
           </div>
 
           {/* Contact */}
           <div>
             <h4 className="font-display font-semibold text-lg mb-6">Contact Us</h4>
             <ul className="space-y-4">
               <li className="flex items-start gap-3">
                 <MapPin className="w-5 h-5 text-accent mt-0.5"/>
                 <span className="text-primary-foreground/70 text-sm">123 Medical Center Drive, Healthcare City, HC 12345</span>
               </li>
               <li className="flex items-center gap-3">
                 <Phone className="w-5 h-5 text-accent"/>
                 <span className="text-primary-foreground/70 text-sm">+1 (234) 567-8900</span>
               </li>
               <li className="flex items-center gap-3">
                 <Mail className="w-5 h-5 text-accent"/>
                 <span className="text-primary-foreground/70 text-sm">contact@medicare.com</span>
               </li>
             </ul>
           </div>
         </div>
 
         <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
           <p className="text-primary-foreground/50 text-sm">
             © 2025 MediCare+. All rights reserved.
           </p>
           <div className="flex items-center gap-6">
             <a href="#" className="text-primary-foreground/50 hover:text-accent transition-colors text-sm">Privacy Policy</a>
             <a href="#" className="text-primary-foreground/50 hover:text-accent transition-colors text-sm">Terms of Service</a>
           </div>
         </div>
       </div>
     </footer>);
};
