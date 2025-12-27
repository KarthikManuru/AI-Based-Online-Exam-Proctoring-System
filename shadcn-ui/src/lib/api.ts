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
    answers: number[];
    score: number;
    totalQuestions: number;
    cheated: boolean;
    cheatCount: number;
    status: 'in-progress' | 'submitted';
    startedAt: Date;
    endedAt: Date | null;
    timeRemaining: number;
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

const API_BASE = 'http://localhost:5000/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });
    if (!res.ok) {
        // throw new Error(`API Error: ${res.statusText}`);
        // Return undefined or null? db.ts sometimes returns undefined.
        // Let's handle 404 specially if needed, but for now throw is safer to debug.
        if (res.status === 404) return undefined as any;
        throw new Error(`API Error: ${res.statusText}`);
    }
    return res.json();
}

// Exam Config operations
export async function getExamConfig(): Promise<ExamConfig> {
    return await fetchJson<ExamConfig>('/config');
}

export async function updateExamConfig(updates: Partial<ExamConfig>): Promise<void> {
    await fetchJson('/config', {
        method: 'POST',
        body: JSON.stringify(updates),
    });
}

// Attempt operations
export async function createAttempt(attempt: Attempt): Promise<void> {
    await fetchJson('/attempts', {
        method: 'POST',
        body: JSON.stringify(attempt),
    });
}

export async function getAttemptByStudentId(studentId: string): Promise<Attempt | undefined> {
    return await fetchJson<Attempt>(`/attempts/student/${studentId}`);
}

export async function getAttemptById(id: string): Promise<Attempt | undefined> {
    return await fetchJson<Attempt>(`/attempts/${id}`);
}

export async function updateAttempt(id: string, updates: Partial<Attempt>): Promise<void> {
    await fetchJson(`/attempts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
}

export async function getAllAttempts(): Promise<Attempt[]> {
    return await fetchJson<Attempt[]>('/attempts');
}

export async function deleteAttempt(id: string): Promise<void> {
    await fetchJson(`/attempts/${id}`, { method: 'DELETE' });
}

export async function clearAllAttempts(): Promise<void> {
    await fetchJson('/attempts', { method: 'DELETE' });
}

// Admin Log operations
export async function addAdminLog(action: string, details: string): Promise<void> {
    const log: Partial<AdminLog> = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        action,
        timestamp: new Date(),
        details,
    };
    await fetchJson('/logs', {
        method: 'POST',
        body: JSON.stringify(log),
    });
}

export async function getAdminLogs(): Promise<AdminLog[]> {
    const logs = await fetchJson<AdminLog[]>('/logs');
    // Date strings need to be converted back to Date objects if needed?
    // JSON returns dates as strings. The frontend might expect Date objects.
    return logs.map(log => ({
        ...log,
        timestamp: new Date(log.timestamp)
    }));
}

export async function clearAllLogs(): Promise<void> {
    await fetchJson('/logs', { method: 'DELETE' });
}

// Utility: Allocate question set (round-robin)
export async function allocateQuestionSet(): Promise<'A' | 'B' | 'C' | 'D'> {
    const config = await getExamConfig();
    const sets: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
    const setIndex = (config.allocationCounter || 0) % 4; // safely handle if undefined
    const selectedSet = sets[setIndex];

    // Increment counter
    await updateExamConfig({ allocationCounter: (config.allocationCounter || 0) + 1 });

    return selectedSet;
}
