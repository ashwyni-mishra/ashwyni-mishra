import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import toast from 'react-hot-toast';

import { getPublicPortfolioData } from '../lib/db';

export const Blog: React.FC = () => {
  const [posts, setPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const d = await getPublicPortfolioData();
        setPosts(d.posts || []);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="h-[60vh] flex items-center justify-center text-accent animate-pulse">Accessing Intelligence...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Technical Insights</h1>
          <p className="text-gray-400 text-lg max-w-xl">
            Sharing my thoughts on software engineering, design patterns, and the ever-evolving tech landscape.
          </p>
        </div>
        <div className="hidden lg:block">
          <BookOpen className="w-24 h-24 text-accent/10 -rotate-12" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, idx) => (
          <motion.article 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="h-full flex flex-col group p-0 overflow-hidden border-white/5 bg-surface-dark/40">
              <div className="h-48 bg-gradient-to-br from-accent/20 to-accent-dark/40 flex items-center justify-center">
                <div className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold tracking-widest uppercase">
                  {post.category}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                  {post.excerpt}
                </p>
                <Link to={`/blog/${post.slug}`} className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-accent transition-all">
                  Read Article <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Card>
          </motion.article>
        ))}
      </div>

      <div className="mt-20 pt-20 border-t border-white/5 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Subscribe to My Newsletter</h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Get the latest articles and project updates delivered directly to your inbox.</p>
        <NewsletterSubscribe />
      </div>
    </div>
  );
};

const NewsletterSubscribe: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (!db) {
      toast.error("Database not configured");
      return;
    }
    setLoading(true);
    try {
      const { collection, addDoc } = await import('firebase/firestore');
      await addDoc(collection(db, 'subscribers'), {
        email,
        timestamp: new Date().toISOString()
      });
      toast.success('Successfully subscribed!', { icon: '📧' });
      setEmail('');
    } catch (err) {
      console.error(err);
      toast.error('Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubscribe} className="flex max-w-md mx-auto gap-3">
      <input 
        type="email" 
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com" 
        className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-accent outline-none"
      />
      <Button type="submit" isLoading={loading}>Subscribe</Button>
    </form>
  );
};
