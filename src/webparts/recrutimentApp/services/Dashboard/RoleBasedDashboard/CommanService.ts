import moment from "moment";
import { ISummaryCardItem } from "../../../components/Screens/Dashboard/DashboardComman/CommonSummaryCards";
import { ListNames, StatusId, workflowStatusApi } from "../../../utilities/Config";
import SPServices from "../../SPService/spservice";
import { IDueMonth, IHRLeadSummary, IHRSummary, IMonthlyTrackerItem, IPositionsJobRole, IPositionSource, IPositionStatus } from "../../../components/Screens/Dashboard/Types";
import { CommonServices } from "../../ServiceExport";
import { currentDate, getDueMonthRatio, getMonthDifference, groupedHR, groupedHRLead, isFiveMonthsBeforeCurrent } from "./DashboardConfig";
import { getProfileData } from "../../AxiosService/CareerPortalAPI";

export const GetOpenRecruitmentData = async (email: string, FilterColumnName: string) => {

    return await SPServices.batchGet([
        {
          StateValue: 1,
          ListName: ListNames.HRMSRecruitmentDeptOpenings,
          select: ["*", "Department/DepartmentName"],
          expand: ["Department"],
        },
        {
          StateValue: 2,
          ListName: ListNames.HRMSRecruitmentDptDetails,
          select: [
            "*",
            "JobCode/JobCode",
            "JobCode/JobTitleInEnglish",
            "JobCode/ID",
            "Department/DepartmentName",
            "Status/StatusDescription",
          ],
        //    Filter: [
        //     {
        //         FilterKey: FilterColumnName,
        //         Operator: "eq",
        //         FilterValue: email
        //     }
        // ],
          expand: ["JobCode", "Department", "Status"]
        },
      ]) as any[];

}

export const GetRecruitmentData = async (email: string, FilterColumnName: string) => {

    return await SPServices.SPReadItems({

        Listname: ListNames.HRMSRecruitmentDptDetails,

        Select: `
            *,
            JobCode/JobCode,
            JobCode/JobTitleInEnglish,
            Department/DepartmentName,
            Status/StatusDescription
        `,

        Expand:
            "JobCode,Department,Status",

        Filter: [
            {
                FilterKey: FilterColumnName,
                Operator: "eq",
                FilterValue: email
            }
        ],

        Topcount: 5000

    }) as any[];

}

export const GetCandidateData = async (recruitments: any[]) => {

    const ids =
        recruitments.map(x => x.ID);

    if (!ids.length)
        return [];

    return await SPServices.SPReadItems({

        Listname:
            ListNames.HRMSRecruitmentCandidatePersonalDetails,

        Select: "*",

        Filter: [
            {
                FilterKey: "RecruitmentIDId",
                Operator: "in",
                FilterValue: ids
            }
        ],

        Topcount: 5000

    }) as any[];

}

export const GetSelectedCandiadtesData = async (candidates: any[]) => {

    const ids =
        candidates.map(x => x.ID);

    if (!ids.length)
        return [];

    return await SPServices.SPReadItems({

        Listname:
            ListNames.HRMSSelectedCandidateDetailsByHOD,

        Select: "*",

        Filter: [
            {
                FilterKey: "CandidateIDId",
                Operator: "in",
                FilterValue: ids
            }
        ],

        Topcount: 5000

    }) as any[];

}

export const HODBuildSummary = (
    recruitments: any[],
    candidates: any[]
): ISummaryCardItem[] => {

    const total =
        recruitments.length;

    const filled =
        recruitments.filter(x =>
            Number(x.StatusId) === StatusId.Onboarded
        ).length;

    const open =
        total - filled;

    const active =
        candidates.filter(x =>
            Number(x.StatusId) !== StatusId.Onboarded
        ).length;


    const pending =
        candidates.filter(x =>
            Number(x.StatusId) === StatusId.InterviewInProcess ||
            Number(x.StatusId) === StatusId.InterviewLevel1InProgress ||
            Number(x.StatusId) === StatusId.InterviewLevel2InProgress ||
            Number(x.StatusId) === StatusId.PendingwithpositionIDAssignmentWithHOD ||
            Number(x.StatusId) === StatusId.pendingL2shorlistingwithHOD ||
            Number(x.StatusId) === StatusId.CandidateOnHoldbyHODLevel1 ||
            Number(x.StatusId) === StatusId.CandidateOnHoldbyHODLevel2 ||
            Number(x.StatusId) === StatusId.OnHoldbyHOD
        ).length;

    const interviewsThisMonthCount = candidates.filter((c) => {
        const isCurrentMonth =
            (c.InterviewDate && moment(c.InterviewDate).isSame(moment(), "month")) ||
            (c.InterviewDateLevel2 && moment(c.InterviewDateLevel2).isSame(moment(), "month"));
        const isValidStatus = [
            StatusId.InterviewInProcess,
            StatusId.InterviewLevel1InProgress,
            StatusId.InterviewLevel2InProgress,
        ].includes(Number(c.StatusId));
        return isCurrentMonth && isValidStatus;
    }).length;

    return [
        {
            id: "total",
            title: "Total Positions",
            value: total,
            trendText: `${filled} Filled`,
            trendType: "success",
            iconName: "Users"
        },
        {
            id: "filled",
            title: "Filled Positions",
            value: filled,
            trendText: `${Math.round(filled / total * 100)}%`,
            trendType: "success",
            iconName: "UserCheck"
        },
        {
            id: "open",
            title: "Open Positions",
            value: open,
            trendText: `${open} Remaining`,
            trendType: "danger",
            iconName: "Briefcase"
        },
        {
            id: "candidate",
            title: "Active Candidates",
            value: active,
            trendText: "In Process",
            trendType: "warning",
            iconName: "Users"
        },
        {
            id: "Interview",
            title: "Interviews This Month",
            value: interviewsThisMonthCount,
            trendText: "Scheduled Interviews",
            trendType: "neutral",
            iconName: "Users"
        },
    ];

}

export const HRBuildSummary = (
    recruitments: any[],
    candidates: any[]
): ISummaryCardItem[] => {

    const total =
        recruitments.length;

    const filled =
        recruitments.filter(x =>
            Number(x.StatusId) === StatusId.Onboarded
        ).length;

    const open =
        total - filled;

    const active =
        candidates.filter(x =>
             Number(x.StatusId) !== StatusId.Onboarded || 
        Number(x.StatusId) !== StatusId.RejectedbyHOD || 
        Number(x.StatusId) !== StatusId.CandidateRejectedbyHODLevel1 || 
        Number(x.StatusId) !== StatusId.CandidateRejectedbyHODLevel2
        ).length;


    const interviewsThisMonthCount = candidates.filter((c) => {
        const isCurrentMonth =
            (c.InterviewDate && moment(c.InterviewDate).isSame(moment(), "month")) ||
            (c.InterviewDateLevel2 && moment(c.InterviewDateLevel2).isSame(moment(), "month"));

        const isValidStatus = [
            StatusId.InterviewInProcess,
            StatusId.InterviewLevel1InProgress,
            StatusId.InterviewLevel2InProgress,
        ].includes(Number(c.StatusId));

        return isCurrentMonth && isValidStatus;
    }).length;

    return [

        {
            id: "total",
            title: "Total Positions",
            value: total,
            trendText: `${filled} Filled`,
            trendType: "success",
            iconName: "Users"
        },

        {
            id: "filled",
            title: "Filled Positions",
            value: filled,
            trendText: `${Math.round(filled / total * 100)}%`,
            trendType: "success",
            iconName: "UserCheck"
        },

        {
            id: "open",
            title: "Open Positions",
            value: open,
            trendText: `${open} Remaining`,
            trendType: "danger",
            iconName: "Briefcase"
        },

        {
            id: "candidate",
            title: "Active Candidates",
            value: active,
            trendText: "In Process",
            trendType: "warning",
            iconName: "Users"
        },
        {
            id: "Interview",
            title: "Interviews This Month",
            value: interviewsThisMonthCount,
            trendText: "Scheduled Interviews",
            trendType: "neutral",
            iconName: "Users"
        },

    ];

}

export const SeniorHRBuildSummary = (
    openrecruitment: any[],
    recruitments: any[],
    candidates: any[],
): ISummaryCardItem[] => {

    const filteredOpenRecruitment = openrecruitment.filter((item) =>
        isFiveMonthsBeforeCurrent(item?.DateRequried)
    );

    const total =
        recruitments.length + filteredOpenRecruitment.length;

    const filled =
        recruitments.filter(x =>
            Number(x.StatusId) === StatusId.Onboarded
        ).length;

    const open =
        total - filled;

    const HRLeads = Object.keys(groupedHRLead(recruitments)).length;
    const HR = Object.keys(groupedHR(recruitments)).length;

    const COICandidate = candidates.filter((item) => item.ConflictsOfInterest === "Yes").length;

    return [

        {
            id: "total",
            title: "Total Positions",
            value: total,
            trendText: `${filled} Filled`,
            trendType: "success",
            iconName: "Users"
        },

        {
            id: "filled",
            title: "Filled Positions",
            value: filled,
            trendText: `${total > 0 ? Math.round((filled / total) * 100) : 0}%`,
            trendType: "success",
            iconName: "UserCheck"
        },

        {
            id: "open",
            title: "Open Positions",
            value: open,
            trendText: `${open} Remaining`,
            trendType: "danger",
            iconName: "Briefcase"
        },

        {
            id: "candidate",
            title: "Total Recruitment HR Leads",
            value: HRLeads,
            trendText: "Active HR lead Team",
            trendType: "warning",
            iconName: "Users"
        },
        {
            id: "Interview",
            title: "Recruitment HR",
            value: HR,
            trendText: "Active HR Team",
            trendType: "neutral",
            iconName: "Users"
        },
        {
            id: "conflictOfInterest",
            title: "conflictOfInterest",
            value: COICandidate,
            trendText: "Requires Review",
            trendType: "neutral",
            iconName: "Users"
        },

    ];

}

export const BuildMonthlyTracker = (
    recruitments: any[]
): IMonthlyTrackerItem[] => {

    const tracker: IMonthlyTrackerItem[] = [];

    for (let i = 5; i >= 0; i--) {

         const targetMonth = moment().subtract(i, "months");
        const monthLabel = targetMonth.format("MMM YYYY");

        const totalInMonth = recruitments.filter((item: any) => 
          item.Created && moment(item.DateRequried).isSameOrBefore(targetMonth, "month")
        ).length;

        const filledInMonth = recruitments.filter((c: any) => 
          Number(c.StatusId) === StatusId.Onboarded && c.Modified && moment(c.Modified).isSameOrBefore(targetMonth, "month")
        ).length;
        
        const openInMonth = Math.max(0, totalInMonth - filledInMonth);

        // const month =
        //     moment().subtract(i, "months");

        // const total =
        //     recruitments.filter(x =>
        //         moment(x.DateRequried)
        //             .isSameOrBefore(month, "month")
        //     ).length;

        // const filled =
        //     recruitments.filter(x =>
        //         Number(x.StatusId) === StatusId.Onboarded &&
        //         moment(x.Modified)
        //             .isSameOrBefore(month, "month")
        //     ).length;

        tracker.push({
            month: monthLabel,
            totalPositions: totalInMonth,
            positionsFilled: filledInMonth,
            openPositions: openInMonth
        });

    }

    return tracker;

}

export const BuildJobRoleSummary = (
    recruitments: any[],
    candidates: any[]
): IPositionsJobRole[] => {

    const map = new Map<string, IPositionsJobRole>();

    recruitments.forEach((recruitment) => {

        const role =
            recruitment.JobCode?.JobTitleInEnglish ?? "Unknown";

        const recruitmentId = recruitment.ID;

        // All candidates for this recruitment
        const recruitmentCandidates = candidates.filter(
            c => Number(c.RecruitmentIDId) === recruitmentId
        );

        // Filled Candidates
        const filled = recruitmentCandidates.filter(
            c => Number(c.StatusId) === StatusId.Onboarded
        ).length;

        const total =
            Number(recruitment.NumberOfPersonNeeded) || 1;

        if (!map.has(role)) {

            map.set(role, {
                jobRole: role,
                total: 0,
                filled: 0,
                open: 0,
                percentage: 0
            });

        }

        const current = map.get(role)!;

        current.total += total;
        current.filled += filled;

    });

    return Array.from(map.values()).map(item => ({

        ...item,

        open: Math.max(0, item.total - item.filled),

        percentage:
            item.total > 0
                ? Math.round((item.filled / item.total) * 100)
                : 0

    }));

};

export const BuildHRSummary = async (
    recruitments: any[]
): Promise<IHRSummary[]> => {

    const map = new Map<string, IHRSummary>();

    for (const item of recruitments) {

        const user = await CommonServices.GetUserName(item.AssignedHR);

        const hrName = user.data ?? "Unknown";

        const jobTitle =
            item.JobCode?.JobTitleInEnglish ?? "";

        if (!map.has(hrName)) {

            map.set(hrName, {

                HRName: hrName,

                JobTitle: jobTitle,

                openPositions: 0,

                filledPositions: 0

            });

        }

        const current = map.get(hrName)!;

        if (Number(item.StatusId) === StatusId.Onboarded) {
            current.filledPositions++;
        } else {
            current.openPositions++;
        }

    }

    return Array.from(map.values());

};

export const BuildPositionStatus = (
    recruitments:any[]
): IPositionStatus => {

    const status = {

        OnTrack: 0,

        atRisk: 0,

        overduecount: 0,

        dueLast7days: 0,

        total: recruitments.length

    };

    recruitments.forEach(item => {

        const diff =
            getMonthDifference(
                new Date(),
                new Date(item.DateRequried)
            );

        if (diff < 0)
            status.overduecount++;

        else if (diff <= 2)
            status.atRisk++;

        else
            status.OnTrack++;

    });

    return status;

}

export const HODBuildApprovals = (recruitments: any[], candidate: any[]): any[] => {
    const assignpositionID = candidate.filter((x) => 
        Number(x.StatusId) === StatusId.PendingwithpositionIDAssignmentWithHOD ||
        Number(x.StatusId) === StatusId.pendingL2shorlistingwithHOD ||
        Number(x.StatusId) === StatusId.CandidateOnHoldbyHODLevel1 ||
        Number(x.StatusId) === StatusId.CandidateOnHoldbyHODLevel2 ||
        Number(x.StatusId) === StatusId.OnHoldbyHOD
    );

    const evalution = candidate.filter((x) => 
        Number(x.StatusId) === StatusId.InterviewInProcess ||
        Number(x.StatusId) === StatusId.InterviewLevel1InProgress ||
        Number(x.StatusId) === StatusId.InterviewLevel2InProgress
    );

    const today = new Date();
    const AdvertExtension = recruitments.filter((x) => {
        const d1 = x.JobPostingEndDate ? new Date(x.JobPostingEndDate) : null;
        const d2 = x.JobPostingFirstExtensionEndDate ? new Date(x.JobPostingFirstExtensionEndDate) : null;
        const d3 = x.JobPostingSecondExtensionEndDate ? new Date(x.JobPostingSecondExtensionEndDate) : null;
        return (d1 && d1 < today) || (d2 && d2 < today) || (d3 && d3 < today);
    });

    return [
        { id: 1, requestType: "Assign Position ID ", count: assignpositionID.length },
        { id: 2, requestType: "Evalution", count: evalution.length },
        { id: 3, requestType: "Advert Extension", count: AdvertExtension.length }
    ];
};

export const LMBuildApprovals = async (recruitments: any[], candidate: any[]): Promise<any[]> => {
    const reviewadvert = recruitments.filter((x) => 
        Number(x.StatusId) === StatusId.PendingwithLineManagereviewAdv ||
        Number(x.StatusId) === StatusId.CareerPortalQuestions 
    );

    const evalution = candidate.filter((x) => 
        Number(x.StatusId) === StatusId.InterviewInProcess ||
        Number(x.StatusId) === StatusId.InterviewLevel1InProgress ||
        Number(x.StatusId) === StatusId.InterviewLevel2InProgress
    );

    let allJobCodeIds: number[] = recruitments.map((item: any) => item.JobCodeId).filter(Boolean);
    let portalItems: any[] = [];
    if (allJobCodeIds.length > 0) {
        portalItems = (await SPServices.SPReadItems({
            Listname: ListNames.RecruitAppCareerPortalIntegration,
            Select: `*,JobCode/JobCode`,
            Filter: [
                { FilterKey: "JobCodeId", Operator: "in", FilterValue: allJobCodeIds },
            ],
            FilterCondition: "and",
            Expand: `JobCode`,
            Topcount: 5000,
            Orderby: "ID",
            Orderbydecorasc: true,
        })) as any[];
    }

    const jobCodeIdToUniqueKey = portalItems.map((item: any) => item.JobUniqueKey).filter(Boolean);
    let ScreeningCount = 0;

    if (jobCodeIdToUniqueKey.length > 0) {
        const params: any = {
            jobCodes: jobCodeIdToUniqueKey,
            workflowStatus: [
                workflowStatusApi.LineManagerL1Pending,
                workflowStatusApi.LineManagerL2Pending,
                workflowStatusApi.HROnHold,
                workflowStatusApi.LineManagerLevel1OnHold,
                workflowStatusApi.LineManagerLevel2OnHold,
            ],
        };
        const response = await getProfileData.GetJobAppliedCount(params);
        const apiData = Array.isArray(response?.data?.data) ? response.data.data : [];

        ScreeningCount = apiData.reduce((total: number, item: any) => {
            return item.workflowStatus?.some((status: string) => [
                workflowStatusApi.LineManagerL1Pending,
                workflowStatusApi.LineManagerL2Pending,
                workflowStatusApi.LineManagerLevel1OnHold,
                workflowStatusApi.LineManagerLevel2OnHold,
            ].includes(status))
                ? total + (item.count ?? 0)
                : total;
        }, 0);
    }

    return [
        { id: 1, requestType: "Review Advert and Minimum critia quesion", count: reviewadvert.length },
        { id: 2, requestType: "Level 2 Screening shortlisting", count: ScreeningCount },
        { id: 3, requestType: "Evalution", count: evalution.length }
    ];
};

export const BuildTasks = (recruitments: any[],Selectedcandidate: any[]): any[] => {
    return recruitments.map((item: any, index: number) => {
        const dateValue = item.DateRequried;
        let dayaLeft = "0";

        if (dateValue) {
            const target = new Date(dateValue);
            if (!isNaN(target.getTime())) {
                const diffMs = target.getTime() - new Date().getTime();
                const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                dayaLeft = diffDays > 0 ? `${diffDays}` : "0";
            }
        }
         const onboardedCandidatesCount = Selectedcandidate.filter(
            (c: any) => Number(c.StatusId) === StatusId.Onboarded
          ).length;

          const vacant = String(
            Math.max(0, Number(item.NumberOfPersonNeeded) - onboardedCandidatesCount)
          );

          let Positionstatus: "Overdue" | "At Risk" | "On Track" = "On Track";
          if (dateValue) {
            const target = new Date(dateValue);
            if (!isNaN(target.getTime())) {
              const diff = getMonthDifference(currentDate, target);
              if (diff < 0) Positionstatus = "Overdue";
              else if (diff <= 2) Positionstatus = "At Risk";
            }
          }


        return {
           id: index + 1,
            JobCode: item.JobCode?.JobCode ?? "",
            Jobtitle: item.JobCode?.JobTitleInEnglish ?? "",
            department: item.Department?.DepartmentName ?? "",
            dateRequired: dateValue
              ? new Date(dateValue).toLocaleDateString("en-GB")
              : "",
            headcount: String(item.NumberOfPersonNeeded || 1),
            filledcount: String(onboardedCandidatesCount),
            vacant,
            dayaLeft,
            Positionstatus,
        };
    });
};

export const BuildHRLeadSummary = (
    OpenRecruitment: any[],
    recruitmentProcess: any[]
): IHRLeadSummary => {

     const currentMonthOpenings = OpenRecruitment.filter(item =>
            isFiveMonthsBeforeCurrent(item?.DateRequried)
          );
    const TotalOpenPosition = currentMonthOpenings.length;

     const RecruitmentInProgress = recruitmentProcess.filter(
            (item) => Number(item.StatusId) !== StatusId.Onboarded
          ).length;
    
          const Onboarding = recruitmentProcess.filter(
            (item) => Number(item.StatusId) === StatusId.Onboarded
          ).length;
    
          const OnemDocumentStage = recruitmentProcess.filter(
            (item) => Number(item.StatusId) === StatusId.PendingUploadONEM
          ).length;
    
          const Duemonth: IDueMonth = {
            Jan: getDueMonthRatio(0, recruitmentProcess),
            Feb: getDueMonthRatio(1, recruitmentProcess),
            Mar: getDueMonthRatio(2, recruitmentProcess),
            Apr: getDueMonthRatio(3, recruitmentProcess),
            May: getDueMonthRatio(4, recruitmentProcess),
            June: getDueMonthRatio(5, recruitmentProcess),
            July: getDueMonthRatio(6, recruitmentProcess),
            Aug: getDueMonthRatio(7, recruitmentProcess),
            Sep: getDueMonthRatio(8, recruitmentProcess),
            Oct: getDueMonthRatio(9, recruitmentProcess),
            Nov: getDueMonthRatio(10, recruitmentProcess),
            Dec: getDueMonthRatio(11, recruitmentProcess),
          };
            let overduecountCount = 0;
           recruitmentProcess.forEach((item) => {
                  if (Number(item.StatusId) === StatusId.Onboarded) return;
                  const dateValue = item.DateRequried;
                  const targetDate = new Date(dateValue);
                  const diffMonths = getMonthDifference(currentDate, targetDate);
                  if (diffMonths < 0) {
                    overduecountCount++;
                  }
                });
          const OverDuePosition = overduecountCount;
 
    return {
        TotalOpenPosition,
        RecruitmentInProgress,
        Onboarding,
        OnemDocumentStage,
        Duemonth,
        OverDuePosition
    }

}

export const BuildPositionSource = async (
    recruitmentProcess: any[]
): Promise<IPositionSource[]> => { 
    return await Promise.all(
            Object.entries(groupedHR(recruitmentProcess)).map(async ([email, val]) => {
              const records = val as any[];
              const total = records.length;
              const done = records.filter(
                (x: any) => x.Status === "Completed"
              ).length;
    
              const pending = total - done;
              const hrName = await CommonServices.GetUserName(email);
    
              return {
                name: hrName.data,
                avatarText: hrName.data.substring(0, 2).toUpperCase(),
                avatarTheme: "blue",
                positionsCount: total,
                percentage: total ? Math.round((done * 100) / total) : 0,
                pending,
                done,
                total
              };
            }));
}

export const BuildPositionDetails = async (recruitments: any[], candidateDetails: any[]): Promise<any[]> => {
    return await Promise.all(recruitments.map(async (item: any, index: number) => {
        const dateValue = item.DateRequried;
        let dayaLeft = "0";

        if (dateValue) {
            const target = new Date(dateValue);
            if (!isNaN(target.getTime())) {
                const diffMs = target.getTime() - new Date().getTime();
                const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                dayaLeft = diffDays > 0 ? `${diffDays}` : "0";
            }
        }

        const onboardedCandidatesCount = candidateDetails.filter(
            (c: any) =>
              c.JobCodeId === item.JobCodeId &&
              Number(c.StatusId) === StatusId.Onboarded
          ).length;

          const vacant = String(
            Math.max(0, (item.NumberOfPersonNeeded || 1) - onboardedCandidatesCount)
          );

          let Positionstatus: "Overdue" | "At Risk" | "On Track" = "On Track";
          if (dateValue) {
            const target = new Date(dateValue);
            if (!isNaN(target.getTime())) {
              const diff = getMonthDifference(currentDate, target);
              if (diff < 0) Positionstatus = "Overdue";
              else if (diff <= 2) Positionstatus = "At Risk";
            }
          }

        const hrName = await CommonServices.GetUserName(item?.AssignedHR);


        return {
            id: index + 1,
            JobCode: item.JobCode?.JobCode ?? "",
            Jobtitle: item.JobCode?.JobTitleInEnglish ?? "",
            department: item.Department?.DepartmentName ?? "",
            dateRequired: dateValue ? new Date(dateValue).toLocaleDateString("en-GB") : "",
            headcount: String(item.NumberOfPersonNeeded || 1),
            filledcount: "0",
            vacant: vacant,
            assignHR: hrName.data ?? "N/A",
            dayaLeft,
            Positionstatus,
            nationality: item.Nationality || "N/A",
            status: item.Status?.StatusDescription || "N/A",
            statusId: Number(item.StatusId) || 0
        };
    }));
};


export const BuildDepartmentDetails = (recruitments: any[]): any[] => {
      const departmentMap = new Map<string, { total: number, filled: number }>();
    recruitments.forEach((item: any) => {
        const deptName = item.Department?.DepartmentName || "General";
        if (!departmentMap.has(deptName)) {
          departmentMap.set(deptName, { total: 0, filled: 0 });
        }
        const currentDept = departmentMap.get(deptName)!;
        currentDept.total += (Number(item.NumberOfPersonNeeded) || 1);

        const deptFilled = Number(item.StatusId) === StatusId.Onboarded;
        currentDept.filled += deptFilled ? 1 : 0;
      });
    return Array.from(departmentMap.entries()).map(([deptName, counts]) => {
        const total = Number(counts.total);
        const filled = Number(counts.filled);
        const open = Math.max(0, total - filled);
        const filledPercentage = total ? Math.round((filled / total) * 100 * 10) / 10 : 0;
        return {
          department: deptName,
          total,
          filled,
          open,
          filledPercentage
        };
      });
};

export const BuildHRMonthlyTracker = (recruitments: any[]): any[] => {
    const tracker: any[] = [];
    for (let i = 5; i >= 0; i--) {
        const targetMonth = moment().subtract(i, "months");
        const monthLabel = targetMonth.format("MMM YYYY");

        const totalInMonth = recruitments.filter((item: any) => 
          item.Created && moment(item.DateRequried).isSameOrBefore(targetMonth, "month")
        ).length;

        const filledInMonth = recruitments.filter((c: any) => 
          Number(c.StatusId) === StatusId.Onboarded && c.Modified && moment(c.Modified).isSameOrBefore(targetMonth, "month")
        ).length;
        
        const openInMonth = Math.max(0, totalInMonth - filledInMonth);

        tracker.push({
          month: monthLabel,
          totalPositions: totalInMonth,
          positionsFilled: filledInMonth,
          openPositions: openInMonth
        });
    }
    return tracker;
}

export const BuildCandidatePipeLine = async (recruitments: any[], candidates: any[], selectedcandidate: any[]) => {
      let allJobCodeIds: number[] = recruitments.map((item: any) => item.JobCodeId).filter(Boolean);
      let portalItems: any[] = [];
      if (allJobCodeIds.length > 0) {
        portalItems = (await SPServices.SPReadItems({
          Listname: ListNames.RecruitAppCareerPortalIntegration,
          Select: `*,JobCode/JobCode`,
          Filter: [
            { FilterKey: "JobCodeId", Operator: "in", FilterValue: allJobCodeIds },
          ],
          FilterCondition: "and",
          Expand: `JobCode`,
          Topcount: 5000,
          Orderby: "ID",
          Orderbydecorasc: true,
        })) as any[];
      }

      const jobCodeIdToUniqueKey = portalItems.map((item: any) => item.JobUniqueKey).filter(Boolean);
      let ScreeningCount = 0;
      let AppliedCount = 0;

      if (jobCodeIdToUniqueKey.length > 0) {
        const params: any = {
          jobCodes: jobCodeIdToUniqueKey,
          workflowStatus: [
            workflowStatusApi.HRPending,
            workflowStatusApi.LineManagerL1Pending,
            workflowStatusApi.LineManagerL2Pending,
          ],
        };
        const response = await getProfileData.GetJobAppliedCount(params);
        const apiData = Array.isArray(response?.data?.data) ? response.data.data : [];

        AppliedCount = apiData.reduce((total: number, item: any) => {
          return item.workflowStatus?.includes(workflowStatusApi.HRPending)
            ? total + (item.count ?? 0)
            : total;
        }, 0);

        ScreeningCount = apiData.reduce((total: number, item: any) => {
          return item.workflowStatus?.some((status: string) => [
            workflowStatusApi.LineManagerL1Pending,
            workflowStatusApi.LineManagerL2Pending,
            workflowStatusApi.LineManagerLevel1OnHold,
            workflowStatusApi.LineManagerLevel2OnHold,
          ].includes(status))
            ? total + (item.count ?? 0)
            : total;
        }, 0);
      }

      const InterviewCount = candidates.filter((item: any) =>
        [
          StatusId.InterviewScheduled,
          StatusId.InterviewInProcess,
          StatusId.InterviewScheduledforLevel2,
          StatusId.InterviewLevel2InProgress,
          StatusId.InterviewLevel1InProgress
        ].includes(Number(item.StatusId))
      ).length;

      const BackgroundCheckCount = selectedcandidate.filter((item: any) =>
        [
          StatusId.PendingHRBGVInitiation,
          StatusId.PendingBGdocuploadedbycandidate,
          StatusId.PendingHRReviewBGCheck
        ].includes(Number(item.StatusId))
      ).length;

      const ResiProcessCount = selectedcandidate.filter((item: any) =>
        [
          StatusId.RESIProcessInitiatedforDRC,
          StatusId.RESIProcessInitiatedforExpatriate,
          StatusId.RESProcessInitiated
        ].includes(Number(item.StatusId))
      ).length;

      const MedicalScreeningCount = selectedcandidate.filter((item: any) =>
        [
          StatusId.PendingwithTAforMedicalScreening,
        ].includes(Number(item.StatusId))
      ).length;

      const OfferCount = selectedcandidate.filter((item: any) =>
        [
          StatusId.PendingHROfferInitiate,
          StatusId.PendingCandidateOfferLetterUpload,
          StatusId.PendingHRReviewOfferWorkPermitInit,
          StatusId.PendingLabourHireOfferRelease,
          StatusId.PendingHROfferReview,
          StatusId.HROfferLetterProgress
        ].includes(Number(item.StatusId))
      ).length;

      const EmploymentContractCount = selectedcandidate.filter((item: any) =>
        [
          StatusId.PendingCandidateEmploymentContractUpload,
          StatusId.PendingHREmploymentContractVerification,
          StatusId.PendingHREmploymentContractInit,
          StatusId.PendingLHECRelease,
          StatusId.PendingHREmploymentContractReview,
        ].includes(Number(item.StatusId))
      ).length;

      const OnboardingInProcessCount = selectedcandidate.filter((item: any) =>
        [
          StatusId.onboardingInProcess,
          StatusId.OnboardingProcessinitiatedforDRC,
          StatusId.OnboardingProcessinitiatedforExpat,
        ].includes(Number(item.StatusId))
      ).length;

      const OnboardingCompletedCount = recruitments.filter((item: any) =>
        [
          StatusId.Onboarded,
        ].includes(Number(item.StatusId))
      ).length;

      const pipelineStages = [
        { name: "Applied", count: AppliedCount },
        { name: "Screening", count: ScreeningCount },
        { name: "Interview", count: InterviewCount },
        { name: "Background Checks", count: BackgroundCheckCount},
        { name: "RESI Process", count: ResiProcessCount },
        { name: "Medical Screening", count: MedicalScreeningCount },
        { name: "Offer & Employment Contract", count: OfferCount + EmploymentContractCount },
        { name: "Onboarding In Process", count: OnboardingInProcessCount },
        { name: "Onboarding", count: OnboardingCompletedCount }
      ];

      const totalCandidates = pipelineStages.reduce((sum, stage) => sum + stage.count, 0);
      const candidatePipeline = pipelineStages.map(stage => {
        const percentage = totalCandidates ? Math.round((stage.count / totalCandidates) * 100 * 10) / 10 : 0;
        return {
          stage: stage.name,
          count: stage.count,
          percentage
        };
      });
      return candidatePipeline;
}

export const BuildHRLeadSource = async (
    recruitmentProcess: any[]
): Promise<any[]> => { 
    return await Promise.all(
            Object.entries(groupedHRLead(recruitmentProcess)).map(async ([email, val]) => {
              const records = val as any[];
              const total = records.length;
              const hrleadName = await CommonServices.GetUserName(email);
              const HR = groupedHR(records);
              const filled = records.filter((item: any) => Number(item.StatusId) === StatusId.Onboarded).length;
              const open = records.filter((item: any) => Number(item.StatusId) !== StatusId.Onboarded).length;
    
              return {
                hrLeadName: hrleadName.data ?? email,
                hrsManaged: Object.keys(HR).length,
                filled: filled,
                open: open
              };
            }));
}

export const conflictOfInterestAlerts = [
        { name: "Karthick", JobTitle: "Senior HR", coiReason: "tested", currentstatus: "HR Pending" },
        { name: "Suriya", JobTitle: "Senior Superintent", coiReason: "tested", currentstatus: "HR Pending" },
        { name: "RajaGuru", JobTitle: "Plumber", coiReason: "tested", currentstatus: "HR Pending" }
      ];

      export const BuildSeniorHRMonthlyTracker = (recruitments: any[]): any[] => {
    const tracker: any[] = [];
    for (let i = 5; i >= 0; i--) {
        const targetMonth = moment().subtract(i, "months");
        const monthLabel = targetMonth.format("MMM YYYY");

        const totalInMonth = recruitments.filter((item: any) => 
          item.Created && moment(item.DateRequried).isSameOrBefore(targetMonth, "month")
        ).length;

        const filledInMonth = recruitments.filter((c: any) => 
          Number(c.StatusId) === StatusId.Onboarded && c.Modified && moment(c.Modified).isSameOrBefore(targetMonth, "month")
        ).length;
        
        const openInMonth = Math.max(0, totalInMonth - filledInMonth);

        tracker.push({
          month:  monthLabel,
    total: totalInMonth,
    filled: filledInMonth,
    open: openInMonth
        });
    }
    return tracker;
}

export const SeniorHRBuildTasks = async (
  recruitments: any[],
  Selectedcandidate: any[]
): Promise<any[]> => {

  return await Promise.all(
    recruitments.map(async (item: any, index: number) => {

      const dateValue = item.DateRequried;
      let dayaLeft = "0";

      if (dateValue) {
        const target = new Date(dateValue);
        if (!isNaN(target.getTime())) {
          const diffMs = target.getTime() - new Date().getTime();
          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          dayaLeft = diffDays > 0 ? `${diffDays}` : "0";
        }
      }

      const onboardedCandidatesCount = Selectedcandidate.filter(
        (c: any) => Number(c.StatusId) === StatusId.Onboarded
      ).length;

      const vacant = String(
        Math.max(
          0,
          Number(item.NumberOfPersonNeeded) - onboardedCandidatesCount
        )
      );

      let Positionstatus: "Overdue" | "At Risk" | "On Track" = "On Track";

      if (dateValue) {
        const target = new Date(dateValue);
        if (!isNaN(target.getTime())) {
          const diff = getMonthDifference(currentDate, target);
          if (diff < 0) Positionstatus = "Overdue";
          else if (diff <= 2) Positionstatus = "At Risk";
        }
      }

      const hrleadName = await CommonServices.GetUserName(item.RecruitmentHRLead);
      const hrName = await CommonServices.GetUserName(item.AssignedHR);

      return {
        id: index + 1,
        JobCode: item.JobCode?.JobCode ?? "",
        Jobtitle: item.JobCode?.JobTitleInEnglish ?? "",
        department: item.Department?.DepartmentName ?? "",
        dateRequired: dateValue
          ? new Date(dateValue).toLocaleDateString("en-GB")
          : "",
        RecruitmentHRlead: hrleadName.data,
        RecruitmentHR: hrName.data,
        headcount: String(item.NumberOfPersonNeeded || 1),
        filledcount: String(onboardedCandidatesCount),
        vacant,
        dayaLeft,
        Positionstatus,
      };
    })
  );
};
