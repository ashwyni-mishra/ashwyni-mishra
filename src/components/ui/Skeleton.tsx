import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-cyber-green/10 rounded ${className}`} />
);

export const SkeletonCard: React.FC = () => (
  <div className="bg-cyber-gray border border-cyber-green/10 rounded p-6 h-full flex flex-col gap-4">
    <Skeleton className="w-1/3 h-6" />
    <Skeleton className="w-full h-4" />
    <Skeleton className="w-5/6 h-4" />
    <Skeleton className="w-2/3 h-4" />
    <div className="mt-auto flex gap-2">
      <Skeleton className="w-16 h-6 rounded-full" />
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
  </div>
);
