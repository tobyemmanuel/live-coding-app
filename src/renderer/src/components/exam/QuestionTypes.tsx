import React from 'react'
import { Question } from '../../types/exam'
import { Input } from '../common/Input'
import { CodeEditor } from './CodeEditor'

interface QuestionTypesProps {
  question: Question
  answer: any
  onAnswerChange: (answer: any) => void
}

export const QuestionTypes: React.FC<QuestionTypesProps> = ({
  question,
  answer,
  onAnswerChange,
}) => {
  switch (question.type) {
    case 'mcq':
      return (
        <div>
          <p className="mb-2">{question.content}</p>
          {question.options?.map((option, index) => (
            <label key={index} className="block">
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={answer === option}
                onChange={() => onAnswerChange(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      )
    case 'checkbox':
      return (
        <div>
          <p className="mb-2">{question.content}</p>
          {question.options?.map((option, index) => (
            <label key={index} className="block">
              <input
                type="checkbox"
                value={option}
                checked={Array.isArray(answer) && answer.includes(option)}
                onChange={(e) => {
                  const newAnswer = Array.isArray(answer) ? [...answer] : []
                  if (e.target.checked) {
                    newAnswer.push(option)
                  } else {
                    newAnswer.splice(newAnswer.indexOf(option), 1)
                  }
                  onAnswerChange(newAnswer)
                }}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      )
    case 'textbox':
      return (
        <div>
          <p className="mb-2">{question.content}</p>
          <Input
            type="text"
            value={answer || ''}
            onChange={onAnswerChange}
            placeholder="Enter your answer"
            className="w-full"
          />
        </div>
      )
    case 'rating':
      return (
        <div>
          <p className="mb-2">{question.content}</p>
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="mr-2">
              <input
                type="radio"
                name={question.id}
                value={value}
                checked={answer === value}
                onChange={() => onAnswerChange(value)}
                className="mr-1"
              />
              {value}
            </label>
          ))}
        </div>
      )
    case 'coding':
      return (
        <div>
          <p className="mb-2">{question.content}</p>
          <CodeEditor value={answer || ''} onChange={onAnswerChange} />
        </div>
      )
    case 'media':
      return (
        <div>
          <p className="mb-2">{question.content}</p>
          {question.mediaUrl?.endsWith('.mp4') ? (
            <video src={question.mediaUrl} controls className="mb-2 w-full" />
          ) : (
            <img
              src={question.mediaUrl}
              alt="Question media"
              className="mb-2 w-full"
            />
          )}
          <Input
            type="text"
            value={answer || ''}
            onChange={onAnswerChange}
            placeholder="Enter your answer"
            className="w-full"
          />
        </div>
      )
    default:
      return null
  }
}
