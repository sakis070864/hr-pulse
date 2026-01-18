
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-16 mt-20 border-t border-white/5 flex flex-col items-center gap-6">
      <div className="flex flex-col items-center text-center">
        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] leading-tight mb-2">
          System Architect
        </span>
        <p className="text-[11px] font-medium text-white/40 tracking-wide leading-relaxed">
          this app is created by <span className="text-white/60 font-bold">A. Athanasopoulos</span> using the engine of <span className="text-indigo-400/60 font-black">Gemini-3-flash</span>
        </p>
      </div>
      
      <a 
        href="https://www.linkedin.com/in/sakis-athan/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-5 py-2 bg-[#0077b5] hover:bg-[#006396] transition-all rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:scale-105 active:scale-95"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
        Contact me at LinkedIn
      </a>
    </footer>
  );
};

export default Footer;
