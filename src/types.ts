export type UserRole = 'ADMIN' | 'ASSISTANT' | 'CLERK';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  officeName?: string;
  welcomeName?: string;
}

export interface Case {
  id: string;
  clientName: string;
  caseNumber: string;
  type: string;
  status: 'ACTIVE' | 'POSTPONED' | 'CLOSED';
  nextSession?: string;
  nextSessionTime?: string;
  description: string;
  court: string;
}

export interface Session {
  id: string;
  caseId: string;
  clientName: string;
  caseNumber: string;
  type: string;
  time: string;
  court: string;
  status: 'PENDING' | 'ATTENDED' | 'MISSED';
}

export interface FinancialRecord {
  id: string;
  type: 'FEES' | 'EXPENSE' | 'SALARY';
  amount: number;
  date: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}
