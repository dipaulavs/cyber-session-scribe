
/**
 * Format file size in bytes to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

/**
 * Generate a guaranteed unique session ID using timestamp, random strings
 */
export const generateUniqueSessionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr1 = Math.random().toString(36).substring(2, 10);
  const randomStr2 = Math.random().toString(36).substring(2, 10);
  return `session-${timestamp}-${randomStr1}-${randomStr2}`;
};
