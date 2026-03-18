import { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import {
  FileText, Download, Eye, Calendar, User, Search, Filter, Pill,
  Shield, Clock, Upload, Sparkles, AlertTriangle, Loader2,
  X, Camera, ChevronRight, CheckCircle2, Info, HeartPulse
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const prescriptions = [
  {
    id: "RX-2025-001",
    doctor: "Dr. Sarah Johnson",
    department: "Dermatology",
    date: "Feb 1, 2025",
    status: "Active",
    medications: [
      { name: "Tretinoin 0.05%", dosage: "Apply at night", duration: "90 days" },
      { name: "CeraVe Moisturizer", dosage: "Twice daily", duration: "Continuous" },
    ],
  },
  {
    id: "RX-2025-002",
    doctor: "Dr. Michael Chen",
    department: "Dermatology",
    date: "Jan 28, 2025",
    status: "Active",
    medications: [
      { name: "Ketoconazole 2%", dosage: "Apply to affected area", duration: "14 days" },
    ],
  },
  {
    id: "RX-2024-098",
    doctor: "Dr. Emily Brown",
    department: "Dermatology",
    date: "Dec 15, 2024",
    status: "Completed",
    medications: [
      { name: "Doxycycline 100mg", dosage: "Once daily", duration: "30 days" },
    ],
  },
];

const Prescription = () => {
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPreview = () => {
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const analyzeSkin = async () => {
    if (!previewImage) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch("http://localhost:5000/api/analyze-skin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: previewImage })
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisResult(data);
        toast.success("Analysis complete!");

        // Store in Admin Panel / Database
        try {
          await fetch("http://localhost:5000/api/prescriptions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              patientName: localStorage.getItem('userName') || "Guest Patient",
              problemName: data.condition,
              medication: data.description,
              carePlan: data.prescription,
              accuracy: data.disclaimer.match(/Accuracy: (\d+\.\d+)%/)?.[1] + "%" || "N/A"
            })
          });
        } catch (saveError) {
          console.error("Failed to store prescription:", saveError);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.details || errorData.error || "Failed to analyze image";
        toast.error(errorMessage, {
          description: errorData.suggestion || "Please try again later."
        });
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Connection error. Check if backend is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = () => {
    if (!analysisResult) return;

    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    const reportId = `GEN-RX-${Math.floor(Math.random() * 9000) + 1000}`;

    // PDF Styling & Header
    doc.setFillColor(79, 70, 229); // Accent color (Indigo)
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("DERMACARE AI - DIAGNOSTIC REPORT", 20, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Reference: ${reportId}`, 160, 20);
    doc.text(`Date: ${timestamp}`, 160, 28);

    // Context Info
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("ASSESSMENT DETAILS", 20, 55);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 58, 190, 58);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Assessment:", 20, 70);
    doc.setFont("helvetica", "normal");
    doc.text(analysisResult.condition.replace('Assessment :- ', ''), 50, 70);

    doc.setFont("helvetica", "bold");
    doc.text("Medicine:", 20, 80);
    doc.setFont("helvetica", "normal");
    const meds = analysisResult.description.replace('Related medicine :- ', '');
    const splitMeds = doc.splitTextToSize(meds, 140);
    doc.text(splitMeds, 50, 80);

    let nextY = 80 + (splitMeds.length * 7);

    doc.setFont("helvetica", "bold");
    doc.text("Care Plan:", 20, nextY);
    doc.setFont("helvetica", "normal");
    const plan = analysisResult.prescription.replace('Care Plan :- ', '');
    const splitPlan = doc.splitTextToSize(plan, 140);
    doc.text(splitPlan, 50, nextY);

    nextY += (splitPlan.length * 7) + 10;

    // Disclaimer Section
    doc.setFillColor(248, 250, 252);
    doc.rect(20, nextY, 170, 30, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(20, nextY, 170, 30, 'D');

    doc.setTextColor(220, 38, 38);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("MEDICAL DISCLAIMER:", 25, nextY + 10);

    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    const disclaimer = analysisResult.disclaimer;
    const splitDisclaimer = doc.splitTextToSize(disclaimer, 160);
    doc.text(splitDisclaimer, 25, nextY + 18);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated by DermaCare AI Diagnostics System. This is an automated assessment.", 60, 285);

    doc.save(`${reportId}-Diagnostic-Report.pdf`);
    toast.success("Prescription report downloaded!");
  };

  const filteredPrescriptions = prescriptions.filter((rx) =>
    rx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rx.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rx.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-slate-50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 rounded-full bg-white shadow-sm text-accent border-accent/20">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              AI-Powered Dermatology Assistant
            </Badge>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Diagnostic <span className="text-accent italic">Care</span>
            </h1>
            <p className="text-slate-600 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Upload a clear photo of your skin concern for an instant AI-powered preliminary analysis and suggested care plan.
            </p>

            {/* Upload Area */}
            <Card className="border-2 border-dashed border-slate-200 bg-white/80 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-accent/40 shadow-xl shadow-slate-200/50">
              <CardContent className="p-8 md:p-12">
                {!previewImage ? (
                  <div
                    className="flex flex-col items-center justify-center cursor-pointer space-y-4"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center text-accent transition-transform duration-300 hover:scale-110">
                      <Camera className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-semibold text-slate-900">Click to upload or drag & drop</p>
                      <p className="text-slate-500">Supports JPG, PNG up to 5MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative max-w-md mx-auto">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white"
                    >
                      <img src={previewImage} alt="Preview" className="w-full h-64 object-cover" />
                      {!isAnalyzing && (
                        <button
                          onClick={clearPreview}
                          className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </motion.div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={analyzeSkin}
                        disabled={isAnalyzing}
                        className="bg-accent hover:bg-accent/90 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-accent/20 flex-1"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                            Running Diagnostics...
                          </>
                        ) : (
                          <>
                            <Search className="w-5 h-5 mr-2" />
                            Start Analysis
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={clearPreview}
                        disabled={isAnalyzing}
                        className="h-12 px-8 rounded-xl border-slate-200 flex-1 sm:flex-none"
                      >
                        Change Photo
                      </Button>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
              </CardContent>
            </Card>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                Secure & Encrypted
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                HIPAA Compliant
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Prescription History</h2>
              <p className="text-slate-500">Manage and download your official digital prescriptions</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative group flex-1 sm:flex-none sm:min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent transition-colors" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by ID or Doctor..."
                  className="pl-11 rounded-xl border-slate-200 bg-slate-50 h-12 focus:bg-white transition-all"
                />
              </div>
              <Button variant="outline" className="rounded-xl h-12 border-slate-200 bg-slate-50 hover:bg-white transition-all">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Prescriptions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredPrescriptions.map((rx) => (
                <motion.div
                  key={rx.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-accent/20 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-accent/10 flex items-center justify-center text-slate-400 group-hover:text-accent transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                    <Badge className={rx.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"}>
                      {rx.status}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">{rx.id}</h3>
                      <p className="text-slate-500 text-sm flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {rx.date}
                      </p>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">
                          {rx.doctor.split(' ').pop().charAt(0)}
                        </div>
                        <div className="text-sm">
                          <p className="font-semibold text-slate-800">{rx.doctor}</p>
                          <p className="text-xs text-slate-400">{rx.department}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedPrescription(rx)}
                        className="w-full rounded-xl bg-slate-50 hover:bg-accent hover:text-white transition-all group/btn"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredPrescriptions.length === 0 && (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No prescriptions found</h3>
              <p className="text-slate-500 max-w-xs mx-auto">We couldn't find any results matching your search terms.</p>
            </div>
          )}
        </div>
      </section>

      {/* Prescription Detail Modal */}
      <Dialog open={!!selectedPrescription} onOpenChange={() => setSelectedPrescription(null)}>
        <DialogContent className="max-w-2xl rounded-[2rem] p-0 overflow-hidden border-none shadow-3xl bg-white text-slate-900">
          {selectedPrescription && (
            <div className="relative">
              <div className="bg-slate-900 p-8 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Prescription Invoice</h2>
                    <p className="text-slate-400 text-sm">{selectedPrescription.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-accent">{selectedPrescription.date}</p>
                    <Badge className="bg-accent/20 text-accent border-none">{selectedPrescription.status}</Badge>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Medical Professional</h4>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 font-bold">
                        {selectedPrescription.doctor.split(' ').pop().charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{selectedPrescription.doctor}</p>
                        <p className="text-sm text-slate-500">{selectedPrescription.department}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Digital Verification</h4>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
                      <Shield className="w-6 h-6 text-emerald-500" />
                      <div className="text-xs leading-tight">
                        <p className="font-bold text-emerald-700 mb-0.5">Verified Script</p>
                        <p className="text-emerald-600/70">Cryptographically signed by DermaCare</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Medications & Dosage</h4>
                  <div className="space-y-3">
                    {selectedPrescription.medications.map((med, i) => (
                      <div key={i} className="group p-5 rounded-2xl border border-slate-100 bg-slate-50/50 transition-all hover:bg-white hover:border-accent/10 hover:shadow-xl hover:shadow-slate-200/50">
                        <div className="flex justify-between items-start mb-3">
                          <p className="font-bold text-slate-900 flex items-center gap-2">
                            <i className="w-2 h-2 rounded-full bg-accent" />
                            {med.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <span className="flex items-center gap-2 text-slate-600 font-medium bg-white px-3 py-1.5 rounded-lg shadow-sm">
                            <Clock className="w-3.5 h-3.5 text-accent" />
                            {med.dosage}
                          </span>
                          <span className="text-slate-400 font-medium">
                            Duration: <span className="text-slate-700">{med.duration}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button variant="outline" onClick={() => setSelectedPrescription(null)} className="flex-1 h-14 rounded-2xl font-bold border-slate-200 hover:bg-slate-50">
                    Close Record View
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* AI Analysis Result Modal - Medical Report Style */}
      <Dialog open={!!analysisResult} onOpenChange={() => setAnalysisResult(null)}>
        <DialogContent className="max-w-3xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-4xl bg-white max-h-[90vh] flex flex-col">
          <div className="bg-accent p-8 text-white shrink-0 relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.25rem] bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight">Diagnostic Analysis</h2>
                  <p className="text-white/80 font-medium">Dermatology Assessment Report</p>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end text-sm">
                <span className="bg-white/20 px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px] mb-2">Powered by AI Vision</span>
                <span className="text-white/60">Reference: GEN-RX-{Math.floor(Math.random() * 9000) + 1000}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
            {analysisResult && (
              <>
                {/* Diagnostic Results */}
                <section className="space-y-6">
                  {/* Problem Name */}
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-accent shrink-0">
                      <Search className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Assessment</h4>
                      <p className="text-xl font-bold text-slate-900">{analysisResult.condition}</p>
                    </div>
                  </div>

                  {/* Related Medicine */}
                  <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100 flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-500 shrink-0">
                      <Pill className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-emerald-600/60 uppercase tracking-widest mb-1">Safe Recommendations</h4>
                      <p className="text-lg font-semibold text-emerald-900">{analysisResult.description}</p>
                    </div>
                  </div>

                  {/* Care Plan */}
                  <div className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100 flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-500 shrink-0">
                      <HeartPulse className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-indigo-600/60 uppercase tracking-widest mb-1">Doctor's Care Plan</h4>
                      <p className="text-slate-700 leading-relaxed font-medium">{analysisResult.prescription}</p>
                    </div>
                  </div>

                  {/* Product Recommendations */}
                  {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Recommended Products from Catalog</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {analysisResult.recommendations.map((prod, idx) => (
                          <a
                            key={idx}
                            href={prod.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-accent/30 transition-all group"
                          >
                            <p className="text-xs font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-accent">{prod.name}</p>
                            <p className="text-accent font-bold text-sm">{prod.price}</p>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* Disclaimer */}
                <section className="bg-rose-50 rounded-3xl p-6 border border-rose-100 flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-rose-900 uppercase text-xs tracking-widest">Crucial Medical Disclaimer</h4>
                    <p className="text-rose-700/80 leading-relaxed font-medium">
                      {analysisResult.disclaimer}
                    </p>
                  </div>
                </section>
              </>
            )}
          </div>

          <div className="p-8 pt-0 flex gap-4 shrink-0">
            <Button
              variant="outline"
              onClick={() => setAnalysisResult(null)}
              className="flex-1 h-14 rounded-2xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Close Assessment
            </Button>
            <Button
              onClick={downloadReport}
              className="flex-[2] h-14 rounded-2xl bg-accent hover:bg-accent/90 text-white font-bold text-lg shadow-2xl shadow-accent/20"
            >
              <Download className="w-5 h-5 mr-3" />
              Download Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Prescription;
