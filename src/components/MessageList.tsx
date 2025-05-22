
import React from 'react';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  showTypingEffect: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  formatFileSize: (bytes: number) => string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  showTypingEffect,
  messagesEndRef,
  formatFileSize
}) => {
  // Markdown renderer function
  const renderMarkdown = (text: string): string => {
    if (!text) return '';
    
    // Process code blocks with ```
    text = text.replace(/```([\s\S]*?)```/g, '<pre class="bg-black/50 p-3 rounded-md my-2 overflow-x-auto text-sm font-mono border border-neon-blue/30 shadow-[0_0_5px_rgba(0,255,255,0.3)]">$1</pre>');
    
    // Process inline code with `
    text = text.replace(/`([^`]+)`/g, '<code class="bg-black/50 px-1 rounded font-mono text-neon-blue shadow-[0_0_2px_rgba(0,255,255,0.3)]">$1</code>');
    
    // H1 - # Title
    text = text.replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold text-neon-blue my-3 border-b border-neon-blue/30 pb-1 glow-text-blue">$1</h1>');
    
    // H2 - ## Subtitle
    text = text.replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold text-neon-purple my-2 glow-text-purple">$1</h2>');
    
    // H3 - ### Smaller subtitle
    text = text.replace(/^### (.*$)/gm, '<h3 class="text-md font-medium text-neon-cyan my-2 glow-text-cyan">$1</h3>');
    
    // Bold - **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white glow-text-white">$1</strong>');
    
    // Italic - *text*
    text = text.replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>');
    
    // Horizontal rule - ---
    text = text.replace(/^\s*---\s*$/gm, '<hr class="border-t border-neon-blue/30 my-4 glow-hr" />');
    
    // Lists - * item
    text = text.replace(/^\* (.*)$/gm, '<li class="ml-5 list-disc text-neon-cyan">$1</li>');
    
    // Numbered lists - 1. item
    text = text.replace(/^\d+\. (.*)$/gm, '<li class="ml-5 list-decimal text-neon-cyan">$1</li>');
    
    // Blockquote - > text
    text = text.replace(/^> (.*)$/gm, '<blockquote class="border-l-4 border-neon-purple/50 pl-3 italic text-gray-400 my-2 glow-border-left-purple">$1</blockquote>');
    
    // Convert line breaks to <br>
    text = text.replace(/\n/g, '<br>');
    
    return text;
  };
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 cyber-scrollbar">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <div className="w-24 h-24 border-2 border-neon-blue/30 rounded-full flex items-center justify-center mb-4 cyber-pulse glow-border">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neon-blue" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-neon-blue glow-text-blue font-cyber-title tracking-wider">INITIALIZE CONVERSATION</p>
          <p className="text-sm mt-2">Neural pathways ready for input</p>
        </div>
      )}
      
      {messages.map((msg, index) => (
        <div 
          key={index} 
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} message-transition`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div 
            className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-cyber-panel border-neon-purple/30 border text-white rounded-br-none glow-border-purple' 
                : 'bg-cyber-panel border-neon-blue/30 border rounded-bl-none glow-border'
            }`}
          >
            <div className="flex items-center text-xs mb-2">
              {msg.role === 'user' ? (
                <>
                  <div className="bg-neon-purple/20 text-neon-purple px-2 py-0.5 rounded-sm glow-text-purple">USER</div>
                  <div className="ml-2 text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>HUMAN</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-neon-blue/20 text-neon-blue px-2 py-0.5 rounded-sm glow-text-blue">SYSTEM</div>
                  <div className="ml-2 text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    <span>DOMÍNIO</span>
                  </div>
                </>
              )}
            </div>
            
            {msg.role === 'assistant' ? (
              <div 
                className="markdown-content" 
                dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
              />
            ) : (
              <div>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                
                {/* Display attachments if any */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-neon-purple/20">
                    <div className="text-xs text-neon-purple mb-2 glow-text-purple">ATTACHMENTS:</div>
                    <div className="flex flex-wrap gap-2">
                      {msg.attachments.map(attachment => (
                        <div key={attachment.id} className="flex items-center bg-black/30 rounded px-2 py-1.5 text-xs border border-neon-purple/30">
                          <div className="mr-2">
                            {attachment.type.startsWith('image/') ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neon-purple" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                            ) : attachment.type.startsWith('video/') ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neon-purple" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                              </svg>
                            ) : attachment.type.startsWith('audio/') ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neon-purple" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071a1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neon-purple" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className="truncate max-w-[100px]">{attachment.name}</span>
                          <span className="ml-1 text-gray-500">({formatFileSize(attachment.size)})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Message timestamp */}
            <div className="text-right mt-1">
              <span className="text-[10px] text-gray-500">
                {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start message-transition">
          <div className="bg-cyber-panel border border-neon-blue/30 rounded-lg rounded-bl-none max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 glow-border">
            <div className="flex items-center text-xs mb-2">
              <div className="bg-neon-blue/20 text-neon-blue px-2 py-0.5 rounded-sm glow-text-blue">SYSTEM</div>
              <div className="ml-2 text-gray-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span>DOMÍNIO</span>
              </div>
            </div>
            
            {showTypingEffect ? (
              <div className="cyber-typing text-neon-blue">Processing neural response...</div>
            ) : (
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
