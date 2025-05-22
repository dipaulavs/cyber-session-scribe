
export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  file?: File;
}

export interface AttachmentInfo {
  id: string;
  name: string;
  type: string;
  size: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  attachments?: AttachmentInfo[];
}

export interface Session {
  id: number;
  name: string;
  date: string;
  active: boolean;
  sessionId: string;
}
