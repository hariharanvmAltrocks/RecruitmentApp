import React, { createContext, useContext, useReducer } from 'react';
import ReviewScoreCardServices, { ReviewScoreCardResult, SubmitScorecardParams } from '../ReviewScoreCardServies/ReviewScoreCardServices';

interface ReviewScoreCardState {
    loading: boolean;
    data: ReviewScoreCardResult | null;
    error: string | null;
    submitting: boolean;
    submitResult: { success: boolean; message: string } | null;
    submitError: string | null;
}

interface ReviewScoreCardContextType {
    state: ReviewScoreCardState;
    loadReviewScoreCardData: (candidateId: number, currentUserEmail: string) => Promise<void>;
    submitScorecard: (payload: SubmitScorecardParams) => Promise<void>;
    handleSubmit: (params: SubmitScorecardParams, onSuccess?: () => void) => Promise<void>;
    clearError: () => void;
}

const initialState: ReviewScoreCardState = {
    loading: false,
    data: null,
    error: null,
    submitting: false,
    submitResult: null,
    submitError: null,
};

type ReviewScoreCardAction =
    | { type: 'LOADING' }
    | { type: 'LOAD_SUCCESS'; payload: ReviewScoreCardResult }
    | { type: 'LOAD_ERROR'; payload: string }
    | { type: 'SUBMITTING' }
    | { type: 'SUBMIT_SUCCESS'; payload: { success: boolean; message: string } }
    | { type: 'SUBMIT_ERROR'; payload: string }
    | { type: 'CLEAR_ERROR' };

const reviewScoreCardReducer = (state: ReviewScoreCardState, action: ReviewScoreCardAction): ReviewScoreCardState => {
    switch (action.type) {
        case 'LOADING':
            return { ...state, loading: true, error: null };
        case 'LOAD_SUCCESS':
            return { ...state, loading: false, data: action.payload, error: null };
        case 'LOAD_ERROR':
            return { ...state, loading: false, error: action.payload };
        case 'SUBMITTING':
            return { ...state, submitting: true, submitError: null };
        case 'SUBMIT_SUCCESS':
            return { ...state, submitting: false, submitResult: action.payload, submitError: null };
        case 'SUBMIT_ERROR':
            return { ...state, submitting: false, submitError: action.payload };
        case 'CLEAR_ERROR':
            return { ...state, error: null, submitError: null };
        default:
            return state;
    }
};

const ReviewScoreCardContext = createContext<ReviewScoreCardContextType | undefined>(undefined);

export const ReviewScoreCardProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const [state, dispatch] = useReducer(reviewScoreCardReducer, initialState);

    const loadReviewScoreCardData = async (candidateId: number, currentUserEmail: string) => {
        dispatch({ type: 'LOADING' });
        try {
            const data = await ReviewScoreCardServices.getReviewScoreCardData(candidateId, currentUserEmail);
            dispatch({ type: 'LOAD_SUCCESS', payload: data });
        } catch (error) {
            dispatch({ type: 'LOAD_ERROR', payload: (error as Error).message });
        }
    };

    const submitScorecard = async (payload: SubmitScorecardParams) => {
        dispatch({ type: 'SUBMITTING' });
        try {
            const result = await ReviewScoreCardServices.submitScorecard(payload);
            dispatch({ type: 'SUBMIT_SUCCESS', payload: result });
        } catch (error) {
            dispatch({ type: 'SUBMIT_ERROR', payload: (error as Error).message });
        }
    };

    const handleSubmit = async (params: SubmitScorecardParams, onSuccess?: () => void) => {
        dispatch({ type: 'SUBMITTING' });
        try {
            const result = await ReviewScoreCardServices.submitScorecard(params);
            dispatch({ type: 'SUBMIT_SUCCESS', payload: result });
            if (onSuccess) onSuccess();
        } catch (error) {
            dispatch({ type: 'SUBMIT_ERROR', payload: (error as Error).message });
        }
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    return (
        <ReviewScoreCardContext.Provider value={{
            state,
            loadReviewScoreCardData,
            submitScorecard,
            handleSubmit,
            clearError
        }}>
            {children}
        </ReviewScoreCardContext.Provider>
    );
};

export const useReviewScoreCard = (): ReviewScoreCardContextType => {
    const context = useContext(ReviewScoreCardContext);
    if (context === undefined) {
        throw new Error('useReviewScoreCard must be used within a ReviewScoreCardProvider');
    }
    return context;
};