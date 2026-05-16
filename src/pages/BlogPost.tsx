import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicPortfolioData } from '../lib/db';
import { ArrowLeft, Calendar, Clock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPublicPortfolioData();
        const foundPost = data.posts?.find((p: any) => p.slug === slug);
        setPost(foundPost);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <p className="text-gray-400 font-medium animate-pulse">Loading Article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-white mb-6">Post Not Found</h1>
        <p className="text-gray-400 mb-8">The article you are looking for does not exist or has been removed.</p>
        <Link to="/blog" className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-20"
    >
      <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-accent transition-colors mb-12">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>
      
      <header className="mb-12">
        <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest mb-6">
          {post.category}
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 font-medium">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> {post.date}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" /> {post.readTime}
          </span>
        </div>
      </header>
      
      <div className="prose prose-invert prose-lg max-w-none">
        {post.content ? (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        ) : (
          <p className="text-gray-400 italic">No content available for this post.</p>
        )}
      </div>
    </motion.article>
  );
};
