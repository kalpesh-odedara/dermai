import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { FileText, Download, Eye, Calendar, User, Search, Filter, Pill, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
const prescriptions = [
    {
        id: "RX-2025-001",
        doctor: "Dr. Sarah Johnson",
        department: "Cardiology",
        date: "Feb 1, 2025",
        status: "Active",
        medications: [
            { name: "Lisinopril 10mg", dosage: "Once daily", duration: "30 days" },
            { name: "Aspirin 81mg", dosage: "Once daily", duration: "30 days" },
        ],
    },
    {
        id: "RX-2025-002",
        doctor: "Dr. Michael Chen",
        department: "General Medicine",
        date: "Jan 28, 2025",
        status: "Active",
        medications: [
            { name: "Amoxicillin 500mg", dosage: "Three times daily", duration: "7 days" },
        ],
    },
    {
        id: "RX-2024-098",
        doctor: "Dr. Emily Brown",
        department: "Orthopedics",
        date: "Dec 15, 2024",
        status: "Completed",
        medications: [
            { name: "Ibuprofen 400mg", dosage: "Twice daily", duration: "14 days" },
            { name: "Calcium + Vitamin D", dosage: "Once daily", duration: "30 days" },
        ],
    },
    {
        id: "RX-2024-087",
        doctor: "Dr. Sarah Johnson",
        department: "Cardiology",
        date: "Nov 20, 2024",
        status: "Completed",
        medications: [
            { name: "Atorvastatin 20mg", dosage: "Once daily at bedtime", duration: "90 days" },
        ],
    },
];
const Prescription = () => {
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const listRef = useRef(null);
    const isInView = useInView(listRef, { once: true, margin: "-50px" });
    const filteredPrescriptions = prescriptions.filter((rx) => rx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rx.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rx.department.toLowerCase().includes(searchTerm.toLowerCase()));
    return (<Layout>
       {/* Hero */}
       <section className="py-16 lg:py-24 bg-gradient-to-b from-navy-light to-background">
         <div className="container mx-auto px-4 lg:px-8">
           <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
             <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
               My Prescriptions
             </span>
             <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
               Digital <span className="text-accent">Prescriptions</span>
             </h1>
             <p className="text-muted-foreground text-lg">
               Access and manage all your prescriptions in one secure place
             </p>
           </motion.div>
         </div>
       </section>
 
       {/* Security Banner */}
       <section className="border-b border-border bg-card">
         <div className="container mx-auto px-4 lg:px-8 py-4">
           <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
             <Shield className="w-4 h-4 text-success"/>
             <span>Your prescription data is encrypted and HIPAA compliant</span>
           </div>
         </div>
       </section>
 
       {/* Dashboard */}
       <section className="py-16 lg:py-24">
         <div className="container mx-auto px-4 lg:px-8">
           {/* Search & Filter */}
           <div className="flex flex-col sm:flex-row gap-4 mb-8">
             <div className="relative flex-1">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
               <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search prescriptions..." className="pl-12 rounded-xl py-6"/>
             </div>
             <Button variant="outline" className="rounded-xl px-6">
               <Filter className="w-4 h-4 mr-2"/>
               Filter
             </Button>
           </div>
 
           {/* Prescriptions List */}
           <div ref={listRef} className="space-y-4">
             {filteredPrescriptions.map((rx, index) => (<motion.div key={rx.id} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: index * 0.1 }} className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/50 hover:shadow-lg transition-all duration-300">
                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                   <div className="flex items-start gap-4">
                     <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                       <FileText className="w-6 h-6 text-accent"/>
                     </div>
                     <div>
                       <div className="flex items-center gap-3 mb-1">
                         <h3 className="font-display font-semibold text-lg text-foreground">
                           {rx.id}
                         </h3>
                         <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${rx.status === "Active"
                ? "bg-success/10 text-success"
                : "bg-muted text-muted-foreground"}`}>
                           {rx.status}
                         </span>
                       </div>
                       <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                         <span className="flex items-center gap-1">
                           <User className="w-4 h-4"/>
                           {rx.doctor}
                         </span>
                         <span className="flex items-center gap-1">
                           <Pill className="w-4 h-4"/>
                           {rx.department}
                         </span>
                         <span className="flex items-center gap-1">
                           <Calendar className="w-4 h-4"/>
                           {rx.date}
                         </span>
                       </div>
                     </div>
                   </div>
 
                   <div className="flex items-center gap-3">
                     <Button variant="outline" size="sm" onClick={() => setSelectedPrescription(rx)} className="rounded-lg">
                       <Eye className="w-4 h-4 mr-2"/>
                       View
                     </Button>
                     <Button variant="outline" size="sm" className="rounded-lg">
                       <Download className="w-4 h-4 mr-2"/>
                       Download
                     </Button>
                   </div>
                 </div>
               </motion.div>))}
           </div>
 
           {filteredPrescriptions.length === 0 && (<div className="text-center py-16">
               <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4"/>
               <h3 className="text-xl font-semibold text-foreground mb-2">No prescriptions found</h3>
               <p className="text-muted-foreground">Try adjusting your search terms</p>
             </div>)}
         </div>
       </section>
 
       {/* Prescription Detail Modal */}
       <Dialog open={!!selectedPrescription} onOpenChange={() => setSelectedPrescription(null)}>
         <DialogContent className="max-w-lg rounded-3xl">
           <DialogHeader>
             <DialogTitle className="font-display text-2xl">
               Prescription Details
             </DialogTitle>
           </DialogHeader>
           {selectedPrescription && (<div className="space-y-6">
               <div className="p-4 rounded-xl bg-muted">
                 <div className="grid grid-cols-2 gap-4 text-sm">
                   <div>
                     <span className="text-muted-foreground">Prescription ID</span>
                     <p className="font-medium text-foreground">{selectedPrescription.id}</p>
                   </div>
                   <div>
                     <span className="text-muted-foreground">Date</span>
                     <p className="font-medium text-foreground">{selectedPrescription.date}</p>
                   </div>
                   <div>
                     <span className="text-muted-foreground">Doctor</span>
                     <p className="font-medium text-foreground">{selectedPrescription.doctor}</p>
                   </div>
                   <div>
                     <span className="text-muted-foreground">Department</span>
                     <p className="font-medium text-foreground">{selectedPrescription.department}</p>
                   </div>
                 </div>
               </div>
 
               <div>
                 <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                   <Pill className="w-5 h-5 text-accent"/>
                   Medications
                 </h4>
                 <div className="space-y-3">
                   {selectedPrescription.medications.map((med, i) => (<motion.div key={med.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="p-4 rounded-xl border border-border">
                       <p className="font-medium text-foreground">{med.name}</p>
                       <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                         <span className="flex items-center gap-1">
                           <Clock className="w-4 h-4"/>
                           {med.dosage}
                         </span>
                         <span>•</span>
                         <span>{med.duration}</span>
                       </div>
                     </motion.div>))}
                 </div>
               </div>
 
               <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl">
                 <Download className="w-4 h-4 mr-2"/>
                 Download PDF
               </Button>
             </div>)}
         </DialogContent>
       </Dialog>
     </Layout>);
};
export default Prescription;
