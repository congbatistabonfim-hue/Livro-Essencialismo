
import React from 'react';

export const BookCover: React.FC = () => {
  return (
    <div className="relative aspect-[2/3] w-full max-w-[240px] shadow-2xl group cursor-pointer transition-transform duration-300 hover:scale-105">
       {/* Mock Cover using Tailwind/CSS */}
       <div className="absolute inset-0 bg-[#fdfbf7] rounded-sm flex flex-col items-center justify-between p-6 text-center border-l-[12px] border-[#e5e5e5] overflow-hidden">
          
          {/* Top Section: Author */}
          <div className="w-full pt-4 z-10">
             <p className="text-sm font-bold text-red-600 tracking-widest uppercase">Greg McKeown</p>
          </div>

          {/* Middle Section: Graphic & Title */}
          <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10">
              {/* Scribble Circle Graphic */}
              <div className="w-40 h-40 relative mb-4">
                 <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 text-black opacity-90 animate-pulse-slow">
                    <path d="M 50 50 m -40 0 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="opacity-20" />
                    <path d="M 30 40 Q 50 10 70 40 T 50 80 T 30 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 25 50 Q 50 20 75 50 T 50 90 T 25 50" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70" />
                    <path d="M 35 35 Q 65 35 65 65" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                 </svg>
                 
                 {/* Inner Text inside circle */}
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-[#fdfbf7] px-2 text-2xl font-bold font-serif-book text-black tracking-tighter">
                      essencialismo
                    </span>
                 </div>
              </div>
          </div>
          
          {/* Bottom Section: Subtitle */}
          <div className="w-full pb-4 z-10">
             <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] border-t border-gray-300 pt-3 mt-2">
               A disciplinada busca por menos
             </p>
          </div>

          {/* Publisher Logo Mock */}
          <div className="mt-auto">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black mx-auto">
               <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
             </svg>
          </div>
       </div>
       
       {/* Spine shadow effect */}
       <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/10 to-transparent pointer-events-none rounded-l-sm z-20"></div>
       
       <style>{`
         .animate-pulse-slow {
            animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
         }
       `}</style>
    </div>
  );
};
