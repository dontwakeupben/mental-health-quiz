import React from 'react';



const ProgressBar = ({ current, total }) => {
  const progress = ((current + 1) / total) * 100;
  return (
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-8">
      <div 
        className="h-full bg-indigo-600 transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;