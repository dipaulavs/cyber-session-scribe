
import React from 'react';
import { Session } from '../types';

interface SidebarProps {
  sessions: Session[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  createNewSession: () => void;
  selectSession: (id: number) => void;
  sidebarExpanded: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  searchQuery,
  setSearchQuery,
  createNewSession,
  selectSession,
  sidebarExpanded,
  toggleSidebar
}) => {
  return (
    <div 
      className={`bg-cyber-darker border-r border-neon-blue/20 transition-all duration-300 flex flex-col ${
        sidebarExpanded ? 'w-72' : 'w-16'
      } relative z-10`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-neon-blue/20 flex items-center justify-between">
        {sidebarExpanded && (
          <div>
            <div className="flex items-center">
              <div className="relative mr-2">
                <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-md transform rotate-45 shadow-lg shadow-neon-blue/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white font-bold text-sm">9</div>
                </div>
              </div>
              <h2 className="font-cyber-title tracking-wider">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-cyan font-bold" style={{textShadow: "0 0 8px rgba(0, 195, 255, 0.7)"}}>loop</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-blue font-bold">9</span>
              </h2>
            </div>
            <div className="flex items-center text-xs mt-1 ml-9">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-neon-blue font-bold" style={{textShadow: "0 0 8px rgba(177, 74, 237, 0.7)"}}>AUTOMATION</span>
              <div className="ml-2 px-1 py-0.5 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 rounded border border-neon-blue/30 text-[8px] text-neon-cyan uppercase tracking-wider">Elite</div>
            </div>
            <div className="flex items-center text-xs text-gray-400 mt-1 ml-9">
              <div className="flex space-x-1 mr-1">
                <div className="w-1 h-1 rounded-full bg-neon-blue cyber-pulse"></div>
                <div className="w-1 h-1 rounded-full bg-neon-purple cyber-pulse" style={{animationDelay: "0.5s"}}></div>
              </div>
              <span className="text-[10px]">CYBERNETIC SYSTEMS</span>
            </div>
          </div>
        )}
        <button 
          onClick={toggleSidebar}
          className="text-neon-blue hover:text-white p-1 rounded-md transition-colors duration-200 bg-cyber-button"
        >
          {sidebarExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {/* New Session Button */}
      <div className={`${sidebarExpanded ? 'p-3' : 'p-2 flex justify-center'}`}>
        <button 
          onClick={createNewSession}
          className={`${sidebarExpanded 
            ? 'w-full bg-cyber-button text-neon-blue font-medium py-2 px-4 glow-text-blue' 
            : 'bg-cyber-button text-neon-blue p-2 w-12 h-12 glow-text-blue'} rounded-md flex items-center justify-center transition-all duration-200 hover:scale-105`}
          title="Create new session"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`${sidebarExpanded ? 'h-5 w-5 mr-1' : 'h-6 w-6'}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {sidebarExpanded && "NEW SESSION"}
        </button>
      </div>
      
      {/* Search Box */}
      {sidebarExpanded && (
        <div className="px-3 pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neon-blue/50" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-cyber-input text-gray-300 w-full pl-10 pr-4 py-2 rounded-md border border-neon-blue/20 focus:outline-none focus:border-neon-blue/50 focus:glow-border transition-all duration-200"
            />
          </div>
        </div>
      )}
      
      {/* Session List */}
      <div className="flex-1 overflow-y-auto cyber-scrollbar cyber-grid">
        {sessions.map(session => (
          <div 
            key={session.id}
            onClick={() => selectSession(session.id)}
            className={`p-4 border-b border-neon-blue/10 cursor-pointer transition-all duration-200 ${
              session.active ? 'bg-cyber-active' : 'hover:bg-cyber-button'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full ${session.active ? 'bg-neon-blue cyber-pulse' : 'bg-gray-600'} mr-2`}></div>
              {sidebarExpanded && (
                <div className="flex-1">
                  <p className={`${session.active ? 'text-neon-blue glow-text-blue' : 'text-white'} font-medium`}>{session.name}</p>
                  <div className="flex items-center text-gray-500 text-xs mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>{session.date}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Sidebar Footer */}
      {sidebarExpanded && (
        <div className="p-3 border-t border-neon-blue/20 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>SYSTEM v2.0.5</span>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-neon-blue mr-1 cyber-pulse"></div>
              <span className="text-neon-blue">ONLINE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
