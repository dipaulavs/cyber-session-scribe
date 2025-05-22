
import React from 'react';
import { Attachment } from '../types';

interface InputAreaProps {
  inputText: string;
  setInputText: (text: string) => void;
  attachments: Attachment[];
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleAttachmentClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeAttachment: (id: string) => void;
  sendMessage: () => void;
  isLoading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  formatFileSize: (bytes: number) => string;
}

const InputArea: React.FC<InputAreaProps> = ({
  inputText,
  setInputText,
  attachments,
  handleKeyDown,
  handleAttachmentClick,
  handleFileChange,
  removeAttachment,
  sendMessage,
  isLoading,
  fileInputRef,
  formatFileSize
}) => {
  return (
    <div className="bg-cyber-darker border-t border-neon-blue/30 p-4 relative z-10">
      <div className="flex flex-col bg-cyber-input rounded-lg border border-neon-blue/20 focus-within:border-neon-blue/50 focus-within:glow-border overflow-hidden transition duration-300">
        <div className="flex items-center">
          <button
            onClick={handleAttachmentClick}
            className="p-3 text-gray-500 hover:text-neon-blue transition-colors duration-200"
            title="Attach media"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter neural command..."
            className="flex-1 bg-transparent outline-none p-3 text-gray-300 resize-none max-h-32 placeholder-gray-600"
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={(!inputText.trim() && attachments.length === 0) || isLoading}
            className={`p-3 ${
              (!inputText.trim() && attachments.length === 0) || isLoading 
                ? 'text-gray-600' 
                : 'text-neon-blue hover:text-white hover:glow-text-blue'
            } transition-all duration-200`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        {/* Attachment preview area */}
        {attachments.length > 0 && (
          <div className="px-3 pb-2 pt-1 border-t border-neon-blue/20">
            <div className="flex flex-wrap gap-2">
              {attachments.map(attachment => (
                <div key={attachment.id} className="flex items-center bg-black/30 rounded px-2 py-1.5 text-xs border border-neon-blue/30">
                  <div className="mr-2">
                    {attachment.type.startsWith('image/') ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neon-blue" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    ) : attachment.type.startsWith('video/') ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neon-blue" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    ) : attachment.type.startsWith('audio/') ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neon-blue" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071a1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neon-blue" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="truncate max-w-[100px]">{attachment.name}</span>
                  <span className="ml-1 text-gray-500">({formatFileSize(attachment.size)})</span>
                  <button 
                    onClick={() => removeAttachment(attachment.id)}
                    className="ml-2 text-gray-500 hover:text-red-400 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-2 italic flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-neon-blue" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <span>MARKDOWN SUPPORTED: # Title, ## Subtitle, **bold**, *italic*, `code`, --- for separators, * for lists</span>
      </div>
    </div>
  );
};

export default InputArea;
