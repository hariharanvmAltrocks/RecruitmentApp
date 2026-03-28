import React from 'react';
import { ReviewScoreCardQuestion } from '../ReviewScoreCardServies/ReviewScoreCardServices';
import styles from '../ReviewScorecard.module.scss';

interface QuestionnaireTabProps {
    questions: ReviewScoreCardQuestion[];
}

const QuestionnaireTab: React.FC<QuestionnaireTabProps> = ({ questions }) => {
    if (!questions || questions.length === 0) {
        return (
            <div className={styles.questionnaireSection}>
                <h3>Panel Questions</h3>
                <p>No questions available for this position.</p>
            </div>
        );
    }

    return (
        <div className={styles.questionnaireSection}>
            <h3>Panel Questions</h3>
            <div className={styles.questionsList}>
                {questions.map((question, index) => (
                    <div key={question.id} className={styles.questionItem}>
                        <div className={styles.questionHeader}>
                            <span className={styles.questionNumber}>Q{index + 1}</span>
                            <span className={styles.questionText}>{question.question}</span>
                        </div>
                        <div className={styles.questionAnswer}>
                            <strong>Expected Answer:</strong> {question.answer}
                        </div>
                        {question.rating !== null && (
                            <div className={styles.questionRating}>
                                <strong>Rating:</strong> {question.rating}/5
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionnaireTab;