
import React from 'react';
import { Session } from '../types';

interface HeaderProps {
  currentSession: Session;
  toggleSidebar?: () => void;
  isMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  currentSession,
  toggleSidebar,
  isMobile
}) => {
  return (
    <header className="bg-cyber-darker border-b border-neon-blue/30 p-2 sm:p-4 flex items-center justify-between relative z-10">
      <div className="flex items-center flex-1 min-w-0">
        {/* Mobile sidebar toggle button */}
        {isMobile && toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="mr-2 p-1.5 text-neon-blue hover:text-white transition-colors md:hidden flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        
        {/* New Loop9 Logo */}
        <div className="relative mr-2 sm:mr-3 flex-shrink-0">
          <img 
            src="/lovable-uploads/8178a521-2c7d-4bc7-8718-2c4aa14fe176.png" 
            alt="Loop9 Technology" 
            className="w-6 h-6 sm:w-8 sm:h-8 object-contain opacity-80"
          />
        </div>
        
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center">
            <h1 className="text-xs sm:text-sm md:text-base font-cyber-title tracking-wider truncate">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-cyan font-bold" style={{
                textShadow: "0 0 8px rgba(0, 195, 255, 0.5)"
              }}>DOMÍNIO IMOBILIÁRIO</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-blue font-bold text-xs sm:text-xs" style={{
                textShadow: "0 0 8px rgba(0, 195, 255, 0.5)"
              }}>™</span>
            </h1>
          </div>
          <div className="flex items-center mt-0.5 sm:mt-1">
            <div className="flex space-x-1 mr-1 sm:mr-2">
              <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-neon-blue cyber-pulse"></div>
              <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-neon-purple cyber-pulse" style={{
                animationDelay: "0.5s"
              }}></div>
              <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-neon-cyan cyber-pulse" style={{
                animationDelay: "1s"
              }}></div>
            </div>
            <span className="text-xs sm:text-xs text-gray-400 hidden sm:block">CYBERNETIC AUTOMATION SYSTEMS</span>
            <span className="text-xs text-gray-400 sm:hidden">CYBER SYSTEMS</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center flex-shrink-0 ml-2">
        <div className="text-xs sm:text-sm text-gray-400 mr-2 sm:mr-4 bg-cyber-darker px-2 py-1 rounded-full border border-neon-blue/20 max-w-[80px] sm:max-w-none">
          <span className="text-neon-blue mr-1">#</span>
          <span className="truncate inline-block max-w-[40px] sm:max-w-none">
            {currentSession?.name}
          </span>
        </div>
        <div className="hexagon bg-cyber-button w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-neon-blue flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;
