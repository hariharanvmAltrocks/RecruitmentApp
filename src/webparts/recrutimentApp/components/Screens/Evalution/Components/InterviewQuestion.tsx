import * as React from 'react';
import type { Answer, InterviewQuestion } from '../State/CommonStateManagement';
import styles from './InterviewQuestion.module.scss';

interface InterviewQuestionListProps {
  questions: InterviewQuestion[];
  answers: Record<string, Answer>;
  onAnswerChange: (questionId: string, patch: Partial<Answer>) => void;
}

const ratingScale = [1, 2, 3, 4, 5];

export default function InterviewQuestionList({ questions, answers, onAnswerChange }: InterviewQuestionListProps): JSX.Element {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Interview Questions</h3>
          <p className="text-xs text-slate-500">Rate each response and capture remarks</p>
        </div>
        <div className="text-[10px] text-slate-400 uppercase tracking-widest">1-5 Scale</div>
      </div>

      <div className="flex flex-col gap-5">
        {questions.map((question, index) => {
          const answer = answers[question.id];
          return (
            <div key={question.id} className={`rounded-2xl border border-slate-100 p-5 bg-slate-50 ${styles.questionCard}`}>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{question.text}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {ratingScale.map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => onAnswerChange(question.id, { rating })}
                        className={
                          rating === answer?.rating
                            ? 'px-3 py-1.5 rounded-lg bg-white text-blue-600 text-xs font-bold shadow-sm border border-blue-200'
                            : 'px-3 py-1.5 rounded-lg bg-white text-slate-400 text-xs font-bold border border-slate-200 hover:border-blue-200 hover:text-blue-500 transition-colors'
                        }
                      >
                        {rating}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={answer?.remarks ?? ''}
                    onChange={(event) => onAnswerChange(question.id, { remarks: event.target.value })}
                    placeholder="Add interviewer remarks"
                    className="mt-4 w-full min-h-[90px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
