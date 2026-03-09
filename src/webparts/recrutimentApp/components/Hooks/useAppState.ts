import { useState } from 'react';
import { SelectionDecision, TabType, ViewType } from '../../models';

export function useAppState() {
  const [activeMetric, setActiveMetric] = useState('hod-review');
  const [view, setView] = useState<ViewType>('dashboard');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('Review Advert');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [advertLang, setAdvertLang] = useState<'EN' | 'FR'>('EN');
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [showEvaluationAlert, setShowEvaluationAlert] = useState(false);
  const [alertInterviewDate, setAlertInterviewDate] = useState('');
  const [isSelectionDrawerOpen, setIsSelectionDrawerOpen] = useState(false);
  const [selectedJobForSelection, setSelectedJobForSelection] = useState<any>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [reviewingCandidate, setReviewingCandidate] = useState<any>(null);
  const [selectionDecision, setSelectionDecision] = useState<SelectionDecision>(null);
  const [selectionComments, setSelectionComments] = useState('');

  const openReviewDrawer = (job: any) => {
    setSelectedJob(job);
    setIsDrawerOpen(true);
    setIsAcknowledged(false);
  };

  const closeReviewDrawer = () => setIsDrawerOpen(false);

  const openSelectionDrawer = (job: any) => {
    setSelectedJobForSelection(job);
    setIsSelectionDrawerOpen(true);
    setSelectedCandidateId(null);
    setReviewingCandidate(null);
    setSelectionDecision(null);
    setSelectionComments('');
  };

  const closeSelectionDrawer = () => setIsSelectionDrawerOpen(false);

  return {
    activeMetric, setActiveMetric,
    view, setView,
    selectedJob, setSelectedJob,
    selectedApplicant, setSelectedApplicant,
    activeTab, setActiveTab,
    isDrawerOpen, openReviewDrawer, closeReviewDrawer,
    advertLang, setAdvertLang,
    isAcknowledged, setIsAcknowledged,
    showEvaluationAlert, setShowEvaluationAlert,
    alertInterviewDate, setAlertInterviewDate,
    isSelectionDrawerOpen, openSelectionDrawer, closeSelectionDrawer,
    selectedJobForSelection,
    selectedCandidateId, setSelectedCandidateId,
    reviewingCandidate, setReviewingCandidate,
    selectionDecision, setSelectionDecision,
    selectionComments, setSelectionComments,
  };
}
