

import SPServices from '../../../../services/SPService/spservice';

import MasterService from '../../../../services/MasterService/MasterService';

import { ListNames } from '../../../../utilities/Config';
import CommonService from '../../SelectionProcess/CommonServices/CommonServices';
import GetPortalJobs from "./QuestionnaireApi/QuestionnaireApi";


const _common = new CommonService();
const _master = new MasterService();
const _questApi = new GetPortalJobs();



export interface EvaluationFormQuestion {
    id: number;
    question: string;
    answer: string;
}

export interface EvaluationFormResult {
    success: boolean;

    candidateId: number;
    applicantName: string;
    nationality: string;
    gender: string;
    qualification: string;
    miningExp: string;
    relevantExp: string;
    interviewDate: string;
    interviewLevel: string;
    disability: string;
    conflictsOfInterest: string;
    positionTitle: string;
    grade: string;
    recruitmentId: number;
    jobCodeId: number;

    panelMembers: string[];
    currentUserPanelId: number | null;
    currentUserGuid: string | null;

    reviewerName: string;
    jobTitleEn: string;
    jobTitleFr: string;

    questions: EvaluationFormQuestion[];
}

export interface SubmitScorecardParams {
    recruitmentId: number;
    panelId: number;
    roleId: number;
    interviewPersonNameId: string;
    qualifications: number | null;
    experience: number | null;
    knowledge: number | null;
    energyLevel: number | null;
    jobRequirements: number | null;
    cultureFit: number | null;
    expatLocal: number | null;
    otherCriteria: number | null;
    recommendation: 'consider' | 'doNotConsider';
    overallFeedback: string;
    questionScores: { id: number; rating: number | null }[];
}


const EMPTY = (candidateId: number): EvaluationFormResult => ({
    success: false, candidateId, applicantName: '', nationality: '', gender: '',
    qualification: '', miningExp: '', relevantExp: '', interviewDate: '',
    interviewLevel: '', disability: '', conflictsOfInterest: '', positionTitle: '',
    grade: '', recruitmentId: 0, jobCodeId: 0, panelMembers: [],
    currentUserPanelId: null, currentUserGuid: null,
    reviewerName: '', jobTitleEn: '', jobTitleFr: '', questions: [],
});


export async function getEvaluationFormData(
    candidateId: number,
    currentUserEmail: string
): Promise<EvaluationFormResult> {
    try {

        const [candidateRows, currentUserGuid] = await Promise.all([
            SPServices.SPReadItems({
                Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
                Select: [
                    'ID', 'FristName', 'MiddleName', 'LastName',
                    'Nationality', 'Gender', 'Qualification',
                    'TotalYearOfExperiance', 'ReleventExperience',
                    'InterviewDate', 'InterviewDateLevel2',
                    'Disability', 'ConflictsOfInterest', 'PositionTitle',
                    'JobGrade', 'JobCodeId',
                    'RecruitmentID/ID', 'JobCode/JobCode', 'JobCode/ID',
                ].join(','),
                Expand: 'RecruitmentID,JobCode',
                Filter: [{ FilterKey: 'ID', Operator: 'eq', FilterValue: candidateId }],
            }),
            _getUserGuid(currentUserEmail),
        ]);

        const raw = (candidateRows as any[])?.[0] ?? {};
        const recruitmentId = raw.RecruitmentID?.ID ?? raw.RecruitmentIDId ?? 0;
        const jobCodeId = raw.JobCodeId ?? raw.JobCode?.ID ?? 0;
        const jobCodeStr = raw.JobCode?.JobCode ?? '';

        const fullName = [raw.FristName, raw.MiddleName, raw.LastName]
            .filter(Boolean).join(' ').trim();
        const interviewDateRaw = raw.InterviewDateLevel2 || raw.InterviewDate || '';
        const interviewDate = interviewDateRaw ? interviewDateRaw.split('T')[0] : '';


        const [panelRows, reviewerRes] = await Promise.all([
            SPServices.SPReadItems({
                Listname: ListNames.HRMSInterviewPanelDetails,
                Select: 'ID,InterviewPanel/Id,InterviewPanel/Title,InterviewPanel/EMail,InterviewLevel,IsScoreSheetUploaded',
                Expand: 'InterviewPanel',
                Filter: [{ FilterKey: 'CandidateID/Id', Operator: 'eq', FilterValue: candidateId }],
            }),

            _master.GetUserDetails(
                [{ FilterKey: 'EmailId', Operator: 'eq', FilterValue: currentUserEmail }],
                'and'
            ),
        ]);

        const currentUserPanel = (panelRows as any[]).find(
            (p: any) => String(p.InterviewPanel?.Id) === String(currentUserGuid)
        );


        const uniqueEmails: string[] = Array.from(new Set(
            (panelRows as any[]).map((p: any) => p.InterviewPanel?.EMail).filter(Boolean)
        ));

        const emailToName: Record<string, string> = {};
        await Promise.all(
            uniqueEmails.map(async (email: string) => {
                try {
                    const res = await _master.GetUserDetails(
                        [{ FilterKey: 'EmailId', Operator: 'eq', FilterValue: email }],
                        'and'
                    );
                    if (res?.data) {
                        const name = [res.data.FirstName, res.data.MiddleName, res.data.LastName]
                            .filter(Boolean).join(' ').trim();
                        if (name) emailToName[email.toLowerCase()] = name;
                    }
                } catch { /* non-fatal */ }
            })
        );

        const panelMembers = (panelRows as any[])
            .map((p: any) => {
                const email = (p.InterviewPanel?.EMail ?? '').toLowerCase();
                return emailToName[email] || p.InterviewPanel?.Title || '';
            })
            .filter(Boolean);


        const reviewer = reviewerRes?.data;
        const reviewerName = reviewer
            ? [reviewer.FirstName, reviewer.MiddleName, reviewer.LastName].filter(Boolean).join(' ').trim()
            : '';
        const jobTitleEn = reviewer?.JopTitleEnglish ?? '';
        const jobTitleFr = reviewer?.JopTitleFrench ?? '';


        let grade = raw.JobGrade ?? '';
        let interviewLevel = raw.InterviewLevel ?? '';
        let questions: EvaluationFormQuestion[] = [];

        const [gradeRes, questionsResult] = await Promise.all([

            grade ? Promise.resolve(null) : _master.GetGradeLevel(raw.JobGrade || jobCodeStr).catch(() => null),

            jobCodeId
                ? _master.GetJobUniqueDataValue(jobCodeId)
                    .then(async (res) => {
                        const key = res?.data?.JobCode ?? '';
                        if (!key) return [];
                        const qRes = await _questApi.getQuestionnaire(key);
                        return (qRes?.data ?? []).map((q: any) => ({
                            id: q.id,
                            question: q.question,
                            answer: q.answer ?? '',
                        }));
                    })
                    .catch(() => [])
                : Promise.resolve([]),
        ]);

        if (!grade && gradeRes?.data) {
            grade = (gradeRes.data as any)?.GradeLevel ?? '';
        }

        if (!interviewLevel) {
            interviewLevel = raw.InterviewLevel || 
                String(raw.JobGrade || '').match(/Level\s*\d+/i)?.[0] ||
                String(gradeRes?.data?.GradeLevel || '').match(/Level\s*\d+/i)?.[0] ||
                '';
        }

        questions = questionsResult as EvaluationFormQuestion[];

        return {
            success: true,
            candidateId,
            applicantName: fullName,
            nationality: raw.Nationality ?? '',
            gender: raw.Gender ?? '',
            qualification: raw.Qualification ?? '',
            miningExp: raw.TotalYearOfExperiance ?? '',
            relevantExp: raw.ReleventExperience ?? '',
            interviewDate,
            interviewLevel,
            disability: raw.Disability ?? raw.disability ?? '',
            conflictsOfInterest: raw.ConflictsOfInterest ?? '',
            positionTitle: raw.PositionTitle ?? '',
            grade,
            recruitmentId,
            jobCodeId,
            panelMembers,
            currentUserPanelId: currentUserPanel?.ID ?? null,
            currentUserGuid,
            reviewerName,
            jobTitleEn,
            jobTitleFr,
            questions,
        };
    } catch (error) {
        console.error('[getEvaluationFormData] error:', error);
        return EMPTY(candidateId);
    }
}


export async function submitScorecard(
    params: SubmitScorecardParams
): Promise<{ success: boolean; message: string }> {
    try {
        const spPayload = {
            RelevantQualification: String(params.qualifications ?? ''),
            ReleventExperience: String(params.experience ?? ''),
            Knowledge: String(params.knowledge ?? ''),
            EnergyLevel: String(params.energyLevel ?? ''),
            MeetJobRequirement: String(params.jobRequirements ?? ''),
            ContributeTowardsCultureRequried: String(params.cultureFit ?? ''),
            Experience: String(params.expatLocal ?? ''),
            OtherCriteriaScore: String(params.otherCriteria ?? ''),
            ConsiderForEmployment:
                params.recommendation === 'consider' ? 'Yes' : 'No',
            OverAllEvaluationFeedback: params.overallFeedback,
            RecruitmentIDId: params.recruitmentId,
            InterviewPanelIDId: params.panelId,
            QuestionJson: JSON.stringify(params.questionScores),
            RoleId: params.roleId ? Number(params.roleId) : null,
            InterviewPersonNameId:
                params.interviewPersonNameId ? Number(params.interviewPersonNameId) : null,
        };

        const response: any = await SPServices.SPAddItem({
            Listname: ListNames.HRMSCandidateScoreCard,
            RequestJSON: spPayload,
        });

        const newId =
            response?.ID ?? response?.Id ??
            response?.data?.ID ?? response?.data?.Id;

        if (newId) {
            await SPServices.SPUpdateItem({
                Listname: ListNames.HRMSInterviewPanelDetails,
                RequestJSON: { IsScoreSheetUploaded: 'Yes' },
                ID: params.panelId,
            });
            return { success: true, message: 'Scorecard submitted successfully!' };
        }

        return { success: false, message: 'Failed to submit scorecard.' };
    } catch (error) {
        console.error('[submitScorecard] error:', error);
        return { success: false, message: 'An error occurred while submitting.' };
    }
}

async function _getUserGuid(email: string): Promise<string | null> {
    try {
        if (!email) return null;
        const res = await _common.getUserGuidByEmail(email);
        if (res?.status === 200 && res?.data?.key) return String(res.data.key);
        return null;
    } catch {
        return null;
    }
}