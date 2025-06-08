import { create } from 'zustand';
import { Exam } from '../types/exam';

interface ExamState {
  currentExam: Exam | null;
  currentQuestion: number;
  answers: { [questionId: string]: any };
  setCurrentExam: (exam: Exam | null) => void;
  setCurrentQuestion: (index: number) => void;
  setAnswer: (questionId: string, answer: any) => void;
}

export const useExamStore = create<ExamState>((set) => ({
  currentExam: null,
  currentQuestion: 0,
  answers: {},
  setCurrentExam: (exam) => set({ currentExam: exam }),
  setCurrentQuestion: (index) => set({ currentQuestion: index }),
  setAnswer: (questionId, answer) => set((state) => ({
    answers: { ...state.answers, [questionId]: answer },
  })),
}));
