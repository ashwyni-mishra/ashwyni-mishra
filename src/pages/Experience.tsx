import React from 'react';
import { Card } from '../components/ui/Card';
import { Calendar, MapPin, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPublicPortfolioData } from '../lib/db';

export const Experience: React.FC = () => {
  const [experiences, setExperiences] = React.useState<any[]>([]);
  const [education, setEducation] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const d = await getPublicPortfolioData();
        setExperiences(d.experience || []);
        setEducation(d.education || []);
      } catch (err) {
        console.error("Failed to fetch experience:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-[60vh] flex items-center justify-center text-accent animate-pulse">Retrieving Chronicles...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 relative">
      <div className="absolute top-40 right-0 w-96 h-96 bg-accent/5 blur-[150px] rounded-full" />
      
      <div className="mb-20">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-6">Professional Journey</h1>
        <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
          Tracing my evolution as a cybersecurity student and developer, building tools for a safer web.
        </p>
      </div>

      <div className="space-y-24">
        {/* Experience Section */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Experience</h2>
            <div className="h-px flex-grow bg-white/5" />
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            {experiences.map((exp, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="hover:border-accent/30 transition-all group p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">{exp.role}</h3>
                      <p className="text-accent-light font-medium mt-1">{exp.company}</p>
                    </div>
                    <div className="flex flex-col md:items-end gap-2 text-sm text-gray-500 font-medium">
                      <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {exp.period}</span>
                      <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {exp.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 leading-relaxed mb-6">{exp.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {exp.highlights?.map((item: string, sIdx: number) => (
                      <span key={sIdx} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-400">
                        {item}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Education</h2>
            <div className="h-px flex-grow bg-white/5" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {education.map((edu, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-white/5 hover:border-accent/20 transition-all p-8">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 text-accent">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{edu.degree}</h3>
                  <p className="text-accent-light font-medium mb-4">{edu.school}</p>
                  <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {edu.period}</span>
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {edu.location}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{edu.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
