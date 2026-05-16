import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { Mail, Github, Linkedin, Twitter, MapPin, Send, Code, Zap, ExternalLink, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export const About: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!db) {
        setProfile({
          name: "Ashwani Mishra",
          headline: "Security Researcher & Student",
          bio: "Cybersecurity student and independent researcher at Parul University. I specialize in vulnerability assessment, automated reconnaissance workflows, and offensive-security research, with a passion for identifying and mitigating emerging threats."
        });
        setResources([
          { title: "Bug Bounty Tools", url: "https://github.com/ashwyni-mishra", category: "Open Source" },
          { title: "Security Checklists", url: "#", category: "Guides" }
        ]);
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'portfolio', 'data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const d = docSnap.data();
          setProfile(d.profile || {});
          setResources(d.resources || []);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) {
      toast.error("Database not configured. Cannot send message.");
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...form,
        timestamp: new Date().toISOString(),
        read: false
      });
      toast.success('Message sent! I will get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center text-accent animate-pulse">Synchronizing Profile...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* About Section */}
        <div className="space-y-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Designing the Future, <span className="text-accent">One Line</span> at a Time.</h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              {profile?.bio || "I'm a full-stack engineer passionate about building scalable, user-centric applications. With a focus on performance and modern design, I strive to create digital experiences that make a difference."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-white font-bold">Architecture</h3>
              <p className="text-gray-500 text-sm">Building modular, high-performance web systems.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-white font-bold">Performance</h3>
              <p className="text-gray-500 text-sm">Optimizing every millisecond for seamless experiences.</p>
            </div>
          </div>

          <div className="pt-4">
            <a href="/resume.pdf" download="Ashwani_Mishra_Resume.pdf">
              <Button className="w-full sm:w-auto h-12 px-8 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download Resume
              </Button>
            </a>
          </div>

          {/* Resources Mini Grid */}
          {resources.length > 0 && (
            <div className="pt-10 space-y-6">
              <h3 className="text-xl font-bold text-white">Featured Resources</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {resources.map((res, idx) => (
                  <a 
                    key={idx} 
                    href={res.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/40 transition-all group"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">{res.category}</p>
                        <h4 className="text-white font-bold group-hover:text-accent transition-colors">{res.title}</h4>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="pt-10 flex gap-6">
            <a href="https://github.com/ashwyni-mishra" target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
              <Github className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com/in/ashwyni-mishra" target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="https://twitter.com/ashwyni_mishra" target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
              <Twitter className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Contact Form Section */}
        <div>
          <Card className="p-8 border-white/5 bg-surface-dark/40 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white mb-2">Get in Touch</h2>
            <p className="text-gray-500 text-sm mb-8">Have a project in mind? Let's build something amazing together.</p>
            
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Name" placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                <Input label="Email" type="email" placeholder="john@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <Input label="Subject" placeholder="Project Inquiry" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required />
              <Input label="Message" textarea placeholder="Tell me more about your project..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
              <Button type="submit" className="w-full h-12" isLoading={submitting}>
                <Send className="w-4 h-4" /> Send Message
              </Button>
            </form>

            <div className="mt-10 pt-10 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Mail className="w-4 h-4 text-accent" />
                <span>ashwani@ashwanimishra.me</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Remote / Global</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
