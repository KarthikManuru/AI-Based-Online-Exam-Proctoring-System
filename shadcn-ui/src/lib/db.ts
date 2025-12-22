import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Database schema interfaces
export interface AttemptResponse {
  question: string;
  options: string[];
  chosenIndex: number;
  correctIndex: number;
  isCorrect: boolean;
}

export interface Attempt {
  id: string;
  name: string;
  email: string;
  studentId: string;
  questionSet: 'A' | 'B' | 'C' | 'D';
  responses: AttemptResponse[];
  answers: number[]; // Current answers during quiz
  score: number;
  totalQuestions: number;
  cheated: boolean;
  cheatCount: number;
  status: 'in-progress' | 'submitted';
  startedAt: Date;
  endedAt: Date | null;
  timeRemaining: number; // seconds
}

export interface ExamConfig {
  id: string;
  examOpen: boolean;
  proctoredMode: boolean;
  adminResetCode: string;
  allocationCounter: number;
}

export interface AdminLog {
  id: string;
  action: string;
  timestamp: Date;
  details: string;
}

interface QuizDB extends DBSchema {
  attempts: {
    key: string;
    value: Attempt;
    indexes: { 'by-studentId': string; 'by-status': string };
  };
  examConfig: {
    key: string;
    value: ExamConfig;
  };
  adminLogs: {
    key: string;
    value: AdminLog;
    indexes: { 'by-timestamp': Date };
  };
}

let dbInstance: IDBPDatabase<QuizDB> | null = null;

export async function initDB() {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<QuizDB>('cse-quiz-db', 1, {
    upgrade(db) {
      // Attempts store
      const attemptStore = db.createObjectStore('attempts', { keyPath: 'id' });
      attemptStore.createIndex('by-studentId', 'studentId', { unique: true });
      attemptStore.createIndex('by-status', 'status');

      // Exam config store
      db.createObjectStore('examConfig', { keyPath: 'id' });

      // Admin logs store
      const logStore = db.createObjectStore('adminLogs', { keyPath: 'id' });
      logStore.createIndex('by-timestamp', 'timestamp');
    },
  });

  // Initialize default config if not exists
  const config = await dbInstance.get('examConfig', 'main');
  if (!config) {
    await dbInstance.put('examConfig', {
      id: 'main',
      examOpen: false,
      proctoredMode: false,
      adminResetCode: 'CSEADMIN2025',
      allocationCounter: 0,
    });
  }

  return dbInstance;
}

export async function getDB() {
  if (!dbInstance) {
    await initDB();
  }
  return dbInstance!;
}

// Exam Config operations
export async function getExamConfig(): Promise<ExamConfig> {
  const db = await getDB();
  const config = await db.get('examConfig', 'main');
  return config!;
}

export async function updateExamConfig(updates: Partial<ExamConfig>): Promise<void> {
  const db = await getDB();
  const config = await getExamConfig();
  await db.put('examConfig', { ...config, ...updates });
}

// Attempt operations
export async function createAttempt(attempt: Attempt): Promise<void> {
  const db = await getDB();
  await db.add('attempts', attempt);
}

export async function getAttemptByStudentId(studentId: string): Promise<Attempt | undefined> {
  const db = await getDB();
  const index = db.transaction('attempts').store.index('by-studentId');
  return await index.get(studentId);
}

export async function getAttemptById(id: string): Promise<Attempt | undefined> {
  const db = await getDB();
  return await db.get('attempts', id);
}

export async function updateAttempt(id: string, updates: Partial<Attempt>): Promise<void> {
  const db = await getDB();
  const attempt = await db.get('attempts', id);
  if (attempt) {
    await db.put('attempts', { ...attempt, ...updates });
  }
}

export async function getAllAttempts(): Promise<Attempt[]> {
  const db = await getDB();
  return await db.getAll('attempts');
}

export async function deleteAttempt(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('attempts', id);
}

export async function clearAllAttempts(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('attempts', 'readwrite');
  await tx.store.clear();
  await tx.done;
}

// Admin Log operations
export async function addAdminLog(action: string, details: string): Promise<void> {
  const db = await getDB();
  const log: AdminLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    action,
    timestamp: new Date(),
    details,
  };
  await db.add('adminLogs', log);
}

export async function getAdminLogs(): Promise<AdminLog[]> {
  const db = await getDB();
  const logs = await db.getAll('adminLogs');
  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export async function clearAllLogs(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('adminLogs', 'readwrite');
  await tx.store.clear();
  await tx.done;
}

// Utility: Allocate question set (round-robin)
export async function allocateQuestionSet(): Promise<'A' | 'B' | 'C' | 'D'> {
  const config = await getExamConfig();
  const sets: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  const setIndex = config.allocationCounter % 4;
  const selectedSet = sets[setIndex];
  
  // Increment counter
  await updateExamConfig({ allocationCounter: config.allocationCounter + 1 });
  
  return selectedSet;
}