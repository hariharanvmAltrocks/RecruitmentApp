import * as React from "react";
import { TabDetails } from "../Models/Master";
import { MenuResponse } from "../Models/Menu";
import {
  ActionIcon,
  RoleID,
  RoleName,
  StatusId,
  workflowStatusApi,
} from "../utilities/Config";
import { GetPortalJobsService, getVRRDetails } from "../Services/ServiceExport";
import { checklist } from "../Models/Screens";
import Box from "@mui/material/Box";
import { DataSyncToRecruitmentResponse } from "../Services/RecruitmentProcess/IRecruitmentProcessService";
import { FilterItem } from "../Models/ApIInterface";

export function GetAddAction(data: any[]): boolean {
  return data.some((item) => item.ActionId?.includes(ActionIcon.Add));
}

// export function GetStatusIds(array: any[]): string[] {
//   return array.map(item => String(item.StatusId));
// }

export function GetStatusIds(array: any[]): string[] {
  return array
    .filter((item) => item.StatusId !== undefined && item.StatusId !== "")
    .map((item) => String(item.StatusId));
}
export async function GetTabDetailsById(menuID: number, items: MenuResponse[]) {
  const search = (items: any[]) => {
    return (
      items?.reduce((acc: TabDetails[], menu: any) => {
        if (!menu.SubMenu) {
          const match = menu.TabDetails?.find(
            (tab: { Id: number }) => tab?.Id === menuID,
          );
          let TabDetails = match?.TabDetails.map((item: any, index: number) => {
            return {
              ...item,
              Value: "tab" + (index + 1),
            };
          });
          if (match) acc.push(TabDetails);
        } else {
          const childMatches = menu.Children?.find(
            (child: any) => child?.Id === menuID,
          );
          let TabDetails = childMatches?.TabDetails.map(
            (item: any, index: number) => {
              return {
                ...item,
                Value: "tab" + (index + 1),
              };
            },
          );
          if (childMatches) acc.push(TabDetails);
        }
        return acc;
      }, []) ?? []
    );
  };
  await search(items);
}

export function GetRoleKeysArray(array: any[]): number[] {
  return array.map((role) => Number(role.key));
}

export function GetStatusIdRoles(StatusIds: number) {
  switch (StatusIds) {
    case StatusId.ReadyforRecruitmentProcess:
    case StatusId.PendingwithHRLeadtoAssignRecruitmentHR:
    case StatusId.PendingwithHRLeadtouploadONEMsigneddoc:
      return RoleID.RecruitmentHRLead;
    case StatusId.PendingwithRecruitmentHRtouploadAdv:
      return RoleID.RecruitmentHR;
    case StatusId.PendingwithHODtoreviewAdv:
      return RoleID.HOD;
    case StatusId.PendingwithLineManagereviewAdv:
    case StatusId.PendingwithLMcreateDisqualificationQuestion:
    case StatusId.PendingwithHRandLMtocreateinterviewQuestion:
      return RoleID.LineManager;

    default:
      return null;
  }
}

export function GetWorkflowStatusByID(StatusIds: string) {
  switch (StatusIds) {
    case workflowStatusApi.HRPending:
    case workflowStatusApi.PendingRecruitmentHRscheduleInterview:
      return RoleName.RecruitmentHR;
    case workflowStatusApi.LineManagerL1Pending:
    case workflowStatusApi.LineManagerL2Pending:
    case workflowStatusApi.LineManagerLevel1OnHold:
    case workflowStatusApi.LineManagerLevel2OnHold:
      return RoleName.LineManager;

    default:
      return "";
  }
}

export const tabStyle = (TabName: string, Count: number) => {
  return Count > 0 ? (
    <>
      <span>
        {TabName}{" "}
        <span
          style={{
            color: "red",
            fontWeight: "bold",
            fontFamily: "Segoe UI, Arial, sans-serif",
          }}
        >
          ({Count})
        </span>
      </span>
    </>
  ) : (
    `${TabName} (${0})`
  );
};

export function addWeekdays(date: any, daysToAdd: number) {
  const result = new Date(date);
  let addedDays = 0;

  while (addedDays < daysToAdd) {
    result.setDate(result.getDate() + 1);

    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      addedDays++;
    }
  }

  return result;
}

export async function fetchApiUrl() {
  const siteUrl = await getVRRDetails.GetCareerPortalIntergLink([], "and");
  const ApiUrl = siteUrl?.data;
  return ApiUrl;
}

export const ApiUrl = () => {
  let apiUrl = fetchApiUrl();
  return apiUrl;
};

export const convertToList = (obj: any): checklist[] => {
  return Object.values(obj);
};

export const toUTC = (dateStr: any) => {
  return new Date(dateStr).toISOString();
};
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const normalizeQuestion = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[’‘]/g, "'") // normalize smart quotes
    .replace(/[“”]/g, '"') // normalize smart double quotes
    .replace(/\s+/g, " "); // collapse multiple spaces

export const SpiltDateOnly = (date: Date) => {
  const updatedDate = date;
  const year = updatedDate?.getFullYear();
  const month = String(updatedDate?.getMonth() + 1).padStart(2, "0");
  const day = String(updatedDate?.getDate()).padStart(2, "0");

  const dateOnly = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  ); //`${year}-${month}-${day}`;
  return dateOnly.toISOString();
};
const resolveUserFieldByRole = (currentRoles: any[]) => {
  if (currentRoles.includes(RoleID.RecruitmentHR)) {
    return "AssignedHR";
  }
  if (currentRoles.includes(RoleID.LineManager)) {
    return "LineManager";
  }

  if (currentRoles.includes(RoleID.HOD)) {
    return "HOD";
  }

  return null;
};

export const buildRecruitmentTabConfig = (
  tabNameData: TabDetails[],
  CurrentRoleID: any[],
) => {
  const userField = resolveUserFieldByRole(CurrentRoleID);

  return tabNameData.reduce((acc: any, tab) => {
    acc[tab.Value] = {
      status: tab.StatusDetails?.map((s) => s.StatusId) || [],
      userField: userField,
      requireItemCreated: true,
    };

    return acc;
  }, {});
};

// export function calculateTotalExperienceYears(experiences: any[]): number {
//   const now = new Date();

//   let totalMilliseconds = 0;

//   experiences.forEach((exp) => {
//     const startDate = new Date(exp.startFrom);

//     const endDate = exp.isCurrent === 1 ? now : new Date(exp.endTo);

//     if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
//       totalMilliseconds += endDate.getTime() - startDate.getTime();
//     }
//   });

//   const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;

//   return Number((totalMilliseconds / millisecondsInYear).toFixed(2));
// }

export function calculateTotalExperienceYears(experiences: any[]) {
  let totalMonths = 0;

  experiences.forEach((exp) => {
    const startDate = new Date(exp.startFrom);

    let endDate;
    if (exp.endTo === "current date" || exp.isCurrent === 1 || !exp.endTo) {
      endDate = new Date(); // today
    } else {
      endDate = new Date(exp.endTo);
    }

    let months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    // If end day is before start day, reduce one month
    if (endDate.getDate() < startDate.getDate()) {
      months--;
    }

    totalMonths += months;
  });

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return `${years} years and ${months} months`;
}

export function formatExperience(years: number): string {
  const wholeYears = Math.floor(years);
  const months = Math.round((years - wholeYears) * 12);

  return `${wholeYears} years ${months} months`;
}

export function getcountryCode(Code: any[], refMobile: string) {
  if (!refMobile) return null;
  const [countryCode, mobileNumber] = refMobile.split("-");
  const country = Code.find((item) => item.code === countryCode);
  if (!country) return null;
  return `${country.id}-${mobileNumber}`;
}

export const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}) => (
  <div style={{ display: "flex", marginTop: "1%", marginLeft: "1%" }}>
    <div
      style={{
        fontWeight: "bold",
        fontFamily: '"Roboto", sans-serif',
        fontSize: "17px",
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: '"Roboto", sans-serif',
        marginLeft: "1%",
        fontSize: "17px",
        wordBreak: "break-word",
      }}
    >
      {value?.trim() || "—"}
    </div>
  </div>
);

export const toDate = (value?: string): Date | undefined =>
  value ? new Date(value) : undefined;

export const getTotalAppliedCount = async (
  getJobAppiledCount: DataSyncToRecruitmentResponse[],
  FilterItem: string[],
) => {
  const counts = await Promise.all(
    getJobAppiledCount.map(async (item) => {
      // 1. Build JobCode filter
      const jobCodeFilter = [
        {
          FilterKey: "JobCodeId",
          Operator: "eq",
          FilterValue: String(item?.JobCodeId),
        },
        {
          FilterKey: "IsActive",
          Operator: "eq",
          FilterValue: 1,
        },
      ];

      const jobUniqueValue = await getVRRDetails.GetJobUniqueDataValue(
        jobCodeFilter,
        "and",
      );

      const jobUniqueKey = jobUniqueValue?.data?.[0]?.JobUniqueKey;
      if (!jobUniqueKey) return 0;

      const filterValue: FilterItem = {
        jobCode: jobUniqueKey,
        workflowStausId: FilterItem ?? [],
        pagination: {
          filterValue: "",
          sortBy: "",
          sortOrder: 0,
          pageSize: 10000,
          currentPage: 0,
          totalItems: 0,
        },
      };

      const jobAppliedCount =
        await GetPortalJobsService.getCandidateDetailsInJobCode(filterValue);

      return jobAppliedCount?.data?.length || 0;
    }),
  );

  const totalCount = counts.reduce((sum, count) => sum + count, 0);

  return totalCount;
};

export const getInterviewPanelCount = async (
  getJobAppiledCount: DataSyncToRecruitmentResponse[],
) => {
  const counts = await Promise.all(
    getJobAppiledCount.map(async (item) => {
      const jobCodeFilter = [
        {
          FilterKey: "RecruitmentIDId",
          Operator: "eq",
          FilterValue: String(item?.ID),
        },
        {
          FilterKey: "JobCodeId",
          Operator: "eq",
          FilterValue: String(item?.JobCodeId),
        },
        {
          FilterKey: "StatusId",
          Operator: "in",
          FilterValue: [
            StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel,
          ],
        },
        {
          FilterKey: "ItemCreated",
          Operator: "eq",
          FilterValue: "No",
        },
      ];

      const scorecardValue = await getVRRDetails.getReviewScoreCardCount(
        jobCodeFilter,
        "and",
      );

      return Number(scorecardValue?.data) || 0;
    }),
  );

  const totalCount = counts.reduce((sum, count) => sum + count, 0);

  return totalCount;
};

export const getScoreCardCount = async (
  getJobAppiledCount: DataSyncToRecruitmentResponse[],
) => {
  const counts = await Promise.all(
    getJobAppiledCount.map(async (item) => {
      const jobCodeFilter = [
        {
          FilterKey: "RecruitmentIDId",
          Operator: "eq",
          FilterValue: String(item?.ID),
        },
        {
          FilterKey: "JobCodeId",
          Operator: "eq",
          FilterValue: String(item?.JobCodeId),
        },
        {
          FilterKey: "StatusId",
          Operator: "in",
          FilterValue: [
            StatusId.PendingwithHODtoselectthecandidate,
            StatusId.OnHoldbyHOD,
            StatusId.PendingwithHODtoAssignPositionID,
            StatusId.CandidateOnHoldbyHODLevel1,
            StatusId.CandidateOnHoldbyHODLevel2,
          ],
        },
        {
          FilterKey: "ItemCreated",
          Operator: "eq",
          FilterValue: "No",
        },
      ];

      const scorecardValue = await getVRRDetails.getReviewScoreCardCount(
        jobCodeFilter,
        "and",
      );

      return Number(scorecardValue?.data) || 0;
    }),
  );

  const totalCount = counts.reduce((sum, count) => sum + count, 0);

  return totalCount;
};
