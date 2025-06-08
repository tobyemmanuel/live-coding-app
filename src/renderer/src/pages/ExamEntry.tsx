import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExam } from '../services/examApi';
import { useExamStore } from '../stores/examStore';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const ExamEntry: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const [studentCode, setStudentCode] = useState('');
  const { mutate: fetchExam, isPending  } = useExam();
  const { setCurrentExam } = useExamStore();
  const navigate = useNavigate();

  const handleSubmit = () => {
    fetchExam({ examId: examId!, studentCode }, {
      onSuccess: ({ data }) => {
        setCurrentExam(data);
        navigate(`/exam/${examId}`);
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">Enter Exam</h2>
        <Input
          value={examId || ''}
          onChange={() => {}}
          placeholder="Exam ID"
          className="mb-4"
          disabled
        />
        <Input
          value={studentCode}
          onChange={setStudentCode}
          placeholder="Student Code"
          className="mb-4"
        />
        <Button onClick={handleSubmit} disabled={isPending }>
          {isPending  ? 'Verifying...' : 'Start Exam'}
        </Button>
      </div>
    </div>
  );
};
