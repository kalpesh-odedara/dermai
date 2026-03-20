import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { User, Calendar, Stethoscope, ChevronLeft, ChevronRight, Check, AlertCircle, Search, Clock, ShieldCheck, ClipboardList, HelpCircle, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import heroHospital from "@/assets/hero-hospital.jpg";
import aboutDoctor from "@/assets/about-doctor.jpg";
const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Select Service", icon: Stethoscope },
  { id: 3, title: "Date & Time", icon: Calendar },
  { id: 4, title: "Confirm", icon: Check },
];
const departments = [
  "General Dermatology",
  "Cosmetic Dermatology",
  "Pediatric Dermatology",
  "Surgical Dermatology",
  "Trichology (Hair & Scalp)",
  "Venereology",
];
const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];
const Appointment = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("userAuthenticated") === "true";
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
  const [errors, setErrors] = useState({});
  const [statusEmail, setStatusEmail] = useState("");
  const [statusResults, setStatusResults] = useState(null);
  const [isSearchingStatus, setIsSearchingStatus] = useState(false);

  const handleCheckStatus = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to check your appointment status");
      navigate("/login");
      return;
    }
    if (!statusEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setIsSearchingStatus(true);
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/check-status/${encodeURIComponent(statusEmail)}`;
      console.log("Calling status check URL:", url);
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setStatusResults(data);
      } else {
        if (response.status === 404) {
          toast.error("Status route not found on server. Please restart your backend!");
        } else {
          toast.error("Failed to fetch appointment status");
        }
        const errorData = await response.json().catch(() => ({}));
        console.error("Server error:", errorData);
      }
    } catch (error) {
      console.error("Status check error:", error);
      toast.error("Connection error");
    } finally {
      setIsSearchingStatus(false);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
        newErrors.phone = "Invalid phone number";
      }
    } else if (step === 2) {
      if (!formData.department) newErrors.department = "Please select a department";
      if (!formData.reason.trim()) newErrors.reason = "Please provide a reason for your visit";
    } else if (step === 3) {
      if (!formData.date) newErrors.date = "Please select a date";
      if (!formData.time) newErrors.time = "Please select a time slot";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateForm = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !isAuthenticated) {
      toast.error("Please sign in to continue with your booking");
      navigate("/login");
      return;
    }
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({}); // Clear errors when going back
  };

  const handleSubmit = async () => {
    if (validateStep(1) && validateStep(2) && validateStep(3)) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          setSubmitted(true);
        } else {
          const error = await response.json();
          alert("Failed to book appointment: " + error.error);
        }
      } catch (error) {
        console.error("Booking error:", error);
        alert("Connection error. Is the backend running?");
      }
    }
  };
  if (submitted) {
    return (<Layout>
      <section className="min-h-[80vh] flex items-center justify-center py-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-success" />
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
          <p className="text-muted-foreground text-lg mb-8">
            Schedule your visit in just a few simple steps
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-accent text-accent hover:bg-accent/10 rounded-xl px-8 h-12 shadow-sm">
                <Search className="w-4 h-4 mr-2" />
                CHECK YOUR STATUS OF APPOIMENT
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-3xl">
              <DialogHeader>
                <DialogTitle>Check Appointment Status</DialogTitle>
                <DialogDescription>
                  Enter the email address you used to book your appointment.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="john@example.com"
                    value={statusEmail}
                    onChange={(e) => setStatusEmail(e.target.value)}
                    className="rounded-xl"
                  />
                  <Button
                    onClick={handleCheckStatus}
                    disabled={isSearchingStatus}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl"
                  >
                    {isSearchingStatus ? "Searching..." : "Search"}
                  </Button>
                </div>

                <div className="max-h-[300px] overflow-y-auto space-y-3 mt-4 pr-2">
                  {statusResults === null ? (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-2xl">
                      Enter email to see your appointments
                    </div>
                  ) : statusResults.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-2xl">
                      No appointments found for this email
                    </div>
                  ) : (
                    statusResults.map((appt) => (
                      <div key={appt._id} className="p-4 rounded-2xl border border-border bg-muted/30 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{appt.department}</p>
                            <p className="text-xs text-muted-foreground">{appt.date} at {appt.time}</p>
                          </div>
                          <Badge
                            className={
                              appt.status === "Confirmed" ? "bg-success/10 text-success border-success/20" :
                                appt.status === "Read" ? "bg-info/10 text-info border-info/20" :
                                  appt.status === "Cancelled" ? "bg-destructive/10 text-destructive border-destructive/20" :
                                    "bg-warning/10 text-warning border-warning/20"
                            }
                            variant="outline"
                          >
                            {appt.status || "Pending"}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                {currentStep > step.id ? (<Check className="w-5 h-5" />) : (<step.icon className="w-5 h-5" />)}
              </div>
              <span className={`text-sm mt-2 hidden sm:block ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (<div className={`w-12 sm:w-24 lg:w-32 h-1 mx-2 rounded-full transition-all duration-300 ${currentStep > step.id ? "bg-accent" : "bg-muted"}`} />)}
          </div>))}
        </div>

        {/* Glass Form Card */}
        <motion.div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12" layout>
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (<motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Personal Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className={errors.firstName ? "text-destructive" : ""}>First Name</Label>
                  <Input id="firstName" value={formData.firstName} onChange={(e) => updateForm("firstName", e.target.value)} placeholder="John" className={`rounded-xl py-6 ${errors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}`} />
                  {errors.firstName && <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className={errors.lastName ? "text-destructive" : ""}>Last Name</Label>
                  <Input id="lastName" value={formData.lastName} onChange={(e) => updateForm("lastName", e.target.value)} placeholder="Doe" className={`rounded-xl py-6 ${errors.lastName ? "border-destructive focus-visible:ring-destructive" : ""}`} />
                  {errors.lastName && <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">{errors.lastName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>Email Address</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => updateForm("email", e.target.value)} placeholder="john@example.com" className={`rounded-xl py-6 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`} />
                  {errors.email && <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className={errors.phone ? "text-destructive" : ""}>Phone Number</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="9313690610" className={`rounded-xl py-6 ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`} />
                  {errors.phone && <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">{errors.phone}</p>}
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
                  <Label className={errors.department ? "text-destructive" : ""}>Department</Label>
                  <Select value={formData.department} onValueChange={(v) => updateForm("department", v)}>
                    <SelectTrigger className={`rounded-xl py-6 ${errors.department ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="Choose a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">{errors.department}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason" className={errors.reason ? "text-destructive" : ""}>Reason for Visit</Label>
                  <Textarea id="reason" value={formData.reason} onChange={(e) => updateForm("reason", e.target.value)} placeholder="Briefly describe your symptoms or reason for the appointment..." className={`rounded-xl min-h-[120px] ${errors.reason ? "border-destructive focus-visible:ring-destructive" : ""}`} />
                  {errors.reason && <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">{errors.reason}</p>}
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
                  <Label htmlFor="date" className={errors.date ? "text-destructive" : ""}>Preferred Date</Label>
                  <Input id="date" type="date" value={formData.date} onChange={(e) => updateForm("date", e.target.value)} className={`rounded-xl py-6 ${errors.date ? "border-destructive focus-visible:ring-destructive" : ""}`} min={new Date().toISOString().split('T')[0]} />
                  {errors.date && <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">{errors.date}</p>}
                </div>
                <div className="space-y-2">
                  <Label className={errors.time ? "text-destructive" : ""}>Available Time Slots</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                    {timeSlots.map((slot) => (<button key={slot} type="button" onClick={() => updateForm("time", slot)} className={`p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${formData.time === slot
                      ? "bg-accent text-accent-foreground"
                      : `bg-muted text-muted-foreground hover:bg-accent/10 ${errors.time ? "border border-destructive/50" : ""}`}`}>
                      {slot}
                    </button>))}
                  </div>
                  {errors.time && <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">{errors.time}</p>}
                </div>
              </div>
            </motion.div>)}

            {/* Step 4: Confirm */}
            {currentStep === 4 && (<motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Confirm Your Appointment
              </h2>
              <div className="bg-muted rounded-2xl p-4 sm:p-6 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground text-sm sm:text-base">Patient</span>
                  <span className="font-medium text-foreground text-sm sm:text-base text-right">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground text-sm sm:text-base">Email</span>
                  <span className="font-medium text-foreground text-sm sm:text-base text-right truncate ml-4">{formData.email}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground text-sm sm:text-base">Department</span>
                  <span className="font-medium text-foreground text-sm sm:text-base text-right">{formData.department}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground text-sm sm:text-base">Date</span>
                  <span className="font-medium text-foreground text-sm sm:text-base text-right">{formData.date}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground text-sm sm:text-base">Time</span>
                  <span className="font-medium text-foreground text-sm sm:text-base text-right">{formData.time}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 mt-6 p-4 rounded-xl bg-accent/10">
                <AlertCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Please arrive 15 minutes before your scheduled appointment.
                  Bring a valid ID and any relevant medical records.
                </p>
              </div>
            </motion.div>)}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="rounded-xl px-4 sm:px-6 h-10 sm:h-auto text-xs sm:text-base">
              <ChevronLeft className="w-4 h-4 mr-1 sm:mr-2" />
              Previous
            </Button>
            {currentStep < 4 ? (<Button onClick={nextStep} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-4 sm:px-6 h-10 sm:h-auto text-xs sm:text-base">
              Next Step
              <ChevronRight className="w-4 h-4 ml-1 sm:ml-2" />
            </Button>) : (<Button onClick={handleSubmit} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-4 sm:px-6 h-10 sm:h-auto text-xs sm:text-base">
              Confirm
              <Check className="w-4 h-4 ml-1 sm:ml-2" />
            </Button>)}
          </div>
        </motion.div>
      </div>
    </section>
    {/* Educational Sections */}
    <section className="py-20 lg:py-32 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24 sm:mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 sm:border-8 border-white">
              <img src={heroHospital} alt="Clinic Interior" className="w-full h-[250px] sm:h-[500px] object-cover" />
              <div className="absolute inset-0 bg-primary/20" />
            </div>
            {/* Floating stats card - Repositioned for mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -right-2 sm:-bottom-8 sm:-right-8 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl z-20 max-w-[180px] sm:max-w-[240px] border border-border"
            >
              <div className="flex items-center gap-2 sm:gap-4 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                </div>
                <span className="font-bold text-foreground text-sm sm:text-base">Secure Portal</span>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">Your medical information is encrypted and handled with clinical precision.</p>
            </motion.div>
          </motion.div>

          <div className="space-y-8 sm:space-y-12">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4">Patient Guide</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4 sm:mb-6 leading-tight text-center lg:text-left">How to Get Started with <span className="text-accent italic">DermaCare</span></h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed text-center lg:text-left">Booking your skin consultation is a seamless journey designed for your comfort and clarity.</p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {[
                { step: "01", title: "Fill the Form", desc: "Provide your basic symptoms and personal details using our intelligent booking interface above." },
                { step: "02", title: "Choose Your Slot", desc: "Select a department and an available time that fits your schedule perfectly." },
                { step: "03", title: "Instant Notification", desc: "Receive an SMS and Email confirmation with your unique appointment reference code." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 sm:gap-6">
                  <span className="text-3xl sm:text-4xl font-display font-black text-accent/20 shrink-0">{item.step}</span>
                  <div>
                    <h4 className="font-bold text-foreground text-base sm:text-lg mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="bg-primary rounded-3xl sm:rounded-[3rem] p-6 lg:p-20 relative overflow-hidden text-white shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h3 className="font-display text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Tracking Your Progress</h3>
              <p className="text-primary-foreground/80 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                Stay updated on your consultation status in real-time. Use the
                <span className="text-accent font-bold"> "Check Your Status"</span> button at the top
                of this page to see if your appointment has been confirmed.
              </p>
              <div className="space-y-3 sm:space-y-4 text-left">
                <div className="flex items-center gap-3 sm:gap-4 bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent flex items-center justify-center text-white shrink-0">
                    <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium">Unique reference tracking for every booking</p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent flex items-center justify-center text-white shrink-0">
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium">Automatic updates as soon as reviews are file</p>
                </div>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <img src={aboutDoctor} alt="Digital Records" className="rounded-xl sm:rounded-3xl shadow-xl w-full h-[200px] sm:h-[340px] object-cover" />
              <div className="absolute -inset-4 bg-accent/20 blur-2xl rounded-full -z-10" />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-32 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">Common Inquiries</h2>
            <p className="text-muted-foreground">Everything you need to know about our appointment process.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: "What should I bring to my first appointment?", a: "Please bring a valid ID, your previous medical records (if any), and a list of skincare products you currently use." },
              { q: "Can I reschedule my booking?", a: "Yes, you can reschedule up to 24 hours before your slot via our contact page or by calling our hotline." },
              { q: "How long is a typical consultation?", a: "Initial consultations usually take 30-45 minutes depending on the complexity of your skin concern." }
            ].map((faq, idx) => (
              <details key={idx} className="group glass-card rounded-2xl border border-border overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                  <h4 className="font-bold text-foreground pr-4">{faq.q}</h4>
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center transition-transform duration-300 group-open:rotate-180">
                    <Plus className="w-5 h-5 text-accent group-open:hidden" />
                    <Minus className="w-5 h-5 text-accent hidden group-open:block" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-muted-foreground text-sm leading-relaxed border-t border-border/50 pt-4 animate-in fade-in slide-in-from-top-1">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  </Layout>);
};
export default Appointment;
