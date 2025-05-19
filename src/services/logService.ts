
import { LogEntry } from './types';
import { mockLogs } from './mockData';

export const logService = {
  getLogs: async (): Promise<LogEntry[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockLogs]), 300);
    });
  },
  
  addLog: async (adminId: string, adminName: string, action: string, details: string): Promise<LogEntry> => {
    const newLog: LogEntry = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      adminId,
      adminName,
      action,
      details
    };
    mockLogs.unshift(newLog);
    return new Promise((resolve) => {
      setTimeout(() => resolve(newLog), 300);
    });
  },
};
