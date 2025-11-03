export interface Exam {
    id: string;
    title: string;
    scheduledDate: string;
    duration: number;
    questions: Question[];
    organization?: string;
    examiner?: string;
    status?: 'scheduled' | 'in-progress' | 'completed' | "expired";
    endTime?: string;
    expiresBy?: string;
    imageUrl?: string;
    tags?: string[];
  }
  export interface Question {
    id: string;
    type: 'mcq' | 'checkbox' | 'textbox' | 'rating' | 'coding' | 'media';
    content: string;
    options?: string[];
    correctAnswer?: string | string[];
    maxScore: number;
    mediaUrl?: string;
    files?: string [];
  }
  export interface ExamSubmission {
    examId: string;
    studentId: string;
    answers: { [questionId: string]: any };
    score?: number;
  }
  export interface ExamCredentials {
    examId: string;
    studentCode: string;
  }