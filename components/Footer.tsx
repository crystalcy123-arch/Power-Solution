
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-8 md:mb-0">
          <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-bold font-heading text-white">
            Power <span className="text-emerald-500">Solution</span>
          </span>
        </div>
        
        <div className="flex space-x-8 text-sm mb-8 md:mb-0">
          <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Contact Us</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Partners</a>
        </div>

        <div className="text-sm">
          © {new Date().getFullYear()} Power Solution. Leading the Net-Zero transition.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
