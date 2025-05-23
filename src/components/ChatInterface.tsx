import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import InputArea from './InputArea';
import Header from './Header';
import { generateUniqueSessionId, formatFileSize } from '../utils/helpers';
import { Session, Message, Attachment } from '../types';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTypingEffect, setShowTypingEffect] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse sidebar on mobile
      if (window.innerWidth < 768) {
        setSidebarExpanded(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Generate initial session
  const initialSessionId = generateUniqueSessionId();
  const [sessions, setSessions] = useState<Session[]>([
    { 
      id: 1, 
      name: `Session ${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`, 
      date: new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }).replace(',', ''), 
      active: true,
      sessionId: initialSessionId
    }
  ]);
  
  const [activeSessionId, setActiveSessionId] = useState(1);
  
  const apiUrl = 'https://evoapi.loop9.com.br/api/v1/a2a/20c0c5d6-03c6-41cb-9927-f6fa61f3efc1';
  const apiKey = '737ceff1-cfc4-42f9-8a46-d32945ebd717';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get current session object
  const getCurrentSession = (): Session => {
    return sessions.find(session => session.id === activeSessionId) || sessions[0];
  };

  // Get active session's messages
  const getCurrentMessages = (): Message[] => {
    const currentSession = getCurrentSession();
    return messages[currentSession.sessionId] || [];
  };

  // Handle file attachments
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    const newAttachments = files.map(file => ({
      id: Math.random().toString(36).substring(2, 11),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      file: file
    }));
    
    setAttachments([...attachments, ...newAttachments]);
    
    // Reset file input
    if (e.target) e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };

  const sendMessage = async () => {
    if (!inputText.trim() && attachments.length === 0) return;
    
    const currentSession = getCurrentSession();
    
    // Create a message object
    let userMessage: Message = { role: 'user', content: inputText };
    
    // Add attachment info if present
    if (attachments.length > 0) {
      userMessage.attachments = attachments.map(a => ({
        id: a.id,
        name: a.name,
        type: a.type,
        size: a.size
      }));
    }
    
    // Update messages for the current session
    setMessages(prev => ({
      ...prev,
      [currentSession.sessionId]: [
        ...(prev[currentSession.sessionId] || []),
        userMessage
      ]
    }));
    
    setInputText('');
    setAttachments([]);
    setIsLoading(true);
    setShowTypingEffect(true);
    
    try {
      console.log('Sending message to API:', {
        sessionId: currentSession.sessionId,
        message: inputText
      });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tasks/sendSubscribe',
          params: {
            message: {
              role: 'user',
              parts: [
                {
                  type: 'text',
                  text: inputText
                }
              ]
            },
            sessionId: currentSession.sessionId,
            id: `task-${Date.now()}`
          },
          id: `call-${Date.now()}`
        })
      });
      
      console.log('API Response status:', response.status);
      const data = await response.json();
      console.log('API Response data:', data);
      
      if (data.error) {
        console.error('API Error:', data.error);
        setMessages(prev => ({
          ...prev,
          [currentSession.sessionId]: [
            ...(prev[currentSession.sessionId] || []),
            { role: 'assistant', content: `Error: ${data.error.message}` }
          ]
        }));
      } else if (data.result && data.result.status && data.result.status.message) {
        const botContent = data.result.status.message.parts[0].text;
        console.log('Bot response:', botContent);
        setMessages(prev => ({
          ...prev,
          [currentSession.sessionId]: [
            ...(prev[currentSession.sessionId] || []),
            { role: 'assistant', content: botContent }
          ]
        }));
      } else {
        console.warn('Unexpected response format:', data);
        setMessages(prev => ({
          ...prev,
          [currentSession.sessionId]: [
            ...(prev[currentSession.sessionId] || []),
            { role: 'assistant', content: 'Received an unexpected response format' }
          ]
        }));
      }
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessages(prev => ({
        ...prev,
        [currentSession.sessionId]: [
          ...(prev[currentSession.sessionId] || []),
          { role: 'assistant', content: `Failed to connect: ${errorMessage}` }
        ]
      }));
    } finally {
      setIsLoading(false);
      setShowTypingEffect(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const createNewSession = () => {
    const newId = sessions.length > 0 ? Math.max(...sessions.map(s => s.id)) + 1 : 1;
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).replace(',', '');
    const newSessionId = generateUniqueSessionId();
    
    const newSession: Session = {
      id: newId,
      name: `Session ${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`,
      date: formattedDate,
      active: true,
      sessionId: newSessionId
    };
    
    // Set all sessions to inactive
    const updatedSessions = sessions.map(session => ({
      ...session,
      active: false
    }));
    
    // Add new session and set it as active
    setSessions([newSession, ...updatedSessions]);
    setActiveSessionId(newId);
    
    // Initialize with a welcome message
    setMessages(prev => ({
      ...prev,
      [newSessionId]: [
        { 
          role: 'assistant', 
          content: `# New Session Created
    
## Welcome to Session ${newId}

This is a **new conversation** with DOMÍNIO IMOBILIÁRIO AI.

---

> System is ready and waiting for your input.`
        }
      ]
    }));

    // Close sidebar on mobile after creating session
    if (isMobile) {
      setSidebarExpanded(false);
    }
  };

  const selectSession = (id: number) => {
    setActiveSessionId(id);
    
    // Update active state in sessions
    const updatedSessions = sessions.map(session => ({
      ...session,
      active: session.id === id
    }));
    
    setSessions(updatedSessions);
    
    // If this session doesn't have messages yet, initialize it
    const selectedSession = sessions.find(session => session.id === id);
    if (selectedSession && !messages[selectedSession.sessionId]) {
      setMessages(prev => ({
        ...prev,
        [selectedSession.sessionId]: [
          { 
            role: 'assistant', 
            content: `# Welcome to Session ${id}
    
## Cybernetic Interface v2.0

This conversation history is **restored**.

---

> Session active and ready for input.`
          }
        ]
      }));
    }

    // Close sidebar on mobile after selecting session
    if (isMobile) {
      setSidebarExpanded(false);
    }
  };

  const filteredSessions = sessions.filter(session => 
    session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current messages to display
  const currentMessages = getCurrentMessages();

  return (
    <div className="flex h-screen bg-cyber-dark text-gray-100 font-cyber overflow-hidden">
      {/* Custom CSS with responsive improvements */}
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Rajdhani:wght@300;400;500;600;700&display=swap');
        
        .font-cyber {
          font-family: 'Rajdhani', sans-serif;
        }
        
        .font-cyber-title {
          font-family: 'Orbitron', sans-serif;
        }
        
        .bg-cyber-dark {
          background-color: #0a0e17;
          background-image: 
            radial-gradient(circle at 15% 50%, rgba(17, 142, 165, 0.1) 0%, transparent 25%),
            radial-gradient(circle at 85% 30%, rgba(118, 36, 194, 0.1) 0%, transparent 33%);
        }
        
        .bg-cyber-darker {
          background-color: rgba(6, 9, 15, 0.7);
          backdrop-filter: blur(10px);
        }
        
        .bg-cyber-panel {
          background: linear-gradient(135deg, rgba(13, 17, 23, 0.8) 0%, rgba(10, 14, 20, 0.9) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 195, 255, 0.1);
          box-shadow: 0 0 20px rgba(0, 195, 255, 0.05);
        }
        
        .bg-cyber-input {
          background: rgba(8, 11, 18, 0.8);
          border: 1px solid rgba(0, 195, 255, 0.2);
          box-shadow: 0 0 10px rgba(0, 195, 255, 0.05) inset;
        }
        
        .bg-cyber-button {
          background: linear-gradient(135deg, rgba(0, 195, 255, 0.1) 0%, rgba(0, 89, 255, 0.1) 100%);
          border: 1px solid rgba(0, 195, 255, 0.3);
          box-shadow: 0 0 10px rgba(0, 195, 255, 0.1);
        }
        
        .bg-cyber-button:hover {
          background: linear-gradient(135deg, rgba(0, 195, 255, 0.2) 0%, rgba(0, 89, 255, 0.2) 100%);
          box-shadow: 0 0 15px rgba(0, 195, 255, 0.2);
        }
        
        .bg-cyber-active {
          background: linear-gradient(135deg, rgba(0, 195, 255, 0.15) 0%, rgba(0, 89, 255, 0.15) 100%);
          border: 1px solid rgba(0, 195, 255, 0.4);
          box-shadow: 0 0 15px rgba(0, 195, 255, 0.1);
        }
        
        .text-neon-blue {
          color: #00c3ff;
        }
        
        .text-neon-purple {
          color: #b14aed;
        }
        
        .text-neon-cyan {
          color: #0ff4f4;
        }
        
        .border-neon-blue {
          border-color: rgba(0, 195, 255, 0.5);
        }
        
        .border-neon-purple {
          border-color: rgba(177, 74, 237, 0.5);
        }
        
        .glow-text-blue {
          text-shadow: 0 0 5px rgba(0, 195, 255, 0.5);
        }
        
        .glow-text-purple {
          text-shadow: 0 0 5px rgba(177, 74, 237, 0.5);
        }
        
        .glow-text-cyan {
          text-shadow: 0 0 5px rgba(15, 244, 244, 0.5);
        }
        
        .glow-text-white {
          text-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
        }
        
        .glow-border {
          box-shadow: 0 0 5px rgba(0, 195, 255, 0.3);
        }
        
        .glow-border-purple {
          box-shadow: 0 0 5px rgba(177, 74, 237, 0.3);
        }
        
        .glow-hr {
          box-shadow: 0 0 5px rgba(0, 195, 255, 0.3);
        }
        
        .glow-border-left-purple {
          box-shadow: -3px 0 5px -2px rgba(177, 74, 237, 0.3);
        }
        
        .cyber-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 195, 255, 0.5), transparent);
        }
        
        .cyber-line-vertical {
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(0, 195, 255, 0.5), transparent);
        }
        
        .cyber-scanner {
          background: linear-gradient(90deg, transparent, rgba(0, 195, 255, 0.1), transparent);
          background-size: 200% 100%;
          animation: scanning 3s infinite linear;
        }
        
        @keyframes scanning {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        .cyber-pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
        
        .cyber-typing {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          animation: typing 1.5s steps(20, end) infinite;
        }
        
        @keyframes typing {
          0% { width: 0 }
          50% { width: 100% }
          100% { width: 0 }
        }
        
        .hexagon {
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
        }
        
        .cyber-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .cyber-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        
        .cyber-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #00c3ff, #0059ff);
          border-radius: 2px;
        }
        
        .cyber-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #00e5ff, #0070ff);
        }
        
        .message-transition {
          transition: all 0.3s ease-out;
          animation: message-appear 0.3s forwards;
        }
        
        @keyframes message-appear {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .cyber-grid {
          background-image: 
            linear-gradient(rgba(0, 195, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 195, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .cyber-noise {
          position: relative;
        }
        
        .cyber-noise::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.02;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        
        /* Mobile-specific styles */
        @media (max-width: 768px) {
          .cyber-grid {
            background-size: 15px 15px;
          }
          
          .cyber-scrollbar::-webkit-scrollbar {
            width: 2px;
          }
        }
        
        /* Sidebar overlay for mobile */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 20;
          backdrop-filter: blur(4px);
        }
        `}
      </style>
      
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarExpanded && (
        <div 
          className="sidebar-overlay md:hidden"
          onClick={() => setSidebarExpanded(false)}
        />
      )}
      
      <Sidebar 
        sessions={filteredSessions} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        createNewSession={createNewSession} 
        selectSession={selectSession} 
        sidebarExpanded={sidebarExpanded}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      
      <div className="flex-1 flex flex-col relative overflow-hidden cyber-noise">
        {/* Background Grid */}
        <div className="absolute inset-0 cyber-grid pointer-events-none"></div>
        
        <Header 
          currentSession={getCurrentSession()}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
        
        <MessageList 
          messages={currentMessages}
          isLoading={isLoading}
          showTypingEffect={showTypingEffect}
          messagesEndRef={messagesEndRef}
          formatFileSize={formatFileSize}
        />
        
        <InputArea 
          inputText={inputText}
          setInputText={setInputText}
          attachments={attachments}
          handleKeyDown={handleKeyDown}
          handleAttachmentClick={handleAttachmentClick}
          handleFileChange={handleFileChange}
          removeAttachment={removeAttachment}
          sendMessage={sendMessage}
          isLoading={isLoading}
          fileInputRef={fileInputRef}
          formatFileSize={formatFileSize}
        />
        
        {/* Connection status */}
        <div className="bg-cyber-darker border-t border-neon-blue/20 py-1.5 px-2 sm:px-4 flex items-center justify-between text-xs relative z-10">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-neon-blue mr-2 cyber-pulse"></div>
            <span className="text-gray-500 hidden sm:inline">QUANTUM LINK ACTIVE</span>
            <span className="text-gray-500 sm:hidden">ACTIVE</span>
          </div>
          <div className="flex items-center">
            <span className="text-neon-blue mr-2 font-mono tracking-wider text-xs truncate max-w-[80px] sm:max-w-none">
              {getCurrentSession().sessionId.substring(0, 8)}
            </span>
            <div className="cyber-scanner h-3 w-6 sm:h-4 sm:w-10 bg-neon-blue/10 rounded-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
