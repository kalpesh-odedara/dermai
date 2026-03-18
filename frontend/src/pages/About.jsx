import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Award, Users, Heart, Target, CheckCircle } from "lucide-react";
import aboutDoctor from "@/assets/about-doctor.jpg";
import aboutTeam from "@/assets/about-team.jpg";
const values = [
  { icon: Heart, title: "Compassion", description: "We treat every patient with empathy and understanding" },
  { icon: Award, title: "Excellence", description: "Committed to the highest standards of medical care" },
  { icon: Users, title: "Teamwork", description: "Collaborative approach for comprehensive care" },
  { icon: Target, title: "Innovation", description: "Embracing cutting-edge medical technologies" },
];
const About = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const missionRef = useRef(null);
  const valuesRef = useRef(null);
  const missionInView = useInView(missionRef, { once: true, margin: "-100px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  return (<Layout>
    {/* Hero Section */}
    <section className="py-20 lg:py-32 bg-gradient-to-b from-cyan-light to-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            About DermaCare
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Reveal Your <span className="text-accent">Natural Radiance</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            For over 25 years, we've been the trusted choice for advanced dermatological care,
            combining medical expertise with aesthetic artistry.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Parallax Images Section */}
    <section ref={containerRef} className="py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Images */}
          <div className="relative h-[500px] lg:h-[600px]">
            <motion.div style={{ y: y1 }} className="absolute top-0 left-0 w-3/4 h-3/4 rounded-3xl overflow-hidden shadow-2xl">
              <img src={aboutDoctor} alt="Doctor consulting patient" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div style={{ y: y2 }} className="absolute bottom-0 right-0 w-2/3 h-2/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-card">
              <img src={aboutTeam} alt="Medical team meeting" className="w-full h-full object-cover" />
            </motion.div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-2xl bg-accent flex items-center justify-center text-center p-4">
              <div>
                <span className="font-display text-3xl font-bold text-accent-foreground">25+</span>
                <p className="text-accent-foreground/80 text-sm">Years of Excellence</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div ref={missionRef}>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={missionInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
              <span className="inline-block px-4 py-2 rounded-full bg-navy-light text-primary text-sm font-medium mb-6">
                Our Story
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                A Legacy of Beauty & Health
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Founded in 1999, DermaCare has grown from a specialized skin clinic to a
                comprehensive dermatology center serving thousands of patients annually. Our
                commitment to skin health has never wavered.
              </p>
              <p className="text-muted-foreground text-lg mb-8">
                Today, we're proud to offer state-of-the-art laser technology, advanced
                skincare treatments, and a team of dedicated dermatologists.
              </p>

              <div className="space-y-4">
                {["Board-certified physicians", "24/7 Emergency care", "Advanced diagnostics", "Patient-centered approach"].map((item, i) => (<motion.div key={item} initial={{ opacity: 0, x: 20 }} animate={missionInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-foreground">{item}</span>
                </motion.div>))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>

    {/* Values Section */}
    <section ref={valuesRef} className="py-20 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={valuesInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Our Core Values
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            What Drives Us Forward
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (<motion.div key={value.title} initial={{ opacity: 0, y: 30 }} animate={valuesInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }} className="text-center p-8 rounded-2xl bg-card border border-border hover:border-accent/50 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <value.icon className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-display font-semibold text-xl text-foreground mb-3">
              {value.title}
            </h3>
            <p className="text-muted-foreground">
              {value.description}
            </p>
          </motion.div>))}
        </div>
      </div>
    </section>
  </Layout>);
};
export default About;
