import React, { useState, useEffect } from 'react';
import { Github, Mail } from 'lucide-react';
import { getPublicPortfolioData } from '../../lib/db';

export const Footer: React.FC = () => {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getPublicPortfolioData();
        setConfig(data.config);
      } catch (err) {
        console.error("Failed to fetch footer config:", err);
      }
    };
    fetchConfig();
  }, []);

  const githubUrl = config?.githubUrl || "https://github.com/ashwyni-mishra";
  const email = config?.email || "ashwani@ashwanimishra.me";
  const footerText = config?.footerText || "Built with Precision & Security.";
  const siteName = config?.siteName || "Ashwani Mishra";

  return (
    <footer className="border-t border-white/5 mt-20 py-12 relative z-10 bg-background/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-6">
        <div className="flex gap-8">
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-accent/10 text-gray-400 hover:text-accent transition-all duration-300">
            <Github className="w-6 h-6" />
          </a>
          <a href={`mailto:${email}`} className="p-3 rounded-xl bg-white/5 hover:bg-accent/10 text-gray-400 hover:text-accent transition-all duration-300">
            <Mail className="w-6 h-6" />
          </a>
        </div>
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500 font-medium">
            © {new Date().getFullYear()} {siteName}. {footerText}
          </p>
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em] font-bold">
            {email}
          </p>
        </div>
      </div>
    </footer>
  );
};
