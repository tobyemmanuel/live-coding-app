import React from 'react';
import { Question } from '../../types/exam';
import { Input } from '../common/Input';
import { CodeEditor } from './CodeEditor';

interface QuestionTypesProps {
  question: Question;
  answer: any;
  onAnswerChange: (answer: any) => void;
}

export const QuestionTypes: React.FC<QuestionTypesProps> = ({
  question,
  answer,
  onAnswerChange,
}) => {
  switch (question.type) {
    case 'mcq':
      return (
        <div className="space-y-4">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p>{question.content}</p>
          </div>
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label 
                key={index} 
                className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answer === option}
                  onChange={() => onAnswerChange(option)}
                  className="mt-1 text-accent-primary focus:ring-accent-primary"
                />
                <span className="text-text-light dark:text-text-dark">{option}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case 'checkbox':
      return (
        <div className="space-y-4">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p>{question.content}</p>
          </div>
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label 
                key={index} 
                className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(answer) && answer.includes(option)}
                  onChange={(e) => {
                    const newAnswer = Array.isArray(answer) ? [...answer] : [];
                    if (e.target.checked) {
                      newAnswer.push(option);
                    } else {
                      newAnswer.splice(newAnswer.indexOf(option), 1);
                    }
                    onAnswerChange(newAnswer);
                  }}
                  className="mt-1 text-accent-primary focus:ring-accent-primary"
                />
                <span className="text-text-light dark:text-text-dark">{option}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case 'textbox':
      return (
        <div className="space-y-4">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p>{question.content}</p>
          </div>
          <Input
            type="text"
            value={answer || ''}
            onChange={onAnswerChange}
            placeholder="Enter your answer..."
            className="w-full"
          />
        </div>
      );

    case 'rating':
      return (
        <div className="space-y-4">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p>{question.content}</p>
          </div>
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <label 
                key={value} 
                className="flex items-center space-x-2 p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={value}
                  checked={answer === value}
                  onChange={() => onAnswerChange(value)}
                  className="text-accent-primary focus:ring-accent-primary"
                />
                <span className="text-text-light dark:text-text-dark font-medium">{value}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case 'coding':
      return (
        <div className="space-y-4">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p>{question.content}</p>
          </div>
          <div className="h-96">
            <CodeEditor 
              value={answer || ''} 
              onChange={onAnswerChange}
              files={['solution.js', 'test.js', 'package.json']}
            />
          </div>
        </div>
      );

    case 'media':
      return (
        <div className="space-y-4">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p>{question.content}</p>
          </div>
          <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            {question.mediaUrl?.endsWith('.mp4') ? (
              <video src={question.mediaUrl} controls className="w-full" />
            ) : (
              <img
                src={question.mediaUrl}
                alt="Question media"
                className="w-full h-auto"
              />
            )}
          </div>
          <textarea
            value={answer || ''}
            onChange={onAnswerChange}
            placeholder="Enter your answer based on the media above..."
            className="w-full"
          />
        </div>
      );

    default:
      return null;
  }
};