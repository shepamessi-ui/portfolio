import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import profileImg from "@/assets/profile.webp";
import { 
  Linkedin, MapPin, Download, Mail, 
  Code2, BarChart3, Sparkles, 
  GraduationCap, Briefcase, MessageCircle,
  Award, ChevronDown, ExternalLink, CheckCircle2,
  Cpu, Database, TrendingUp, BookOpen, Presentation
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// --- 1. Tech Background Overlay ---
const TechBackground = () => {
  const particles = useMemo(() => 
    [...Array(40)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 10 + 20
    })), []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#020617] overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.1]" 
        style={{ 
          backgroundImage: `
            linear-gradient(to right, #1e293b 1px, transparent 1px),
            linear-gradient(to bottom, #1e293b 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
        }} 
      />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={{ y: [0, -100, 0], opacity: [0, 0.3, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
          className="absolute bg-primary rounded-full blur-[1px]"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
        />
      ))}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/5 rounded-full blur-[120px]" />
    </div>
  );
};

// --- 2. Typewriter Effect ---
const Typewriter = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 1200); 
      return;
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 20 : 50); 
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <span className="text-[#4ade80] font-mono font-bold">
      {words[index].substring(0, subIndex)}
      <span className="animate-pulse ml-1 inline-block w-[2px] h-6 bg-[#4ade80]" />
    </span>
  );
};

// --- 3. Navbar Component ---
const Navbar = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.toLowerCase());
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <span className="font-mono text-primary text-sm tracking-[0.2em] font-bold cursor-default">
          IE.PORTFOLIO
        </span>
        <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest text-slate-400">
          {["About", "Skills", "Projects", "Experience", "Contact"].map((item) => (
            <button 
              key={item} 
              onClick={() => scrollToSection(item)} 
              className="hover:text-primary transition-all duration-300 font-medium relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full" />
            </button>
          ))}
        </div>
        <a href="./Ibrahim_Elshafey_CV.pdf" download className="bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2">
          <Download size={14} /> RESUME
        </a>
      </div>
    </nav>
  );
};

// --- 4. Projects Section ---
const ProjectsSection = () => {
  const projects = [
    {
      title: "Body Performance AI Model",
      description: "A machine learning solution designed to predict and analyze body performance metrics using advanced regression algorithms. Deployed via Streamlit.",
      tech: ["Python", "Scikit-Learn", "Streamlit", "Data Augmentation"],
      link: "https://bqspsjsj5hzumu47qw668j.streamlit.app/",
      category: "AI & ML",
      icon: <Cpu size={28} />,
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Library Management DB System",
      description: "Comprehensive relational database schema for a library system. Designed ER diagrams, refined primary/partial keys, and optimized SQL queries.",
      tech: ["SQL", "Database Design", "ER Diagramming", "Relational Algebra"],
      link: "#",
      category: "Database Engineering",
      icon: <BookOpen size={28} />,
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Cambridge Analytica Data Analysis",
      description: "In-depth case study and presentation on the data scandal. Utilized data ethics analysis to explain complex technical metaphors.",
      tech: ["Data Ethics", "Research", "Visualization", "Data Mining"],
      link: "#",
      category: "Data Research",
      icon: <Presentation size={28} />,
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <section id="projects" className="py-40 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <p className="font-mono text-primary text-[10px] tracking-[0.5em] uppercase mb-4">Portfolio</p>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter italic">Featured Projects</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-slate-900/40 border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-xl transition-all hover:border-primary/30"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent z-10" />
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-6 right-6 z-20 bg-primary/20 text-primary border-primary/30 backdrop-blur-md px-4 py-1">
                  {project.category}
                </Badge>
              </div>

              <div className="p-8 relative z-20 -mt-10">
                <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary mb-6 border border-primary/20 shadow-lg">
                  {project.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-slate-400 font-light leading-relaxed mb-6 text-sm">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.map(t => (
                    <span key={t} className="text-[9px] font-mono text-primary/70 bg-primary/5 px-2 py-1 rounded-md border border-primary/10 uppercase tracking-widest">{t}</span>
                  ))}
                </div>
                <a 
                  href={project.link} 
                  className="w-full justify-center inline-flex items-center gap-2 text-white font-bold text-xs bg-white/5 hover:bg-primary hover:text-primary-foreground px-6 py-3 rounded-xl transition-all"
                >
                  View Project <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- 5. Certificates Section ---
const CertificatesSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const mainLink = "https://www.coursera.org/account/accomplishments/specialization/AXJ0B78I881A";

  const detailedCourses = [
    { id: 1, title: "Foundations: Data, Data, Everywhere", link: mainLink },
    { id: 2, title: "Ask Questions to Make Data-Driven Decisions", link: mainLink },
    { id: 3, title: "Prepare Data for Exploration", link: mainLink },
    { id: 4, title: "Process Data from Dirty to Clean", link: mainLink },
    { id: 5, title: "Analyze Data to Answer Questions", link: mainLink },
    { id: 6, title: "Share Data Through the Art of Visualization", link: mainLink },
    { id: 7, title: "Introduction to Data Analysis Using Python", link: mainLink },
    { id: 8, title: "Google Data Analytics Capstone: Complete a Case Study", link: mainLink },
    { id: 9, title: "Accelerate Your Job Search with AI", link: mainLink },
  ];

  return (
    <section id="certificates" className="py-40 relative z-10">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <p className="font-mono text-primary text-[10px] tracking-[0.5em] uppercase mb-4">Credentials</p>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter italic">Professional Training</h2>
        </div>

        <motion.div layout className="bg-slate-900/40 border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-blue-600/20">G</div>
              <div className="flex-1">
                <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-mono text-xs mb-2 tracking-widest uppercase">
                  <Award size={14} /> Certified Specialist
                </div>
                <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">Google Data Analytics Professional Certificate</h3>
                <p className="text-slate-400 font-light text-lg mb-4">Issued by <span className="text-white font-medium">Google</span> via Coursera</p>
                <a 
                  href={mainLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors text-[10px] font-mono tracking-widest uppercase border border-primary/20 px-4 py-2 rounded-full hover:bg-primary/10"
                >
                  Verify Specialization <ExternalLink size={12} />
                </a>
              </div>
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl transition-all border border-white/5 text-sm font-medium"
              >
                {isOpen ? "Hide Details" : "View Courses"} 
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown size={18} /></motion.div>
              </button>
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="pt-12 mt-12 border-t border-white/5 grid gap-4">
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4 text-center md:text-left">Curriculum Breakdown (9 Courses)</p>
                    {detailedCourses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                        <div className="flex items-center gap-4">
                          <span className="text-primary font-mono text-xs w-6">{course.id}.</span>
                          <span className="text-slate-200 text-sm md:text-base font-light text-left">{course.title}</span>
                        </div>
                        <a href={course.link} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-primary transition-colors p-2">
                           <ExternalLink size={18} />
                        </a>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Index = () => {
  const whatsappNumber = "201068832624"; 
  const linkedinProfile = "https://www.linkedin.com/in/ibrahim-elshafey-01140016540";

  return (
    <div className="min-h-screen bg-[#020617] text-foreground selection:bg-primary/30 overflow-x-hidden relative font-sans">
      <TechBackground />
      <Navbar />
      
      {/* --- Hero Section --- */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-16 z-10">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="mx-auto max-w-4xl rounded-[40px] border border-white/5 bg-slate-950/40 px-6 py-20 text-center shadow-3xl backdrop-blur-2xl relative overflow-hidden">
            <div className="mb-10 relative w-fit mx-auto">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <img src={profileImg} alt="Ibrahim Elshafey" className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover border-2 border-primary/30 p-1.5 relative z-10" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-white">Ibrahim <span className="text-primary">Elshafey</span></h1>
            <div className="text-xl md:text-3xl font-mono mb-10 h-10 tracking-tight">
              <Typewriter words={["Data Analyst", "Power BI Developer", "Python & SQL Expert"]} />
            </div>
            
            <p className="max-w-2xl mx-auto text-slate-400 mb-12 leading-relaxed text-lg md:text-xl font-light">Academic Computer Science student turning raw data into clear decisions — specializing in AI-driven insights and complex database management.</p>

            <div className="flex flex-wrap justify-center gap-5">
              <a href={linkedinProfile} target="_blank" rel="noreferrer" className="bg-primary text-primary-foreground px-10 py-4 rounded-full flex items-center gap-3 transition-all shadow-xl shadow-primary/20 font-bold uppercase tracking-widest text-xs"><Linkedin size={20} /> LinkedIn</a>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="bg-[#25D366] text-white px-10 py-4 rounded-full flex items-center gap-3 transition-all shadow-xl shadow-green-500/20 font-bold uppercase tracking-widest text-xs"><MessageCircle size={20} /> WhatsApp</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- About Me Section --- */}
      <section id="about" className="py-40 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <p className="font-mono text-primary text-[10px] tracking-[0.5em] uppercase mb-4">Discovery</p>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">Who I Am</h2>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto text-center bg-white/[0.01] border border-white/5 p-12 md:p-20 rounded-[40px] backdrop-blur-sm relative">
             <div className="absolute top-10 left-10 text-primary opacity-20"><TrendingUp size={60} /></div>
            <p className="text-slate-400 text-xl md:text-3xl leading-relaxed font-light italic">"Imagine your company's data is a buried gold mine — you just need someone who knows where to dig."</p>
            <p className="mt-10 text-slate-400 text-lg md:text-xl leading-relaxed font-light">
              I'm <span className="text-primary font-bold">Ibrahim Elshafey</span>, an Academic Student focused on <span className="text-white font-medium">Computer Science and Data Analysis</span>. 
              I've built systems ranging from <span className="text-white border-b-2 border-primary/40">Library Management DBs</span> to <span className="text-white border-b-2 border-primary/40">AI Performance Models</span>. 
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- Skills Section --- */}
      <section id="skills" className="py-40 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter uppercase">Arsenal</h2>
            <div className="h-1 w-20 bg-primary mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { 
                title: "PROGRAMMING & ETL", 
                icon: <Code2 size={32} />, 
                desc: "Clean, performant data pipelines and complex queries — specializing in SQL schema design.",
                exp: "Student Expert",
                skills: ["Python", "SQL", "Relational Algebra", "Pandas", "DB Schema"] 
              },
              { 
                title: "VISUALIZATION & BI", 
                icon: <BarChart3 size={32} />, 
                desc: "Dynamic dashboards and interactive storytelling using Tableau and Power BI.",
                exp: "Certified",
                skills: ["Power BI", "Tableau", "Excel Slicers", "DAX"] 
              },
              { 
                title: "STATISTICS & MODELING", 
                icon: <Database size={32} />, 
                desc: "Rigorous quantitative analysis — utilizing sampling distributions and probability theory.",
                exp: "Academic Focus",
                skills: ["SPSS", "Probability Theory", "Linear Regression"] 
              },
              { 
                title: "ADVANCED AI & MINING", 
                icon: <Sparkles size={32} />, 
                desc: "Unlocking hidden patterns — applying GSP algorithms and sequential pattern mining.",
                exp: "Researcher",
                skills: ["Applied AI", "Machine Learning", "Data Mining", "GSP Algorithms"] 
              }
            ].map((category, idx) => (
              <motion.div key={idx} className="p-10 bg-slate-900/40 border border-white/5 rounded-[32px] hover:border-primary/30 transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="text-primary">{category.icon}</div>
                    <span className="text-primary font-mono text-[11px] font-bold tracking-widest bg-primary/10 px-3 py-1 rounded-full">{category.exp}</span>
                  </div>
                  <h3 className="text-xs font-mono text-slate-500 uppercase tracking-[0.3em] mb-4">{category.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8 font-light italic">{category.desc}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map(skill => (
                    <Badge key={skill} className="bg-white/5 text-slate-300 border-white/5 py-2 px-4 rounded-lg font-normal text-[10px] hover:text-primary transition-colors cursor-default">{skill}</Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Projects Section --- */}
      <ProjectsSection />

      {/* --- Experience Section --- */}
      <section id="experience" className="py-40 relative z-10">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-4xl font-bold mb-20 flex items-center gap-6 text-white tracking-tight uppercase"><Briefcase className="text-primary" size={40} /> Professional Journey</h2>
          <div className="border-l-2 border-primary/20 pl-12 relative ml-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative mb-20"
            >
              <div className="absolute -left-[57px] top-2 w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_#4ade80]" />
              <h3 className="text-2xl font-bold text-white mb-2">Junior Data Analyst</h3>
              <p className="text-primary font-mono text-xs mb-6 tracking-widest uppercase">Digital Egypt (DigiLions)</p>
              <p className="text-slate-400 leading-relaxed text-lg font-light">Specializing in data visualization and actionable insights reporting using real-world datasets.</p>
              
              <ul className="mt-6 space-y-3">
                {["Exploratory Data Analysis (EDA)", "Dynamic Dashboard Creation", "SQL Query Optimization"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-500 text-sm">
                    <CheckCircle2 size={16} className="text-primary" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -left-[57px] top-2 w-4 h-4 bg-primary/40 rounded-full" />
              <h3 className="text-2xl font-bold text-white mb-2">Academic Researcher & Presenter</h3>
              <p className="text-primary font-mono text-xs mb-6 tracking-widest uppercase">Academic Projects</p>
              <p className="text-slate-400 leading-relaxed text-lg font-light">Focused on complex data mining algorithms (Apriori, GSP) and critical analysis of data ethics.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Certificates Section --- */}
      <CertificatesSection />

      {/* --- Education Section --- */}
      <section id="education" className="py-40 relative z-10">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-4xl font-bold mb-20 flex items-center gap-6 text-white tracking-tight uppercase"><GraduationCap className="text-primary" size={40} /> Education</h2>
          <div className="grid gap-6">
            <Card className="p-10 bg-white/[0.02] border-white/5 rounded-[32px] hover:bg-white/[0.04] transition-colors group">
              <p className="text-primary font-mono text-xs mb-4 uppercase tracking-[0.3em]">2019 — 2023</p>
              <h3 className="text-3xl font-bold mb-2 text-white italic group-hover:text-primary transition-colors">Bachelor of Commerce</h3>
              <p className="text-slate-400 text-lg font-light">Business Information Systems (BIS) — Tanta University</p>
              <div className="mt-6 flex items-center gap-2 text-slate-500 text-sm">
                 <MapPin size={14} className="text-primary" /> Tanta, Egypt
              </div>
            </Card>
            <Card className="p-10 bg-white/[0.02] border-white/5 rounded-[32px] hover:bg-white/[0.04] transition-colors group">
              <p className="text-primary font-mono text-xs mb-4 uppercase tracking-[0.3em]">Specialized Curriculum</p>
              <h3 className="text-xl font-bold mb-2 text-white italic">Data Science & AI Academic Focus</h3>
              <p className="text-slate-400 text-base font-light">In-depth study of Sequential Patterns, GSP Algorithms, and Healthcare Data Administration.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* --- Footer & Contact --- */}
      <footer id="contact" className="py-24 border-t border-white/5 text-center relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-black text-white/[0.02] pointer-events-none select-none">
          DATA
        </div>
        
        <h2 className="text-4xl md:text-7xl font-bold mb-16 text-white tracking-tighter uppercase relative z-10">Let's build <br/> the <span className="text-primary italic font-serif">future</span>.</h2>
        
        <div className="flex justify-center gap-10 mb-24 relative z-10">
          <a href={linkedinProfile} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-primary transition-all"><Linkedin size={32} /></a>
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-[#25D366] transition-all"><MessageCircle size={32} /></a>
          <a href="mailto:ibrahim.elshafey@gmail.com" className="text-slate-500 hover:text-primary transition-all"><Mail size={32} /></a>
        </div>
        
        <div className="relative z-10 space-y-4">
          <p className="text-slate-400 text-sm font-light">Open for Data Analysis, Research, and SQL Engineering roles.</p>
          <p className="text-slate-600 text-[10px] font-mono tracking-[1em] uppercase">© 2026 IBRAHIM ELSHAFEY</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;