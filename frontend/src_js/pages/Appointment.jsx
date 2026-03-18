import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { User, Calendar, Stethoscope, ChevronLeft, ChevronRight, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
const steps = [
    { id: 1, title: "Personal Info", icon: User },
    { id: 2, title: "Select Service", icon: Stethoscope },
    { id: 3, title: "Date & Time", icon: Calendar },
    { id: 4, title: "Confirm", icon: Check },
];
const departments = [
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "General Medicine",
    "Ophthalmology",
];
const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];
const Appointment = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        doctor: "",
        date: "",
        time: "",
        reason: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const updateForm = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
    const handleSubmit = () => {
        setSubmitted(true);
    };
    if (submitted) {
        return (<Layout>
         <section className="min-h-[80vh] flex items-center justify-center py-20">
           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto px-4">
             <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
               <Check className="w-10 h-10 text-success"/>
             </div>
             <h2 className="font-display text-3xl font-bold text-foreground mb-4">
               Appointment Booked!
             </h2>
             <p className="text-muted-foreground mb-8">
               Your appointment has been successfully scheduled. You will receive a 
               confirmation email shortly at {formData.email}.
             </p>
             <Button onClick={() => { setSubmitted(false); setCurrentStep(1); setFormData({ firstName: "", lastName: "", email: "", phone: "", department: "", doctor: "", date: "", time: "", reason: "" }); }} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-8">
               Book Another Appointment
             </Button>
           </motion.div>
         </section>
       </Layout>);
    }
    return (<Layout>
       {/* Hero */}
       <section className="py-16 lg:py-24 bg-gradient-to-b from-cyan-light to-background">
         <div className="container mx-auto px-4 lg:px-8">
           <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto">
             <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
               Book an <span className="text-accent">Appointment</span>
             </h1>
             <p className="text-muted-foreground text-lg">
               Schedule your visit in just a few simple steps
             </p>
           </motion.div>
         </div>
       </section>
 
       {/* Form Section */}
       <section className="py-16 lg:py-24">
         <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
           {/* Progress Steps */}
           <div className="flex items-center justify-between mb-12">
             {steps.map((step, index) => (<div key={step.id} className="flex items-center">
                 <div className="flex flex-col items-center">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= step.id
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground"}`}>
                     {currentStep > step.id ? (<Check className="w-5 h-5"/>) : (<step.icon className="w-5 h-5"/>)}
                   </div>
                   <span className={`text-sm mt-2 hidden sm:block ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}>
                     {step.title}
                   </span>
                 </div>
                 {index < steps.length - 1 && (<div className={`w-12 sm:w-24 lg:w-32 h-1 mx-2 rounded-full transition-all duration-300 ${currentStep > step.id ? "bg-accent" : "bg-muted"}`}/>)}
               </div>))}
           </div>
 
           {/* Glass Form Card */}
           <motion.div className="glass-card rounded-3xl p-8 lg:p-12" layout>
             <AnimatePresence mode="wait">
               {/* Step 1: Personal Info */}
               {currentStep === 1 && (<motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                   <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                     Personal Information
                   </h2>
                   <div className="grid sm:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <Label htmlFor="firstName">First Name</Label>
                       <Input id="firstName" value={formData.firstName} onChange={(e) => updateForm("firstName", e.target.value)} placeholder="John" className="rounded-xl py-6"/>
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="lastName">Last Name</Label>
                       <Input id="lastName" value={formData.lastName} onChange={(e) => updateForm("lastName", e.target.value)} placeholder="Doe" className="rounded-xl py-6"/>
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="email">Email Address</Label>
                       <Input id="email" type="email" value={formData.email} onChange={(e) => updateForm("email", e.target.value)} placeholder="john@example.com" className="rounded-xl py-6"/>
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="phone">Phone Number</Label>
                       <Input id="phone" type="tel" value={formData.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="+1 (234) 567-8900" className="rounded-xl py-6"/>
                     </div>
                   </div>
                 </motion.div>)}
 
               {/* Step 2: Service */}
               {currentStep === 2 && (<motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                   <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                     Select Department
                   </h2>
                   <div className="space-y-6">
                     <div className="space-y-2">
                       <Label>Department</Label>
                       <Select value={formData.department} onValueChange={(v) => updateForm("department", v)}>
                         <SelectTrigger className="rounded-xl py-6">
                           <SelectValue placeholder="Choose a department"/>
                         </SelectTrigger>
                         <SelectContent>
                           {departments.map((dept) => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}
                         </SelectContent>
                       </Select>
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="reason">Reason for Visit</Label>
                       <Textarea id="reason" value={formData.reason} onChange={(e) => updateForm("reason", e.target.value)} placeholder="Briefly describe your symptoms or reason for the appointment..." className="rounded-xl min-h-[120px]"/>
                     </div>
                   </div>
                 </motion.div>)}
 
               {/* Step 3: Date & Time */}
               {currentStep === 3 && (<motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                   <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                     Choose Date & Time
                   </h2>
                   <div className="space-y-6">
                     <div className="space-y-2">
                       <Label htmlFor="date">Preferred Date</Label>
                       <Input id="date" type="date" value={formData.date} onChange={(e) => updateForm("date", e.target.value)} className="rounded-xl py-6" min={new Date().toISOString().split('T')[0]}/>
                     </div>
                     <div className="space-y-2">
                       <Label>Available Time Slots</Label>
                       <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                         {timeSlots.map((slot) => (<button key={slot} type="button" onClick={() => updateForm("time", slot)} className={`p-3 rounded-xl text-sm font-medium transition-all ${formData.time === slot
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent/10"}`}>
                             {slot}
                           </button>))}
                       </div>
                     </div>
                   </div>
                 </motion.div>)}
 
               {/* Step 4: Confirm */}
               {currentStep === 4 && (<motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                   <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                     Confirm Your Appointment
                   </h2>
                   <div className="bg-muted rounded-2xl p-6 space-y-4">
                     <div className="flex justify-between items-center py-2 border-b border-border">
                       <span className="text-muted-foreground">Patient</span>
                       <span className="font-medium text-foreground">{formData.firstName} {formData.lastName}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-border">
                       <span className="text-muted-foreground">Email</span>
                       <span className="font-medium text-foreground">{formData.email}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-border">
                       <span className="text-muted-foreground">Department</span>
                       <span className="font-medium text-foreground">{formData.department}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-border">
                       <span className="text-muted-foreground">Date</span>
                       <span className="font-medium text-foreground">{formData.date}</span>
                     </div>
                     <div className="flex justify-between items-center py-2">
                       <span className="text-muted-foreground">Time</span>
                       <span className="font-medium text-foreground">{formData.time}</span>
                     </div>
                   </div>
                   <div className="flex items-start gap-3 mt-6 p-4 rounded-xl bg-accent/10">
                     <AlertCircle className="w-5 h-5 text-accent mt-0.5"/>
                     <p className="text-sm text-muted-foreground">
                       Please arrive 15 minutes before your scheduled appointment. 
                       Bring a valid ID and any relevant medical records.
                     </p>
                   </div>
                 </motion.div>)}
             </AnimatePresence>
 
             {/* Navigation Buttons */}
             <div className="flex justify-between mt-8 pt-6 border-t border-border">
               <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="rounded-xl px-6">
                 <ChevronLeft className="w-4 h-4 mr-2"/>
                 Previous
               </Button>
               {currentStep < 4 ? (<Button onClick={nextStep} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-6">
                   Next Step
                   <ChevronRight className="w-4 h-4 ml-2"/>
                 </Button>) : (<Button onClick={handleSubmit} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-6">
                   Confirm Booking
                   <Check className="w-4 h-4 ml-2"/>
                 </Button>)}
             </div>
           </motion.div>
         </div>
       </section>
     </Layout>);
};
export default Appointment;
