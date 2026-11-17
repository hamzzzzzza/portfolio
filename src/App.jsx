import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useInView } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code2, 
  User, 
  Briefcase, 
  Send, 
  Download, 
  ChevronRight,
  Phone,
  MapPin,
  Cpu,
  Globe,
  Sparkles,
  MessageSquare,
  Bot,
  X,
  Loader2
} from 'lucide-react';

// --- Gemini API Configuration ---
const apiKey = ""; // Provided at runtime
const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";

const fetchWithRetry = async (url, options, retries = 5, backoff = 1000) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
};

// --- Configuration & Data ---
const DEVELOPER_INFO = {
  name: "Mohammed Hamza KF",
  title: "Frontend Developer | Future Full Stack Engineer",
  location: "Chennai, India",
  email: "mohammedhamzakf06@gmail.com",
  phone: "7871354994",
  github: "https://github.com/hamzzzzzza",
  linkedin: "https://www.linkedin.com/in/kf-mohammad-hamza-0b978b366",
  portfolio: "hamzakf.in",
  about: "I am a passionate Frontend Developer currently pursuing a BSc in AI & ML at SRM IST. My focus lies in bridging the gap between sophisticated artificial intelligence and intuitive user interfaces. I specialize in building high-performance, responsive web applications with a keen eye for modern UI/UX design. My goal is to evolve into a Full Stack Engineer capable of deploying end-to-end intelligent systems."
};

const PROJECTS = [
  {
    title: "FAZZH RESTAURANT",
    description: "A premium responsive restaurant landing page featuring smooth scrolling, interactive menus, and elegant UI transitions.",
    link: "https://fazzh-rest.netlify.app",
    github: "#",
    tags: ["React", "Tailwind", "Framer Motion"],
    image: "/project_restaurant.png"
  },
  {
    title: "ASPIRASYS-1",
    description: "A corporate-grade professional business layout optimized for performance and clean information architecture.",
    link: "https://aspirasys-1.netlify.app",
    github: "#",
    tags: ["Frontend", "UI/UX", "Responsive"],
    image: "/project_corporate.png"
  },
  {
    title: "TIME ZONE WATCH",
    description: "An interactive dynamic application showcasing real-time data handling and specialized UI components for time-tracking.",
    link: "https://timezone-watch.netlify.app",
    github: "#",
    tags: ["JavaScript", "Real-time", "API"],
    image: "/project_timezone.png"
  }
];

const SKILLS = [
  { name: "HTML5", level: 95 },
  { name: "CSS3 / Tailwind", level: 90 },
  { name: "JavaScript (ES6+)", level: 85 },
  { name: "React.js", level: 80 },
  { name: "JSX / Logic", level: 82 },
  { name: "UI/UX Design", level: 75 }
];

const EXPERIENCE = [
  {
    role: "Frontend Developer Intern",
    company: "Aspirasys",
    duration: "4–6 months",
    tasks: [
      "Built responsive UI components using modern frameworks",
      "Developed real-time website features for client projects",
      "Improved overall user experience by optimizing rendering paths",
      "Collaborated with cross-functional teams using Git/GitHub"
    ]
  }
];

const EDUCATION = [
  {
    degree: "BSc (Artificial Intelligence & Machine Learning)",
    institution: "SRM Institute of Science and Technology – Ramapuram",
    period: "2025 – 2028"
  }
];

// --- Shared Components ---

const GlassCard = ({ children, className = "" }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl ${className}`}
  >
    {children}
  </motion.div>
);

const SectionHeading = ({ title, subtitle }) => (
  <div className="mb-12">
    <motion.h2 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="text-4xl font-bold text-white mb-2"
    >
      {title}
    </motion.h2>
    <div className="h-1.5 w-20 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full" />
    {subtitle && <p className="text-slate-400 mt-4 max-w-2xl">{subtitle}</p>}
  </div>
);

// --- Gemini-Powered Components ---

const AIProjectConsultant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConsult = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResponse("");

    const systemPrompt = `You are an AI Technical Consultant representing Mohammed Hamza KF, a Frontend Developer and BSc AI/ML student. 
    Hamza's skills: ${SKILLS.map(s => s.name).join(", ")}. 
    His background: Pursuing AI/ML at SRM IST, worked as Intern at Aspirasys.
    User will describe a project idea. You must:
    1. Analyze the project.
    2. Suggest a tech stack that Hamza can work with (React, Tailwind, AI integration).
    3. Explain how Hamza's AI/ML knowledge adds value to this specific project.
    Keep the tone professional, creative, and enthusiastic. Use bullet points.`;

    try {
      const data = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        }
      );
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setResponse(text || "No response generated.");
    } catch (err) {
      setError("The AI is taking a quick break. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] group"
      >
        <Sparkles className="text-white w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-900 border border-white/10 px-3 py-1 rounded-lg text-xs font-bold text-cyan-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Project Consultant ✨
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-[#020617] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative z-10"
            >
              <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-transparent border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg"><Bot className="text-cyan-400 w-5 h-5" /></div>
                  <h3 className="text-xl font-bold text-white tracking-tight">AI Project Consultant ✨</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X size={20}/></button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {!response && !loading && (
                  <div className="text-center py-8">
                    <p className="text-slate-400 mb-6 italic text-sm">"Describe your project idea, and I'll architect a solution using Hamza's expertise."</p>
                    <textarea 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="e.g., I want to build a real estate platform with AI-driven pricing predictions..."
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-[120px]"
                    />
                  </div>
                )}

                {loading && (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                    <p className="text-cyan-400 animate-pulse font-mono text-xs uppercase tracking-widest">Architecting Solution...</p>
                  </div>
                )}

                {response && (
                  <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                    <div className="p-4 bg-cyan-500/5 border-l-4 border-cyan-500 rounded-r-lg mb-4 italic">
                      Consultant's insight based on Hamza's profile:
                    </div>
                    {response.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                    <button 
                      onClick={() => {setResponse(""); setInput("");}}
                      className="mt-6 text-xs text-cyan-500 font-bold uppercase tracking-widest hover:text-cyan-400 transition-colors"
                    >
                      New Consultation +
                    </button>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}
              </div>

              {!response && !loading && (
                <div className="p-6 pt-0">
                  <button 
                    onClick={handleConsult}
                    className="w-full py-4 bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Generate Proposal ✨</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const SmartSummary = () => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePitch = async (industry) => {
    setLoading(true);
    setSummary("");
    const prompt = `Based on this bio: "${DEVELOPER_INFO.about}", generate a 2-sentence highly professional and creative elevator pitch for the ${industry} industry. Focus on the intersection of AI and Frontend.`;

    try {
      const data = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      setSummary(data.candidates?.[0]?.content?.parts?.[0]?.text || "");
    } catch (e) {
      setSummary("Failed to generate pitch. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Generate Industry Pitch ✨</p>
      <div className="flex flex-wrap gap-2">
        {['FinTech', 'SaaS', 'E-commerce', 'HealthTech'].map(ind => (
          <button 
            key={ind}
            onClick={() => generatePitch(ind)}
            disabled={loading}
            className="px-3 py-1 text-[10px] border border-cyan-500/30 text-cyan-400 rounded-full hover:bg-cyan-500/10 transition-colors disabled:opacity-50"
          >
            {ind}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2 text-cyan-500">
            <Loader2 size={12} className="animate-spin" />
            <span className="text-[10px] uppercase font-mono tracking-tighter">AI Crafting...</span>
          </motion.div>
        ) : summary && (
          <motion.div 
            key="summary" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl text-xs text-slate-300 leading-relaxed italic"
          >
            "{summary.trim()}"
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Standard UI Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-4 bg-[#020617]/80 backdrop-blur-xl border-b border-white/10' : 'py-6 bg-transparent'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
        >
          HKF.
        </motion.div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
          {['About', 'Skills', 'Projects', 'Experience', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-cyan-400 transition-colors">
              {item}
            </a>
          ))}
        </div>
        <a
          href="/resume.pdf"
          download="Hamza_Resume.pdf"
          className="px-5 py-2 rounded-full border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all text-sm font-semibold"
        >
          Resume
        </a>
      </div>
    </nav>
  );
};

const SkillItem = ({ skill }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="mb-6" ref={ref}>
      <div className="flex justify-between mb-2">
        <span className="text-slate-200 font-medium">{skill.name}</span>
        <span className="text-cyan-400">{skill.level}%</span>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600"
        />
      </div>
    </div>
  );
};

const Hero = () => {
  const words = ["Frontend Developer", "AI & ML Student", "Future Full Stack Engineer"];
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setReverse(true);
      return;
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold tracking-wide"
          >
            Available for Freelance
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Hi, I'm <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
              {DEVELOPER_INFO.name}
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-8 min-h-[1.5em] font-mono">
            {words[index].substring(0, subIndex)}
            <span className="animate-pulse text-cyan-500">|</span>
          </p>
          <div className="flex flex-wrap gap-4">
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all flex items-center"
            >
              View Projects <ChevronRight className="ml-2 w-5 h-5" />
            </motion.a>
            <motion.a
              href="/resume.pdf"
              download="Hamza_Resume.pdf"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all flex items-center"
            >
              <Download className="mr-2 w-5 h-5" /> Resume
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative justify-self-center lg:justify-self-end"
        >
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden border-2 border-white/10 bg-slate-900 relative group">
             <img src="/profile.png" alt="Mohammed Hamza KF" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
          </div>
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -bottom-6 -left-6 bg-slate-900/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-cyan-500/20 p-2 rounded-lg"><Cpu className="text-cyan-400 w-6 h-6" /></div>
              <div>
                <p className="text-xs text-slate-400">Pursuing</p>
                <p className="text-sm font-bold text-white">BSc AI & ML</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const ExperienceTimeline = () => (
  <section id="experience" className="py-24 bg-[#03081a]">
    <div className="container mx-auto px-6">
      <SectionHeading title="My Experience" subtitle="A timeline of my professional growth and educational background." />
      <div className="relative max-w-4xl mx-auto">
        <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-blue-500 to-transparent rounded-full" />
        
        <div className="mb-16 relative">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-1 md:text-right md:pr-12 mb-4 md:mb-0">
              <motion.div 
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -50 }}
                className="inline-block p-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl"
              >
                <div className="bg-[#020617] rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white">{EXPERIENCE[0].role}</h3>
                  <p className="text-cyan-400 font-medium mb-4">{EXPERIENCE[0].company} • {EXPERIENCE[0].duration}</p>
                  <ul className="text-slate-400 text-sm space-y-2">
                    {EXPERIENCE[0].tasks.map((task, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-cyan-500 mr-2">•</span> {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
            <div className="z-10 absolute left-0 md:left-1/2 transform -translate-x-1/2 w-8 h-8 bg-cyan-500 border-4 border-[#020617] rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
            <div className="flex-1 md:pl-12 hidden md:block" />
          </div>
        </div>

        <div className="relative">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-1 md:pr-12 hidden md:block" />
            <div className="z-10 absolute left-0 md:left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-500 border-4 border-[#020617] rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            <div className="flex-1 md:pl-12">
              <motion.div 
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: 50 }}
                className="bg-white/[0.03] border border-white/10 p-6 rounded-xl backdrop-blur-md"
              >
                <h3 className="text-xl font-bold text-white">{EDUCATION[0].degree}</h3>
                <p className="text-blue-400 font-medium">{EDUCATION[0].institution}</p>
                <div className="flex justify-between mt-4">
                  <span className="text-slate-500 text-sm">{EDUCATION[0].period}</span>
                  <span className="text-emerald-400 font-bold">{EDUCATION[0].score}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const App = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStatus("Message sent successfully! I'll get back to you soon.");
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(null), 5000);
    }, 1500);
  };

  return (
    <div className="bg-[#020617] text-slate-300 min-h-screen font-sans selection:bg-cyan-500/30 selection:text-cyan-300 scroll-smooth">
      <Navbar />
      <AIProjectConsultant />

      <div className="fixed left-6 bottom-0 z-40 hidden lg:flex flex-col items-center space-y-6 after:content-[''] after:w-px after:h-24 after:bg-white/20 after:mt-6">
        <motion.a whileHover={{ y: -3, color: '#06b6d4' }} href={DEVELOPER_INFO.github} target="_blank" className="text-slate-400 transition-colors"><Github size={20} /></motion.a>
        <motion.a whileHover={{ y: -3, color: '#06b6d4' }} href={DEVELOPER_INFO.linkedin} target="_blank" className="text-slate-400 transition-colors"><Linkedin size={20} /></motion.a>
        <motion.a whileHover={{ y: -3, color: '#06b6d4' }} href={`mailto:${DEVELOPER_INFO.email}`} className="text-slate-400 transition-colors"><Mail size={20} /></motion.a>
      </div>

      <Hero />

      <section id="about" className="py-24 container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}>
            <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur-2xl opacity-10" />
                <GlassCard className="relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><User size={120} /></div>
                    <SectionHeading title="About Me" />
                    <p className="text-lg leading-relaxed text-slate-400 mb-6">{DEVELOPER_INFO.about}</p>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <h4 className="text-blue-500 font-bold text-xl">Chennai</h4>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Base Location</p>
                        </div>
                    </div>
                    {/* Gemini Feature 2 */}
                    <SmartSummary />
                </GlassCard>
            </div>
          </motion.div>

          <div id="skills">
            <SectionHeading title="Core Skills" subtitle="Technologies I work with to bring digital visions to life." />
            <div className="grid gap-2">
              {SKILLS.map((skill, index) => (
                <SkillItem key={index} skill={skill} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="py-24 bg-slate-900/10">
        <div className="container mx-auto px-6">
          <SectionHeading title="Featured Projects" subtitle="A selection of my best work in web development." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.map((project, idx) => (
              <GlassCard key={idx} className="flex flex-col h-full group">
                <div className="h-48 mb-6 bg-slate-900 rounded-xl relative overflow-hidden group-hover:border-cyan-500/30 border border-transparent transition-colors">
                    <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                <p className="text-slate-400 text-sm mb-6 flex-grow">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white/5 rounded text-[10px] uppercase font-bold text-slate-500 border border-white/5">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center space-x-4">
                  <a href={project.link} target="_blank" className="flex items-center text-sm font-bold text-white hover:text-cyan-400 transition-colors"><ExternalLink size={16} className="mr-1" /> Live Demo</a>
                  <a href={project.github} target="_blank" className="flex items-center text-sm font-bold text-white hover:text-blue-400 transition-colors"><Github size={16} className="mr-1" /> GitHub</a>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <ExperienceTimeline />

      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeading title="Get In Touch" subtitle="Let's build something amazing together." />
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-6">
              <GlassCard>
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-cyan-500/10 p-3 rounded-lg text-cyan-500"><Mail size={24} /></div>
                    <div><p className="text-xs text-slate-500 uppercase font-bold">Email Me</p><p className="text-white font-medium break-all">{DEVELOPER_INFO.email}</p></div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-500/10 p-3 rounded-lg text-blue-500"><Phone size={24} /></div>
                    <div><p className="text-xs text-slate-500 uppercase font-bold">Call Me</p><p className="text-white font-medium">{DEVELOPER_INFO.phone}</p></div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-indigo-500/10 p-3 rounded-lg text-indigo-500"><MapPin size={24} /></div>
                    <div><p className="text-xs text-slate-500 uppercase font-bold">Location</p><p className="text-white font-medium">{DEVELOPER_INFO.location}</p></div>
                  </div>
                </div>
              </GlassCard>
            </div>
            <div className="lg:col-span-2">
              <GlassCard>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Name</label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Email</label>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Message</label>
                    <textarea rows="5" required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none" placeholder="Tell me about your project..."></textarea>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isSubmitting} className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold flex items-center justify-center space-x-2 disabled:opacity-50">
                    {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : <><span>Send Message</span> <Send size={18} /></>}
                  </motion.button>
                  {status && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-400 text-center text-sm font-medium">{status}</motion.p>}
                </form>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/10 bg-slate-950">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <p>© 2024 {DEVELOPER_INFO.name}. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href={DEVELOPER_INFO.github} className="hover:text-cyan-400 transition-colors">GitHub</a>
            <a href={DEVELOPER_INFO.linkedin} className="hover:text-cyan-400 transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
