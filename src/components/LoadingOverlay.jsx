import React from 'react';
import { Loader2 } from 'lucide-react';





const LoadingOverlay = ({ message = "Evaluating response..." }) => (
  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in">
    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
    <p className="text-slate-600 font-medium animate-pulse">{message}</p>
  </div>
);

export default LoadingOverlay;