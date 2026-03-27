import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Users, Calendar, AlertTriangle, Accessibility, CheckCircle, XCircle, Clock, Upload, ChevronDown, FileText, Trash2, Zap, Globe, User, Activity, Check, ChevronRight } from "lucide-react";
import { useFetchCandidateDetails } from "../Hooks/fetchCandidateDetails";
import { RequiredAttachments } from "../../RecruitmentTable/Components/RequiredAttachments";
import { ConflictOfInterestForm, DecisionType, InterviewScheduleForm, useSubmitCandidateReview } from "../Hooks/Usesubmitcandidatereview";
import { useFetchPanelMembers } from "../Hooks/fetchPanelMembers";
import { RoleID, StatusId, workflowStatusApi } from "../../../../utilities/Config";
import { RoleName } from "../../../../utilities/ConditionConfig";
import { useToast } from "../../../Hooks/useToast";
import { IDocFiles } from "../../../../services/SPService/Ispservice";
import { DataSyncToRecruitmentResponse } from "../../../../services/RecruitmentTable/IRecruitmentService";

export interface panelvalues {
  bucodeId: number,
  candidateId: number,
  assignHR: string,
  statusId: string,
  actionID: number,
}

interface ShowCandidateDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  panelParams: panelvalues | null;
  positionDetails: DataSyncToRecruitmentResponse | null;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: "easeOut" } },
  exit: { opacity: 0, y: 16, scale: 0.97, transition: { duration: 0.18 } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.25, ease: "easeOut" },
  }),
};

const SectionHeader: React.FC<{ title: string; subtitle?: string; accent?: "orange" | "blue" | "green" | "red" }> = ({
  title, subtitle, accent = "orange",
}) => {
  const colors = {
    orange: "bg-orange-500",
    blue: "bg-blue-500",
    green: "bg-[#0CAF60]",
    red: "bg-[#FF3B5C]",
  };
  return (
    <div className="flex flex-col mb-5 leading-tight">
      <div className="flex items-center gap-2.5">
        <div className={`w-[4px] h-[18px] rounded-full ${colors[accent]}`} />
        <h3 className="text-[13px] font-bold text-[#1B264E] tracking-widest uppercase">{title}</h3>
      </div>
      {subtitle && <p className="text-[11px] font-semibold text-gray-400 mt-1 pl-[15px]">{subtitle}</p>}
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value?: string | null; icon?: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8E9BBA] uppercase tracking-widest">
      {icon && <span className="text-[#3F62ED]">{icon}</span>}
      {label}
    </div>
    <div className="px-4 py-3 bg-white border border-[#E4E8F1] rounded-[14px] text-sm font-semibold text-[#1B264E] break-words shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      {value ?? "--"}
    </div>
  </div>
);

const QuestionCard: React.FC<{ index: number; question: string; answer?: string | null }> = ({
  index, question, answer,
}) => {
  const isYes = answer?.toLowerCase() === "yes";
  const isNo = answer?.toLowerCase() === "no";
  const toneClass = isYes
    ? "bg-[#e5f7ed] text-[#0CAF60] border-[#0CAF60]/20"
    : isNo
      ? "bg-[#ffebee] text-[#FF3B5C] border-[#FF3B5C]/20"
      : "bg-[#F5F7FA] text-[#8E9BBA] border-[#E4E8F1]";

  return (
    <div className="flex flex-col gap-4 bg-white border border-[#E4E8F1] rounded-2xl p-6 mb-4 shadow-sm w-full">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-[14px] border border-[#E4E8F1] bg-[#F8FAFC]">
          <span className="text-sm font-bold text-[#8E9BBA]">Q{index}</span>
        </div>
        <div className="flex flex-col w-full">
          <h4 className="text-[15px] font-bold text-[#1B264E] leading-relaxed mb-5 pr-2">
            {question}
          </h4>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-[#8E9BBA] uppercase tracking-widest">Answer:</span>
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border ${toneClass}`}>
              {answer ?? "--"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ShowCandidateDetailsPopup: React.FC<ShowCandidateDetailsPopupProps> = ({
  isOpen,
  onClose,
  candidateId,
  panelParams,
  positionDetails
}) => {
  const ReviewHRFlag = panelParams?.statusId === workflowStatusApi.HRPending;
  const ReviewLML1 = panelParams?.statusId === workflowStatusApi.LineManagerL1Pending || panelParams?.statusId === workflowStatusApi.LineManagerLevel1OnHold;
  const ReviewLML2 = panelParams?.statusId === workflowStatusApi.LineManagerL2Pending || panelParams?.statusId === workflowStatusApi.LineManagerLevel2OnHold;
  const PanelMember = panelParams?.statusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview || Number(panelParams?.statusId) === StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel;

  const panelOptionFlag = panelParams?.statusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview || Number(panelParams?.statusId) === StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel || panelParams?.statusId === workflowStatusApi.HRPending

  const isEnabled = !!(panelOptionFlag);

  const { data: paneloptions, loading: panelloading, error } = useFetchPanelMembers(
    positionDetails?.BusinessUnitCodeId ?? 0,
    positionDetails?.AssignEMail ?? "",
    panelParams?.candidateId ?? 0,
    panelParams?.statusId ?? "",
    isEnabled
  );
  const { data, loading } = useFetchCandidateDetails(candidateId);
  console.log(data, "Datatatatata");

  const { toast, closeToast, showSuccess, showError } = useToast();
  const { submitting, submitError, submitSuccess, submit, reset } = useSubmitCandidateReview(showError);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [decision, setDecision] = useState<DecisionType | null>(null);
  const [decisionComments, setDecisionComments] = useState("");
  const [consultoptions, setConsultOptions] = useState<{ value: string, label: string }[]>([]);

  const feedbackOptions = ["Excellent", "Good", "Average", "Below Average", "Poor"];

  const [HRReview, setHRReview] = useState<string>("");
  const [open, setOpen] = useState(false);

  const [coi, setCoi] = useState<ConflictOfInterestForm>({
    consultedWith: "",
    attachment: [],
    comments: "",
  });

  const [level1, setLevel1] = useState<InterviewScheduleForm>({
    panelMembers: [],
    startDate: "",
    endDate: "",
  });

  const [level2, setLevel2] = useState<InterviewScheduleForm>({
    panelMembers: [],
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (isOpen && paneloptions) {
      const Level1Options = paneloptions.Level1.map((item) => item.label);
      const Level2Options = paneloptions.Level2?.map((item) => item.label);

      const filterHODLM = paneloptions.Level1.filter(
        (item) =>
          item.Role === RoleName.LineManager ||
          item.Role === RoleName.HOD ||
          item.Role === RoleName.RecruitmentHR
      );

      const consultOption = filterHODLM.map((item) => ({
        value: String(item.value),
        label: item.label
      }));

      setConsultOptions(consultOption);
      setLevel1({ panelMembers: Level1Options ?? [], startDate: "", endDate: "" });
      setLevel2({ panelMembers: Level2Options ?? [], startDate: "", endDate: "" });
    }
  }, [paneloptions, isOpen]);

  const canSubmit = useMemo(() => {
    if (ReviewHRFlag) {
      if (!HRReview && !decisionComments.trim()) return false;
    }
    if (!decision || !decisionComments.trim()) return false;
    if (data?.ConflictsOfInterest === "Yes") {
      if (!coi.consultedWith || !coi.comments.trim()) return false;
    }
    if (level1.panelMembers.length < 3 || !level1.startDate || !level1.endDate) return false;
    return true;
  }, [decision, decisionComments, coi, level1, data]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const newFile: IDocFiles = {
          name: file.name,
          content: reader.result!,
          type: "New",
        };
        setCoi((prev) => ({ ...prev, attachment: [newFile] }));
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleClearFile = () => {
    setCoi((prev) => ({ ...prev, attachment: [] }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePanelToggle = useCallback((setter: React.Dispatch<React.SetStateAction<InterviewScheduleForm>>, val: string) => {
    setter((prev) => ({
      ...prev,
      panelMembers: prev.panelMembers.includes(val)
        ? prev.panelMembers.filter((v) => v !== val)
        : [...prev.panelMembers, val],
    }));
  }, []);

  const showCOI = data?.ConflictsOfInterest === "Yes";
  const showDisability = data?.disability === "Yes";

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    const L1Panel = paneloptions?.Level1?.map((item) => ({ key: Number(item.value), text: item.Email })) ?? [];
    const L2Panel = paneloptions?.Level2?.map((item) => ({ key: Number(item.value), text: item.Email })) ?? [];

    await submit({
      candidateId: candidateId,
      CandidateDetails: data,
      decision: decision ?? "YES",
      decisionComments: decisionComments,
      interviewLevel1: level1,
      interviewLevel2: level2,
      recrutimentData: positionDetails,
      interviewPanelL1: L1Panel,
      interviewPanelL2: L2Panel,
      HRReviewComents: HRReview,
      COIFlag: showCOI,
      COIDetails: coi,
      StatusId: panelParams?.statusId ?? ""
    });
  }, [data, candidateId, decision, decisionComments, coi, level1, level2, submit, canSubmit]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-[#0C1222]/60 backdrop-blur-sm p-4 md:p-6"
        style={{ zIndex: 2147483647 }}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-[24px] shadow-2xl w-full max-w-[1200px] h-[95vh] max-h-[900px] flex flex-col overflow-hidden relative border border-gray-100"
          variants={cardVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="flex items-start justify-between px-6 py-5 border-b border-[#E4E8F1] flex-shrink-0 bg-white z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F0F4FF] text-[#3F62ED] rounded-2xl flex items-center justify-center">
                <User size={24} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#8E9BBA] uppercase mb-1">
                  <span>Candidate selection</span>
                  <ChevronRight size={12} className="text-[#E4E8F1]" />
                  <span className="text-[#1B264E]">Review Profile</span>
                </div>
                <h2 className="text-xl font-bold text-[#1B264E] leading-tight">Candidate Profile Review</h2>
                <div className="flex items-center gap-2 text-sm text-[#8E9BBA] mt-1">
                  <span className="font-bold text-[#3F62ED] bg-[#F0F4FF] px-2 py-0.5 rounded-[6px] text-[11px] uppercase tracking-wider">{data?.JobCode || '---'}</span>
                  <span className="w-1 h-1 bg-[#E4E8F1] rounded-full" />
                  <span className="text-[13px] font-medium">{data?.JobTitle || '---'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button
                className="p-2.5 text-[#3F62ED] bg-[#F0F4FF] border border-white 
             hover:bg-[#E0E8FF] hover:border-[#E0E8FF] 
             rounded-full transition-colors flex-shrink-0"
                type="button"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
          </header>

          {/* Body */}
          <div className="flex flex-1 overflow-hidden relative bg-white">
            {/* Sidebar */}
            <aside className="w-[280px] flex-shrink-0 bg-white border-r border-[#E4E8F1] overflow-y-auto overflow-x-hidden p-6 scrollbar-thin scrollbar-thumb-gray-200">
              <div className="flex flex-col items-center text-center mb-8 gap-1">
                <div className="w-[72px] h-[72px] bg-[#F0F4FF] text-[#3F62ED] rounded-3xl flex items-center justify-center text-3xl font-bold mb-3 shadow-[0_4px_12px_rgba(63,98,237,0.1)]">
                  {(data?.ApplicantName ?? "A").charAt(0)}
                </div>
                <h3 className="text-[22px] font-extrabold text-[#1B264E] leading-tight tracking-tight">{data?.ApplicantName ?? "--"}</h3>
                <span className="text-[11px] font-bold text-[#3F62ED] tracking-widest uppercase mt-1">
                  {data?.Nationality ?? "--"}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <InfoItem icon={<Globe size={14} />} label="Nationality" value={data?.Nationality} />
                <InfoItem icon={<Users size={14} />} label="Gender" value={data?.Gender} />
                <InfoItem icon={<FileText size={14} />} label="Qualification" value={data?.HighestQualification} />

                <div className="flex flex-row gap-3 w-full">
                  <div className="flex-1 min-w-0">
                    <InfoItem icon={<Zap size={14} />} label="Mining exp." value={data?.ExperienceMining} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <InfoItem icon={<Zap size={14} />} label="Related exp." value={String(data?.ExperRelatedfield)} />
                  </div>
                </div>
                <div className="flex flex-row gap-3 w-full">
                  <div className="flex-1 min-w-0">
                    <InfoItem icon={<AlertTriangle size={14} />} label="Conflicts" value={data?.ConflictsOfInterest ?? "No"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <InfoItem icon={<Accessibility size={14} />} label="Disability" value={data?.disability ?? "No"} />
                  </div>
                </div>
                <div className="flex flex-row gap-3 w-full">
                  <div className="flex-1 min-w-0">
                    <InfoItem label="Tax dependents" value={String(data?.NumberOftax)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <InfoItem label="Current position" value={data?.CurrentPosition} />
                  </div>
                </div>
                <InfoItem label="Group / partner companies" value={data?.hasIvanhoeZijinExperience} />
              </div>

              <div className="mt-8 pt-6 border-t border-[#E4E8F1]">
                <div className="flex items-center gap-2 mb-4 text-[11px] font-bold text-[#8E9BBA] uppercase tracking-widest">
                  <FileText size={14} className="text-[#3F62ED]" /> Attachments
                </div>
                <div className="bg-[#F5F7FA] rounded-2xl p-4 border border-[#E4E8F1]">
                  <RequiredAttachments attachments={data?.OverallAtttachment ?? []} isLoading={loading} />
                </div>
              </div>
            </aside>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 bg-white relative scrollbar-thin scrollbar-thumb-gray-200">
              <motion.section className="mb-12" custom={0} variants={sectionVariants} initial="hidden" animate="visible">
                {/* <SectionHeader title="Interview Questionnaires" subtitle="Panel Assessment Results" accent="orange" /> */}
                <div className="flex flex-col gap-4 w-full min-w-0">
                  <QuestionCard index={1} question="Willing to relocate if not currently living close to the relevant project site/office?" answer={data?.WillingToRelocate} />
                  {data?.previouslyworkedMine && <QuestionCard index={2} question="Has the person previously worked within the Ivanhoe Mines Group?" answer={data?.previouslyworkedMine} />}
                  <QuestionCard index={3} question="Any family or other links with existing employees to declare? (If so, who? Attach detail)" answer={data?.familylinks} />
                  <QuestionCard index={4} question="Any business links to declare? (If so, who? Attach detail)" answer={data?.businesslinks} />
                </div>
              </motion.section>

              {showCOI && (
                <motion.section className="mb-12" custom={1} variants={sectionVariants} initial="hidden" animate="visible">
                  <SectionHeader title="Conflict of interest" accent="red" />
                  <div className="bg-white border border-[#E4E8F1] rounded-3xl p-6 shadow-sm flex flex-col gap-6 w-full min-w-0">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#fff0f2] border border-[#fee2e6] w-[97%] min-w-0">
                      <AlertTriangle className="text-[#FF3B5C] mt-0.5 flex-shrink-0" size={20} />
                      <div className="flex flex-col gap-1 min-w-0 w-[97%]">
                        <span className="text-sm font-bold text-[#FF3B5C]">Conflict of Interest Declared</span>
                        {data?.COIReason && <span className="text-[13px] font-medium text-[#FF3B5C]/80 break-all">{data.COIReason}</span>}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex flex-col gap-2 flex-1 relative">
                        <label className="text-[12px] font-bold text-[#8E9BBA] tracking-widest uppercase">
                          Consulted with <span className="text-[#FF3B5C]">*</span>
                        </label>
                        <div className="relative">
                          <select
                            className="w-full bg-[#F5F7FA] border border-[#E4E8F1] rounded-[16px] px-5 py-3.5 text-sm font-semibold text-[#1B264E] appearance-none focus:outline-none focus:ring-2 focus:ring-[#3F62ED] focus:bg-white cursor-pointer pr-10 transition-all shadow-sm"
                            value={coi.consultedWith}
                            onChange={(e) => setCoi((p) => ({ ...p, consultedWith: e.target.value }))}
                          >
                            <option value="">Select...</option>
                            {consultoptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8E9BBA] pointer-events-none" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 flex-1">
                        <label className="text-[12px] font-bold text-[#8E9BBA] tracking-widest uppercase">
                          Proof of discussion <span className="text-[#FF3B5C]">*</span>
                        </label>
                        {coi.attachment.length === 0 ? (
                          <button
                            type="button"
                            className="flex items-center gap-4 border-[1.5px] border-dashed border-[#8E9BBA]/40 rounded-[16px] p-3 bg-[#F5F7FA] hover:bg-white hover:border-[#3F62ED]/50 transition-colors cursor-pointer w-full text-left"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <div className="w-10 h-10 bg-white border border-[#E4E8F1] rounded-full flex items-center justify-center text-[#3F62ED] shadow-sm flex-shrink-0">
                              <Upload size={18} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[13px] font-bold text-[#1B264E]">Click to upload</span>
                              <span className="text-[11px] font-semibold text-[#8E9BBA]">PDF, DOC, DOCX, PNG, JPG</span>
                            </div>
                          </button>
                        ) : (
                          <div className="flex items-center justify-between p-3 pl-4 bg-white border-[1.5px] border-[#E4E8F1] rounded-[16px] shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#F0F4FF] rounded-full flex items-center justify-center text-[#3F62ED]">
                                <FileText size={18} />
                              </div>
                              <div className="flex flex-col w-[160px] lg:w-[220px]">
                                <span className="text-[13px] font-bold text-[#1B264E] truncate">{coi.attachment[0].name}</span>
                                <span className="text-[11px] font-bold text-[#0CAF60] flex items-center gap-1 uppercase tracking-widest mt-0.5">
                                  <CheckCircle size={12} /> Ready to submit
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="w-8 h-8 flex items-center justify-center text-[#8E9BBA] hover:text-[#FF3B5C] hover:bg-[#fff0f2] rounded-full transition-colors"
                              onClick={handleClearFile}
                              aria-label="Remove file"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx,.png,.jpg"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full max-w-full">
                      <label className="text-[12px] font-bold text-[#8E9BBA] tracking-widest uppercase">
                        Reason / Comments <span className="text-[#FF3B5C]">*</span>
                      </label>
                      <div className="relative w-full">
                        <textarea
                          className="w-full box-border bg-[#F5F7FA] border border-[#E4E8F1] rounded-[20px] px-5 py-4 text-[14px] font-medium text-[#1B264E] focus:outline-none focus:ring-2 focus:ring-[#3F62ED] focus:bg-white resize-none min-h-[120px] transition-all"
                          maxLength={256}
                          placeholder="Enter your comments (max 256 characters)..."
                          value={coi.comments}
                          onChange={(e) => setCoi((p) => ({ ...p, comments: e.target.value }))}
                        />
                        <span className="absolute bottom-4 right-5 text-[11px] font-bold text-[#8E9BBA]">{coi.comments.length}/256</span>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}

              {showDisability && (
                <motion.section className="mb-12" custom={2} variants={sectionVariants} initial="hidden" animate="visible">
                  <SectionHeader title="Disability" accent="blue" />
                  <div className="bg-white border border-[#E4E8F1] rounded-[24px] p-6 shadow-sm flex flex-col gap-4 w-full min-w-0">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[12px] font-bold text-[#8E9BBA] tracking-widest uppercase">Disability status</span>
                      <span className="text-[15px] font-bold text-[#1B264E]">{data?.disability ?? "--"}</span>
                    </div>
                    {data?.disability && (
                      <div className="flex flex-col gap-1.5 pt-4 border-t border-[#E4E8F1] min-w-0 w-full">
                        <span className="text-[12px] font-bold text-[#8E9BBA] tracking-widest uppercase">Comments</span>
                        <span className="text-[15px] font-medium text-[#1B264E] break-all">{data.disabilityReason}</span>
                      </div>
                    )}
                  </div>
                </motion.section>
              )}

              {ReviewHRFlag && (
                <motion.section className="mb-12" custom={4} variants={sectionVariants} initial="hidden" animate="visible">
                  <SectionHeader title="HR Review Feedback" accent="green" />
                  <div className="w-full md:w-1/2 min-w-0">
                    <label className="block text-[12px] font-bold text-[#8E9BBA] tracking-widest uppercase mb-2">
                      Review Profile Feedback - HR <span className="text-[#FF3B5C]">*</span>
                    </label>
                    <div className="relative dropdown block">
                      <div
                        className={`w-full flex items-center justify-between bg-[#F5F7FA] border ${open ? 'border-[#3F62ED] ring-2 ring-[#3F62ED]/10' : 'border-[#E4E8F1]'} rounded-[16px] px-5 py-3.5 text-[14px] font-semibold cursor-pointer transition-all shadow-sm`}
                        onClick={() => setOpen(!open)}
                      >
                        <span className={HRReview ? "text-[#1B264E]" : "text-[#8E9BBA]"}>
                          {HRReview || "Select feedback"}
                        </span>
                        <ChevronDown size={18} className={`text-[#8E9BBA] transition-transform ${open ? "rotate-180" : ""}`} />
                      </div>
                      <AnimatePresence>
                        {open && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-20 w-full mt-2 bg-white border border-[#E4E8F1] rounded-[16px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden py-2"
                          >
                            {feedbackOptions.map((option, index) => (
                              <div
                                key={index}
                                onClick={() => { setHRReview(option); setOpen(false); }}
                                className={`px-5 py-3 text-[14px] font-semibold cursor-pointer transition-colors ${HRReview === option ? "bg-[#F0F4FF] text-[#3F62ED]" : "text-[#1B264E] hover:bg-[#F5F7FA]"}`}
                              >
                                {option}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.section>
              )}

              {PanelMember && (
                <>
                  <motion.section className="mb-12" custom={3} variants={sectionVariants} initial="hidden" animate="visible">
                    <SectionHeader title="Interview schedule - Level 1" accent="blue" />
                    <InterviewScheduleInput
                      form={level1}
                      onChange={setLevel1}
                      panelOptions={(paneloptions?.Level1 ?? []).map((item) => ({ value: String(item.value), label: item.label }))}
                      onToggleMember={(val) => handlePanelToggle(setLevel1, val)}
                      minPanelCount={3}
                    />
                  </motion.section>

                  <motion.section className="mb-12" custom={4} variants={sectionVariants} initial="hidden" animate="visible">
                    <SectionHeader title="Interview schedule - Level 2" accent="green" />
                    <InterviewScheduleInput
                      form={level2}
                      onChange={setLevel2}
                      panelOptions={(paneloptions?.Level2 ?? []).map((item) => ({ value: String(item.value), label: item.label }))}
                      onToggleMember={(val) => handlePanelToggle(setLevel2, val)}
                      minPanelCount={3}
                    />
                  </motion.section>
                </>
              )}

              <motion.section className="mb-8" custom={5} variants={sectionVariants} initial="hidden" animate="visible">
                <div className="bg-white border border-[#E4E8F1] rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col w-full min-w-0">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="text-[#EA7A08] mt-5">
                      <Zap size={28} fill="currentColor" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-[22px] font-extrabold text-[#1B264E] leading-tight tracking-tight">Do you wish to select this candidate?</h3>
                      <p className="text-[14px] font-medium text-[#8E9BBA]">
                        As LM, please review the evaluation above and provide your final decision.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full">
                    {[
                      { key: "YES", label: "YES, SELECT", icon: <CheckCircle size={36} strokeWidth={2} className={decision === "YES" ? "text-white" : "text-[#0CAF60]"} />, activeBg: "bg-[#0CAF60]", borderColor: "border-[#0CAF60]/40", hoverBg: "hover:bg-[#f2fbf4]", activeText: "text-white", inactiveText: "text-[#0CAF60]", activeShadow: "shadow-[0_8px_20px_rgba(12,175,96,0.3)]" },
                      { key: "NO", label: "NO, REJECT", icon: <XCircle size={36} strokeWidth={2} className={decision === "NO" ? "text-white" : "text-[#FF3B5C]"} />, activeBg: "bg-[#FD3C54]", borderColor: "border-[#FF3B5C]/40", hoverBg: "hover:bg-[#fff0f2]", activeText: "text-white", inactiveText: "text-[#FF3B5C]", activeShadow: "shadow-[0_8px_20px_rgba(253,60,84,0.3)]" },
                      { key: "HOLD", label: "ON HOLD", icon: <Activity size={36} strokeWidth={2} className={decision === "HOLD" ? "text-white" : "text-[#EA7A08]"} />, activeBg: "bg-[#EA7A08]", borderColor: "border-[#EA7A08]/40", hoverBg: "hover:bg-[#fffaf0]", activeText: "text-white", inactiveText: "text-[#EA7A08]", activeShadow: "shadow-[0_8px_20px_rgba(234,122,8,0.4)]" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        className={`flex flex-col flex-1 min-w-0 items-center justify-center gap-3 py-7 px-4 rounded-[24px] border-[1.5px] transition-all duration-300 outline-none ${decision === opt.key
                          ? `${opt.activeBg} border-transparent ${opt.activeShadow} scale-[1.02]`
                          : `bg-white ${opt.borderColor} ${opt.hoverBg}`
                          }`}
                        onClick={() => setDecision(opt.key as DecisionType)}
                      >
                        {opt.icon}
                        <span className={`font-bold tracking-widest text-[12px] uppercase ${decision === opt.key ? opt.activeText : opt.inactiveText}`}>
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 w-full">
                    <label className="text-[11px] font-extrabold text-[#FF3B5C] tracking-widest uppercase">
                      <span className="text-[#8E9BBA]">LM decision justification / comments</span> *
                    </label>
                    <textarea
                      className="w-full box-border bg-[#FCFDFE] border-[1.5px] border-[#E4E8F1]/80 rounded-[20px] px-6 py-5 text-[14px] font-medium text-[#1B264E] focus:outline-none focus:ring-2 focus:ring-[#3F62ED]/50 resize-none min-h-[140px] placeholder:text-[#8E9BBA] transition-colors shadow-sm"
                      placeholder="Provide your final decision rationale..."
                      value={decisionComments}
                      onChange={(e) => setDecisionComments(e.target.value)}
                    />
                  </div>

                  {submitError && <p className="mt-5 text-[13px] font-bold text-[#FF3B5C] text-center">{submitError}</p>}
                  {submitSuccess && <p className="mt-5 text-[13px] font-bold text-[#0CAF60] text-center">Submitted successfully!</p>}
                </div>
              </motion.section>
            </div>
          </div>

          {/* Footer */}
          <footer className="flex items-center justify-end gap-4 px-8 py-5 border-t border-[#E4E8F1] bg-white z-20 flex-shrink-0">
            <button
              type="button"
              className="px-8 py-3 text-[13px] font-extrabold text-[#1B264E] tracking-widest uppercase bg-white border-[1.5px] border-transparent hover:border-[#3F62ED]/40 hover:bg-[#F0F4FF] hover:text-[#3F62ED] rounded-[16px] transition-all"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`flex items-center gap-2 px-8 py-3 text-[13px] font-extrabold tracking-widest uppercase rounded-[16px] border-[1.5px] transition-all ${canSubmit && !submitting
                ? "bg-[#3F62ED] border-[#3F62ED] hover:bg-white hover:text-[#3F62ED] text-white shadow-[0_8px_16px_rgba(63,98,237,0.2)] hover:shadow-none"
                : "bg-[#F5F7FA] text-[#8E9BBA] cursor-not-allowed border border-[#E4E8F1]"
                }`}
              disabled={!canSubmit || submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                "Submitting..."
              ) : (
                <>
                  <CheckCircle size={16} />
                  Submit action
                </>
              )}
            </button>
          </footer>

          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 rounded-[24px]" style={{ zIndex: 2147483647 }}>
              <div className="w-10 h-10 border-4 border-[#E4E8F1] border-t-[#3F62ED] rounded-full animate-spin" />
              <div className="text-[14px] font-bold text-[#1B264E] tracking-widest uppercase">Loading details...</div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface InterviewScheduleInputProps {
  form: InterviewScheduleForm;
  onChange: React.Dispatch<React.SetStateAction<InterviewScheduleForm>>;
  panelOptions: { value: string; label: string }[];
  onToggleMember: (val: string) => void;
  minPanelCount?: number;
}

const InterviewScheduleInput: React.FC<InterviewScheduleInputProps> = ({
  form, onChange, panelOptions, onToggleMember, minPanelCount = 3,
}) => {
  const needsMore = form.panelMembers.length < minPanelCount;

  return (
    <div className="flex flex-col gap-6 w-full min-w-0">
      <div className="flex flex-col gap-3">
        <label className="text-[12px] font-bold text-[#8E9BBA] tracking-widest uppercase">
          Interview panel members <span className="text-[#FF3B5C]">*</span>
        </label>
        <div className="flex flex-wrap gap-2.5">
          {panelOptions.map((opt) => {
            const selected = form.panelMembers.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-[13px] font-bold transition-all border-[1.5px] ${selected
                  ? "bg-[#F0F4FF] border-[#3F62ED]/30 text-[#3F62ED] shadow-sm"
                  : "bg-white border-[#E4E8F1] text-[#1B264E] hover:border-[#8E9BBA]/40 hover:bg-[#F5F7FA]"
                  }`}
                onClick={() => onToggleMember(opt.value)}
              >
                {selected && <CheckCircle size={16} className="text-[#3F62ED]" />}
                {opt.label}
              </button>
            );
          })}
        </div>
        {needsMore && (
          <span className="text-[11px] font-bold text-[#FF9B00] tracking-wider mt-1">
            Please select at least {minPanelCount} panel members • {form.panelMembers.length} selected
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-5 w-full">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <label className="text-[12px] font-bold text-[#8E9BBA] tracking-widest uppercase">Start date & time <span className="text-[#FF3B5C]">*</span></label>
          <input
            type="datetime-local"
            className="w-full box-border bg-[#F5F7FA] border border-[#E4E8F1] rounded-[16px] px-5 py-3.5 text-[14px] font-semibold text-[#1B264E] focus:outline-none focus:ring-2 focus:ring-[#3F62ED] focus:bg-white transition-colors shadow-sm"
            value={form.startDate}
            onChange={(e) => onChange((p) => ({ ...p, startDate: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <label className="text-[12px] font-bold text-[#8E9BBA] tracking-widest uppercase">End date & time <span className="text-[#FF3B5C]">*</span></label>
          <input
            type="datetime-local"
            className="w-full box-border bg-[#F5F7FA] border border-[#E4E8F1] rounded-[16px] px-5 py-3.5 text-[14px] font-semibold text-[#1B264E] focus:outline-none focus:ring-2 focus:ring-[#3F62ED] focus:bg-white transition-colors shadow-sm"
            value={form.endDate}
            min={form.startDate}
            onChange={(e) => onChange((p) => ({ ...p, endDate: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );
};
