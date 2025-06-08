import React from 'react';
import { Dropdown } from '../common/Dropdown';
import { useExamStore } from '../../stores/examStore';

export const QuestionNavigator: React.FC = () => {
  const { currentExam, currentQuestion, setCurrentQuestion } = useExamStore();
  if (!currentExam) return null;

  const options = currentExam.questions.map((_, index) => `Question ${index + 1}`);
  return (
    <div className="mb-4">
      <Dropdown options={options} onSelect={setCurrentQuestion} />
    </div>
  );
};