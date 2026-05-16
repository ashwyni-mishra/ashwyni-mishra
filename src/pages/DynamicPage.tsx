import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { NotFound } from './NotFound';

export const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'portfolio', 'data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const d = docSnap.data();
          const page = d.pages?.find((p: any) => p.slug === slug);
          setPageData(page);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic page:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <p className="text-gray-400 font-medium animate-pulse">Loading Context...</p>
      </div>
    );
  }

  if (!pageData) {
    return <NotFound />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 relative">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{pageData.title}</h1>
        <div className="h-px w-full bg-white/5" />
      </div>
      <div 
        className="prose prose-invert max-w-none text-gray-300 prose-headings:text-white prose-a:text-accent hover:prose-a:text-accent-light prose-strong:text-white"
        dangerouslySetInnerHTML={{ __html: pageData.content }}
      />
    </div>
  );
};
