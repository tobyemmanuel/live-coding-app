import React from 'react';
import { useExamStore } from '../stores/examStore';
import { useSubmitExam } from '../services/examApi';
import { QuestionNavigator } from '@/components/exam/QuestionNavigator';
import { QuestionTypes } from '@/components/exam/QuestionTypes';
import { FileExplorer } from '@/components/exam/FileExplorer';
import { Button } from '@/components/common/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const ExamInterface: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const { currentExam, currentQuestion, answers, setAnswer } = useExamStore();
  const { user } = useAuthStore();
  const { mutate: submitExam, isPending  } = useSubmitExam();
  const navigate = useNavigate();

  if (!currentExam || !user) return <div>Loading...</div>;

  const question = currentExam.questions[currentQuestion];
  const files = ['index.js', 'styles.css', 'utils.js']; // Example files

  const handleSubmit = () => {
    submitExam(
      { examId: examId!, studentId: user.id, answers },
      { onSuccess: () => navigate(`/exam-summary/${examId}`) }
    );
  };

  return (
    <div className="flex">
      <FileExplorer files={files} onSelectFile={() => {}} />
      <div className="flex-1 p-4">
        <QuestionNavigator />
        <QuestionTypes
          question={question}
          answer={answers[question.id]}
          onAnswerChange={(answer) => setAnswer(question.id, answer)}
        />
        <div className="mt-4 flex justify-between">
          <Button
            onClick={() => useExamStore.getState().setCurrentQuestion(currentQuestion - 1)}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() => useExamStore.getState().setCurrentQuestion(currentQuestion + 1)}
            disabled={currentQuestion === currentExam.questions.length - 1}
          >
            Nextthe
          </Button>
          <Button onClick={handleSubmit} disabled={isPending }>
            {isPending  ? 'Submitting...' : 'Submit Exam'}
          </Button>
        </div>
      </div>
    </div>
  );
};
