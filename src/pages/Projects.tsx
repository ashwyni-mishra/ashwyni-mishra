import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ShieldCheck, Github, ExternalLink, Zap } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { getPublicPortfolioData } from '../lib/db';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const d = await getPublicPortfolioData();
        setProjects(d.projects || []);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
        <p className="text-gray-500 font-bold tracking-[0.5em] uppercase text-xs animate-pulse">Scanning Repositories</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest mb-6">
          <Terminal className="w-4 h-4" />
          <span>Technical Portfolio</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Security <span className="text-accent-gradient">Prototypes.</span></h1>
        <p className="text-gray-400 mt-6 text-xl max-w-2xl leading-relaxed font-medium">
          Automating security workflows and building tools to identify vulnerabilities at scale.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {projects.map((project, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="h-full flex flex-col group p-8 border-white/5 hover:border-accent/40 transition-all duration-500 bg-surface-dark/40 backdrop-blur-xl">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-500">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="flex gap-4">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  <a href="#" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-accent transition-all">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors">{project.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-8 flex-grow font-medium">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                {project.technologies?.map((tech: string, tIdx: number) => (
                  <span key={tIdx} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    {tech}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 p-12 rounded-3xl bg-accent/5 border border-accent/10 text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <Zap className="w-32 h-32 text-accent" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Interested in Collaboration?</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto relative z-10">I'm always looking for innovative security projects and open-source contributions.</p>
        <Link to="/about">
          <Button size="lg" className="relative z-10">Start a Conversation</Button>
        </Link>
      </div>
    </div>
  );
};
