import React from 'react';
import { useParams } from 'react-router-dom';
import { useSubmission } from '../services/examApi';
import { Card } from '../components/common/Card';
import { useAuthStore } from '../stores/authStore';
import { useExams } from '../services/examApi';

export const ExamSummary: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const { user } = useAuthStore();
  const { data: submissionData, isPending: isSubmissionPending } = useSubmission(examId!, user?.id!);
  const { data: examsData, isPending: isExamsPending } = useExams(user?.email || '');

  if (!user) return <div>Please log in</div>;
  if (isSubmissionPending || isExamsPending) return <div>Loading...</div>;
  if (!submissionData?.data || !examsData?.data) return <div>No submission data</div>;

  const exam = examsData.data.find((e) => e.id === examId);
  if (!exam) return <div>Exam not found</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{exam.title} Summary</h2>
      <Card className="p-4">
        <p>Score: {submissionData.data.score ? `${submissionData.data.score}%` : 'Pending'}</p>
        <p>Questions Answered: {Object.keys(submissionData.data.answers).length}</p>
        <p>Duration: {exam.duration} minutes</p>
      </Card>
    </div>
  );
};