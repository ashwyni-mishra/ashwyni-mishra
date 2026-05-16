import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Code2, Cpu, Globe2, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { getPublicPortfolioData } from '../lib/db';

export const Home: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const d = await getPublicPortfolioData();
        setProfile(d.profile || {});
        setSkills(d.skills || {});
      } catch (err) {
        console.error("Failed to fetch home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
        <p className="text-gray-500 font-bold tracking-[0.5em] uppercase text-xs animate-pulse">Initializing Interface</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden pt-20">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/[0.02] blur-[100px] rounded-full animate-pulse-slow delay-1000" />
      </div>

      <div className="max-w-5xl w-full relative z-10 space-y-16">
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent text-sm font-medium"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open for Internships & Collaborations</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] mb-4">
              {profile?.name || 'Ashwani Mishra'} <br />
              <span className="text-accent-gradient drop-shadow-2xl">Cyber Security.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
              B.Tech CSE (Cybersecurity) Student at <span className="text-white">Parul University</span>. 
              {profile?.bio || " Specialized in Web Security, Penetration Testing, and Automation."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/projects">
              <Button size="lg" className="h-16 px-12 text-lg group rounded-2xl">
                Explore Work <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="secondary" size="lg" className="h-16 px-12 text-lg rounded-2xl bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all">
                The Mission
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Skills Grid - Detailed Homepage Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20"
        >
          {skills && Object.entries(skills).map(([category, items]: [string, any], idx) => (
            <div key={idx} className="glass-card group p-8 space-y-6 hover:scale-[1.02] transition-all duration-500 border-white/5 hover:border-accent/40 bg-surface-dark/40 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                  {category === "Programming" && <Code2 className="w-5 h-5" />}
                  {category === "Security" && <ShieldCheck className="w-5 h-5" />}
                  {category.includes("Platform") && <Globe2 className="w-5 h-5" />}
                  {!["Programming", "Security", "Platforms"].includes(category) && <Cpu className="w-5 h-5" />}
                </div>
                <h3 className="text-white font-bold tracking-widest uppercase text-xs">{category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((skill: string, sIdx: number) => (
                  <span key={sIdx} className="px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-sm text-gray-400 font-medium group-hover:text-gray-200 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-10 flex justify-center gap-12 grayscale opacity-40"
        >
          <div className="flex flex-col items-center gap-2">
            <Code2 className="w-8 h-8 text-white" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Developer</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Cpu className="w-8 h-8 text-white" />
            <span className="text-[10px] font-bold tracking-widest uppercase">SecOps</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Globe2 className="w-8 h-8 text-white" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Web Sec</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
