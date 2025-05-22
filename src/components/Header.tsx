
import React from 'react';
import { Session } from '../types';

interface HeaderProps {
  currentSession: Session;
}

const Header: React.FC<HeaderProps> = ({ currentSession }) => {
  return (
    <header className="bg-cyber-darker border-b border-neon-blue/30 p-4 flex items-center justify-between relative z-10">
      <div className="flex items-center">
        <div className="relative mr-4">
          <div className="w-10 h-10 bg-gradient-to-br from-neon-blue via-neon-purple to-pink-500 rounded-lg transform rotate-45 shadow-lg shadow-neon-blue/20"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <div className="absolute top-0 left-0 right-0 bottom-0 border-2 border-white/20 rounded-lg transform rotate-45 animate-pulse"></div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center">
            <h1 className="text-2xl font-cyber-title tracking-wider">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-cyan font-bold" style={{textShadow: "0 0 10px rgba(0, 195, 255, 0.7)"}}>DOMÍNIO</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-pink-500 font-bold" style={{textShadow: "0 0 10px rgba(177, 74, 237, 0.7)"}}> IMOBILIÁRIO</span>
            </h1>
            <div className="ml-2 px-1.5 py-0.5 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 rounded-md border border-neon-blue/30 text-[10px] text-neon-cyan uppercase tracking-wider">Elite</div>
          </div>
          <div className="flex items-center mt-1">
            <div className="flex space-x-1 mr-2">
              <div className="w-1 h-1 rounded-full bg-neon-blue cyber-pulse"></div>
              <div className="w-1 h-1 rounded-full bg-neon-purple cyber-pulse" style={{animationDelay: "0.5s"}}></div>
              <div className="w-1 h-1 rounded-full bg-neon-cyan cyber-pulse" style={{animationDelay: "1s"}}></div>
            </div>
            <span className="text-xs text-gray-400">CONSULTORIA IMOBILIÁRIA INTELIGENTE</span>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="text-sm text-gray-400 mr-4 bg-cyber-darker px-3 py-1 rounded-full border border-neon-blue/20">
          <span className="text-neon-blue mr-1">#</span>
          {currentSession?.name}
        </div>
        <div className="hexagon bg-cyber-button w-8 h-8 flex items-center justify-center text-neon-blue">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;
