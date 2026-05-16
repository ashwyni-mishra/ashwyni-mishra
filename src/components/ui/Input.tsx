import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  textarea?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, error, textarea, className = '', ...props }) => {
  const baseClasses = "w-full bg-white/5 border border-white/10 focus:border-accent focus:ring-1 focus:ring-accent/20 outline-none p-3.5 text-gray-200 transition-all rounded-xl placeholder:text-gray-500 hover:bg-white/[0.07]";
  
  return (
    <div className="w-full space-y-2 group">
      {label && (
        <label className="text-sm font-medium text-gray-400 group-focus-within:text-accent transition-colors px-1">
          {label}
        </label>
      )}
      {textarea ? (
        <textarea 
          className={`${baseClasses} min-h-[120px] resize-none ${className}`} 
          {...(props as any)} 
        />
      ) : (
        <input 
          className={`${baseClasses} ${className}`} 
          {...props} 
        />
      )}
      {error && (
        <p className="text-xs text-red-400 font-medium px-1 flex items-center gap-1.5 animate-fade-in">
          <span className="w-1 h-1 rounded-full bg-red-400" />
          {error}
        </p>
      )}
    </div>
  );
};
