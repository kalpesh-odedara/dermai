 import { useRef, useState } from "react";
 import { motion, useInView } from "framer-motion";
 import { Layout } from "@/components/layout/Layout";
 import { 
   MapPin, Phone, Mail, Clock, Send, 
   MessageSquare, CheckCircle
 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 
 const contactInfo = [
   {
     icon: MapPin,
     title: "Our Location",
     content: "123 Medical Center Drive\nHealthcare City, HC 12345",
   },
   {
     icon: Phone,
     title: "Phone",
     content: "+1 (234) 567-8900\nEmergency: 911",
   },
   {
     icon: Mail,
     title: "Email",
     content: "contact@medicare.com\nsupport@medicare.com",
   },
   {
     icon: Clock,
     title: "Working Hours",
     content: "Mon - Fri: 8:00 AM - 8:00 PM\nSat - Sun: 9:00 AM - 5:00 PM",
   },
 ];
 
 const Contact = () => {
   const formRef = useRef(null);
   const isInView = useInView(formRef, { once: true, margin: "-100px" });
   const [submitted, setSubmitted] = useState(false);
   const [focused, setFocused] = useState<string | null>(null);
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     setSubmitted(true);
     setTimeout(() => setSubmitted(false), 3000);
   };
 
   return (
     <Layout>
       {/* Hero */}
       <section className="py-16 lg:py-24 bg-gradient-to-b from-cyan-light to-background">
         <div className="container mx-auto px-4 lg:px-8">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-center max-w-2xl mx-auto"
           >
             <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
               Get in Touch
             </span>
             <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
               Contact <span className="text-accent">Us</span>
             </h1>
             <p className="text-muted-foreground text-lg">
               Have questions? We're here to help. Reach out to us anytime.
             </p>
           </motion.div>
         </div>
       </section>
 
       {/* Main Content */}
       <section className="py-16 lg:py-24">
         <div className="container mx-auto px-4 lg:px-8">
           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
             {/* Contact Info & Map */}
             <div>
               <div className="grid sm:grid-cols-2 gap-6 mb-12">
                 {contactInfo.map((info, index) => (
                   <motion.div
                     key={info.title}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.4, delay: index * 0.1 }}
                     className="p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-300"
                   >
                     <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                       <info.icon className="w-6 h-6 text-accent" />
                     </div>
                     <h3 className="font-display font-semibold text-foreground mb-2">
                       {info.title}
                     </h3>
                     <p className="text-muted-foreground text-sm whitespace-pre-line">
                       {info.content}
                     </p>
                   </motion.div>
                 ))}
               </div>
 
               {/* Stylized Map Placeholder */}
               <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.5, delay: 0.4 }}
                 className="relative h-[300px] rounded-3xl overflow-hidden border border-border"
               >
                 <div className="absolute inset-0 bg-gradient-to-br from-muted to-secondary">
                   {/* Map grid pattern */}
                   <div className="absolute inset-0 opacity-30">
                     <div className="w-full h-full" style={{
                       backgroundImage: `
                         linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                         linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
                       `,
                       backgroundSize: '40px 40px'
                     }} />
                   </div>
                   
                   {/* Location pin */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                     <motion.div
                       animate={{ y: [0, -10, 0] }}
                       transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                       className="relative"
                     >
                       <div className="w-16 h-16 rounded-full bg-accent/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" />
                       <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center relative z-10 shadow-lg">
                         <MapPin className="w-6 h-6 text-accent-foreground" />
                       </div>
                     </motion.div>
                   </div>
 
                   {/* Roads */}
                   <div className="absolute top-1/2 left-0 right-0 h-4 bg-primary/10 -translate-y-1/2" />
                   <div className="absolute top-0 bottom-0 left-1/2 w-4 bg-primary/10 -translate-x-1/2" />
                 </div>
 
                 {/* Map label */}
                 <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-card/90 backdrop-blur-sm">
                   <p className="font-medium text-foreground text-sm">MediCare+ Medical Center</p>
                   <p className="text-muted-foreground text-xs">123 Medical Center Drive, Healthcare City</p>
                 </div>
               </motion.div>
             </div>
 
             {/* Contact Form */}
             <motion.div
               ref={formRef}
               initial={{ opacity: 0, x: 30 }}
               animate={isInView ? { opacity: 1, x: 0 } : {}}
               transition={{ duration: 0.6 }}
             >
               <div className="glass-card rounded-3xl p-8 lg:p-10">
                 <div className="flex items-center gap-3 mb-8">
                   <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                     <MessageSquare className="w-6 h-6 text-accent" />
                   </div>
                   <div>
                     <h2 className="font-display font-bold text-xl text-foreground">
                       Send us a Message
                     </h2>
                     <p className="text-muted-foreground text-sm">
                       We'll get back to you within 24 hours
                     </p>
                   </div>
                 </div>
 
                 {submitted ? (
                   <motion.div
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="text-center py-12"
                   >
                     <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                       <CheckCircle className="w-8 h-8 text-success" />
                     </div>
                     <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                       Message Sent!
                     </h3>
                     <p className="text-muted-foreground">
                       Thank you for reaching out. We'll be in touch soon.
                     </p>
                   </motion.div>
                 ) : (
                   <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="grid sm:grid-cols-2 gap-6">
                       <div className="space-y-2 relative">
                         <Label 
                           htmlFor="name"
                           className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                             focused === "name" ? "top-1 text-xs text-accent" : "top-4 text-sm text-muted-foreground"
                           }`}
                         >
                           Full Name
                         </Label>
                         <Input
                           id="name"
                           required
                           onFocus={() => setFocused("name")}
                           onBlur={(e) => !e.target.value && setFocused(null)}
                           className="rounded-xl py-6 pt-7"
                         />
                       </div>
                       <div className="space-y-2 relative">
                         <Label 
                           htmlFor="email"
                           className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                             focused === "email" ? "top-1 text-xs text-accent" : "top-4 text-sm text-muted-foreground"
                           }`}
                         >
                           Email Address
                         </Label>
                         <Input
                           id="email"
                           type="email"
                           required
                           onFocus={() => setFocused("email")}
                           onBlur={(e) => !e.target.value && setFocused(null)}
                           className="rounded-xl py-6 pt-7"
                         />
                       </div>
                     </div>
 
                     <div className="space-y-2 relative">
                       <Label 
                         htmlFor="phone"
                         className={`absolute left-4 transition-all duration-200 pointer-events-none z-10 ${
                           focused === "phone" ? "top-1 text-xs text-accent" : "top-4 text-sm text-muted-foreground"
                         }`}
                       >
                         Phone Number
                       </Label>
                       <Input
                         id="phone"
                         type="tel"
                         onFocus={() => setFocused("phone")}
                         onBlur={(e) => !e.target.value && setFocused(null)}
                         className="rounded-xl py-6 pt-7"
                       />
                     </div>
 
                     <div className="space-y-2 relative">
                       <Label 
                         htmlFor="subject"
                         className={`absolute left-4 transition-all duration-200 pointer-events-none z-10 ${
                           focused === "subject" ? "top-1 text-xs text-accent" : "top-4 text-sm text-muted-foreground"
                         }`}
                       >
                         Subject
                       </Label>
                       <Input
                         id="subject"
                         required
                         onFocus={() => setFocused("subject")}
                         onBlur={(e) => !e.target.value && setFocused(null)}
                         className="rounded-xl py-6 pt-7"
                       />
                     </div>
 
                     <div className="space-y-2">
                       <Label htmlFor="message">Message</Label>
                       <Textarea
                         id="message"
                         required
                         placeholder="How can we help you?"
                         className="rounded-xl min-h-[140px]"
                       />
                     </div>
 
                     <Button
                       type="submit"
                       className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl py-6 text-base"
                     >
                       <Send className="w-5 h-5 mr-2" />
                       Send Message
                     </Button>
                   </form>
                 )}
               </div>
             </motion.div>
           </div>
         </div>
       </section>
     </Layout>
   );
 };
 
 export default Contact;