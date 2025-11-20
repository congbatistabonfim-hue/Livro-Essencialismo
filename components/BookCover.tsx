import React from 'react';

export const BookCover: React.FC = () => {
  return (
    <div className="relative aspect-[2/3] w-full max-w-[240px] shadow-2xl group cursor-pointer transition-transform duration-300 hover:scale-105">
       {/* Mock Cover using Tailwind/CSS */}
       <div className="absolute inset-0 bg-white rounded-sm flex flex-col items-center justify-center p-6 text-center border-l-8 border-gray-200">
          {/* Scribble Circle Graphic simulation */}
          <div className="w-32 h-32 rounded-full border-4 border-black flex items-center justify-center mb-6 relative">
             <div className="absolute inset-0 border-4 border-black rounded-full opacity-70 transform translate-x-1 translate-y-1"></div>
             <div className="absolute inset-0 border-4 border-black rounded-full opacity-60 transform -translate-x-1 -translate-y-1"></div>
             <span className="text-black font-bold text-xl tracking-tighter z-10 bg-white px-1">essencialismo</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2 font-serif-book tracking-tight">essencialismo</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-6">A disciplinada busca por menos</p>
          <p className="text-sm font-bold text-red-600">GREG McKEOWN</p>
          
          <div className="mt-auto mb-2">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-800 mx-auto">
               <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
             </svg>
          </div>
       </div>
       
       {/* Spine shadow effect */}
       <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/20 to-transparent pointer-events-none rounded-l-sm"></div>
    </div>
  );
};