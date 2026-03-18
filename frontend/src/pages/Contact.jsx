import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
const contactInfo = [
  {
    icon: MapPin,
    title: "Our Location",
    content: "MG Road, Near Sudama Temple\nPorbandar, Gujarat 360575",
  },
  {
    icon: Phone,
    title: "Phone",
    content: "9313690610\nEmergency: 911",
  },
  {
    icon: Mail,
    title: "Email",
    content: "contact@dermacare.com\nsupport@dermacare.com",
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
  const [focused, setFocused] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("http://localhost:5000/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        e.target.reset();
        setFocused(null);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to send message"}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to connect to the server. Please ensure the backend is running.");
    }
  };
  return (<Layout>
    {/* Hero */}
    <section className="py-16 lg:py-24 bg-gradient-to-b from-cyan-light to-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto">
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
              {contactInfo.map((info, index) => (<motion.div key={info.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }} className="p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <info.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {info.title}
                </h3>
                <p className="text-muted-foreground text-sm whitespace-pre-line">
                  {info.content}
                </p>
              </motion.div>))}
            </div>

            {/* Stylized Map Placeholder */}
            {/* Live Porbandar Map */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="relative h-[400px] rounded-3xl overflow-hidden border border-border bg-muted shadow-inner group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14781.986884021272!2d69.5898327!3d21.64451005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3956346eb617ed77%3A0xc3f949c869be9c11!2sPorbandar%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full grayscale-[20%] contrast-[1.1] transition-all duration-500 group-hover:grayscale-0"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="DermaCare Porbandar Location"
              />

              {/* Map overlay label */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-card/90 backdrop-blur-md border border-border shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="font-display font-semibold text-foreground text-sm">DermaCare Porbandar Clinic</p>
                <p className="text-muted-foreground text-xs">Serving the coastal community with expert care</p>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div ref={formRef} initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
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

              {submitted ? (<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                  Message Sent!
                </h3>
                <p className="text-muted-foreground">
                  Thank you for reaching out. We'll be in touch soon.
                </p>
              </motion.div>) : (<form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2 relative">
                    <Label htmlFor="name" className={`absolute left-4 transition-all duration-200 pointer-events-none ${focused === "name" ? "top-1 text-xs text-accent" : "top-4 text-sm text-muted-foreground"}`}>
                      Full Name
                    </Label>
                    <Input id="name" name="name" required onFocus={() => setFocused("name")} onBlur={(e) => !e.target.value && setFocused(null)} className="rounded-xl py-6 pt-7" />
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="email" className={`absolute left-4 transition-all duration-200 pointer-events-none ${focused === "email" ? "top-1 text-xs text-accent" : "top-4 text-sm text-muted-foreground"}`}>
                      Email Address
                    </Label>
                    <Input id="email" name="email" type="email" required onFocus={() => setFocused("email")} onBlur={(e) => !e.target.value && setFocused(null)} className="rounded-xl py-6 pt-7" />
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="phone" className={`absolute left-4 transition-all duration-200 pointer-events-none z-10 ${focused === "phone" ? "top-1 text-xs text-accent" : "top-4 text-sm text-muted-foreground"}`}>
                    Phone Number
                  </Label>
                  <Input id="phone" name="phone" type="tel" onFocus={() => setFocused("phone")} onBlur={(e) => !e.target.value && setFocused(null)} className="rounded-xl py-6 pt-7" />
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="subject" className={`absolute left-4 transition-all duration-200 pointer-events-none z-10 ${focused === "subject" ? "top-1 text-xs text-accent" : "top-4 text-sm text-muted-foreground"}`}>
                    Subject
                  </Label>
                  <Input id="subject" name="subject" required onFocus={() => setFocused("subject")} onBlur={(e) => !e.target.value && setFocused(null)} className="rounded-xl py-6 pt-7" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" required placeholder="How can we help you?" className="rounded-xl min-h-[140px]" />
                </div>

                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl py-6 text-base">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>)}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  </Layout>);
};
export default Contact;
