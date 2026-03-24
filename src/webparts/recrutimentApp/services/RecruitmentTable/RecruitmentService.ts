import moment from "moment";
import { ApiResponse } from "../../models/apimodels";
import { count, InOperator, ResponeStatus } from "../../utilities/ApiConfig";
import { DataFrom, DocumentLibraray, ListNames } from "../../utilities/Config";
import SPServices, { getSP } from "../SPService/spservice";
import { BatchQuery } from "../SPService/Ispservice";
import { _mapRecruitmentItems } from "./mapItems";
import { DataSyncToRecruitmentResponse, IDptData, InsertComments, IRecruitmentService, PostRecuritmentData, QualificationValue, RoleSpecKnowledge, stripHtml } from "./IRecruitmentService";
import { BGverification } from "../AxiosService/CareerPortalAPI";
import { AdvertisementDetails, Descriptions, MinAndPreferedQualifications, RoleAndTechSkills, UpsertBGV } from "../../models/Icareerportal";
import { CareerPotalServices, CommonServices } from "../ServiceExport";
import { Nationality } from "../../utilities/ConditionConfig";
import { AddCalculateDate } from "../../components/Hooks/dateConfigfn";

export default class RecruitmentService implements IRecruitmentService {


async GetNPAEPVRRDetails(
  filterParam: any,
  filterConditions: any,
  Type: string
): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>> {
  try {
     let queries: BatchQuery[] = [];
    switch (Type) {
      case DataFrom.NewPosition:
         queries = [
     
      {
        StateValue: 2,
        ListName: ListNames.HRMSNewPositionRequest,
        Filter: filterParam,
        FilterCondition: filterConditions,
       select: ["*,Action/Action,BusinessUnitCode/BusineesUnitCode,Status/StatusDescription,Author/EMail,Department/DepartmentName,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode,Role/RoleTitle"],
        expand: ["Action,BusinessUnitCode,Status,Author,Department,SubDepartment,Section,DepartmentCode,Role"],
      }
     
    ];
        break;
      case DataFrom.ExistingPosition:
          queries = [
      {
        StateValue: 1,
        ListName: ListNames.HRMSAdditionalHeadCountForExisitingPosition,
        Filter: filterParam,
        FilterCondition: filterConditions,
        select: ["*,Action/Action,Department/DepartmentName,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode,BusinessUnitCode/BusineesUnitCode,Status/StatusDescription,Author/EMail"],
        expand: [ "Action,Department,SubDepartment,Section,DepartmentCode,BusinessUnitCode,Status,Author"],
      }
    ];
        break;
        case DataFrom.VacancyRecruitmentProcess:
          queries = [
     
      {
        StateValue: 3,
        ListName: ListNames.HRMSVacancyReplacementRequest,
        Filter: filterParam,
        FilterCondition: filterConditions,
        select: [
           "*,Department/DepartmentName,BusinessUnitCode/BusineesUnitCode,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode, Status/StatusDescription,Author/EMail,JobCode/JobCode,JobCode/JobTitleInEnglish,JobTitleFrench/JobTitleInFrench,PatersonGrade/PatersonGrade,PatersonGrade/DRCGrade"
        ],
        expand: ["Department,BusinessUnitCode,SubDepartment,Section,DepartmentCode,Status,Author,JobCode,JobTitleFrench,PatersonGrade"],
      },
    ];
        break
      default:
        throw new Error(`Unhandled Type: ${Type}`);
    }


    const batchRes: Record<number, any[]> = await SPServices.batchGet(queries);

    if (!batchRes || !Object.keys(batchRes).length) {
      return { data: [], status: 200, message: "No records found" };
    }

    const additionalExistingItems: any[] = batchRes[1] || [];
    const newPositionItems: any[]        = batchRes[2] || [];
    const vacancyItems: any[]            = batchRes[3] || [];

    const additionalIds  = additionalExistingItems.map((i: any) => i.ID).filter(Boolean);
    const newPositionIds = newPositionItems.map((i: any) => i.ID).filter(Boolean);

    const [additionalPositionRes, newPositionRes] = await Promise.all([
      additionalIds.length > 0
        ? this.GetPositionDetails(
            [{ FilterKey: "LookupIDId", Operator: "in", FilterValue: additionalIds }],
            undefined,
            ListNames.HRMSAdditionalHCForExisitingPositionWithHeadCountDetails
          )
        : Promise.resolve({ data: [], status: 200, message: "" }),

      newPositionIds.length > 0
        ? this.GetPositionDetails(
            [{ FilterKey: "PositionRequestID", Operator: "in", FilterValue: newPositionIds }],
            undefined,
            ListNames.HRMSNewPositionRequestPositionDetails
          )
        : Promise.resolve({ data: [], status: 200, message: "" }),
    ]);

    const additionalPositionMap = new Map<number, any>(
      (additionalPositionRes.data ?? []).map((d: any) => [d.ID, d])
    );
    const newPositionMap = new Map<number, any>(
      (newPositionRes.data ?? []).map((d: any) => [d.ID, d])
    );

    const mapCommonFields = (item: any, index: number): Partial<DataSyncToRecruitmentResponse> => ({
      ID: item.ID,
              RecordID: index + 1,
              BusinessUnitCode: item.BusinessUnitCode ? item.BusinessUnitCode.BusineesUnitCode : "",
              BusinessUnitCodeId: item.BusinessUnitCodeId ? item.BusinessUnitCodeId : "",
              BusinessUnitName: "",
              BusinessUnitDescription: "",
              Nationality: item.Nationality,
              Department: item.Department?.DepartmentName || "",
              DepartmentId: item.DepartmentId,
              SubDepartment: item.SubDepartment?.SubDepTitle || "",
              SubDepartmentId: item.SubDepartmentId,
              Section: item.Section?.SectionName || "",
              SectionId: item.SectionId,
              DepartmentCodeId: item.DepartmentCodeId,
              DepartmentCode: item.DepartmentCode?.DptCode || "",
              EmploymentCategory: item.EmploymentCategory,
              TypeOfContract: item.TypeOfContract,
              NumberOfPersonNeeded: item?.NumberOfPersonNeeded,
              EnterNumberOfMonths: item?.EnterNumberOfMonths,
              AreaofWork: item.AreaofWork,
              DateRequried: item.DateRequried ? item?.DateRequried : null,
              Type: DataFrom.NewPosition,
              Status: item.Status ? item.Status.StatusDescription : "",
              StatusId: item?.StatusId,
              Action: item.Action?.Action ? item.Action?.Action : "",
              ActionTypeId: item.ActionId ? item.ActionId : "",
              Location: item?.Location || "",
    });

    const additionalExistingResult: DataSyncToRecruitmentResponse[] = additionalExistingItems.map(
      (item: any, index: number) => {
        const pos = additionalPositionMap.get(item.ID);
        return {
          ...mapCommonFields(item, index),
          Type: DataFrom.ExistingPosition,
          JobCode: pos?.jobCode ?? "",
          JobCodeId: pos?.JobCodeId ?? 0,
          JobTitleEnglish: pos?.title ?? "",
          JobTitleEnglishId: pos?.titleID ?? 0,
          JobTitleFrench: pos?.JobTitleFrench ?? "",
          JobTitleFrenchId: pos?.JobTitleFrenchId ?? 0,
          PatersonGrade: pos?.PatersonGrade ?? "",
          PatersonGradeId: pos?.PatersonGradeId ?? 0,
          DRCGrade: pos?.DRCGrade ?? "",
          DRCGradeId: pos?.DRCGradeId ?? 0,
        } as DataSyncToRecruitmentResponse;
      }
    );

    const newPositionResult: DataSyncToRecruitmentResponse[] = newPositionItems.map(
      (item: any, index: number) => {
        const pos = newPositionMap.get(item.ID);
        return {
          ...mapCommonFields(item, index),
          Type: DataFrom.NewPosition,
          JobCode: pos?.jobCode ?? "",
            JobCodeId: pos?.JobCodeId ?? 0,
          JobTitleEnglish: pos?.title ?? "",
            JobTitleEnglishId: pos?.titleID ?? 0,
          JobTitleFrench: pos?.JobTitleFrench ?? "",
            JobTitleFrenchId: pos?.JobTitleFrenchId ?? 0,
          PatersonGrade: pos?.PatersonGrade ?? "",
            PatersonGradeId: pos?.PatersonGradeId ?? 0,
          DRCGrade: pos?.DRCGrade ?? "",
            DRCGradeId: pos?.DRCGradeId ?? 0,
        } as DataSyncToRecruitmentResponse;
      }
    );

    const vacancyResult: DataSyncToRecruitmentResponse[] = vacancyItems.map(
      (item: any, index: number) => ({
        ...mapCommonFields(item, index),
        Type: DataFrom.VacancyRecruitmentProcess,
        JobCodeId: item?.JobCode?.ID ?? 0,
        JobCode: item?.JobCode?.JobCode ?? "",
        JobTitleEnglish: item?.JobCode?.JobTitleInEnglish ?? "",
        JobTitleEnglishId: item?.JobCode?.ID ?? 0,
        JobTitleFrench: item?.JobTitleFrench?.JobTitleInFrench ?? "",
        JobTitleFrenchId: item?.JobTitleFrenchId ?? 0,
        PatersonGrade: item?.PatersonGrade?.PatersonGrade ?? "",
        PatersonGradeId: item?.PatersonGradeId ?? 0,
        DRCGrade: item?.PatersonGrade?.DRCGrade ?? "",
        DRCGradeId: item?.PatersonGradeId ?? 0,
      } as DataSyncToRecruitmentResponse)
    );

    const GridResult: DataSyncToRecruitmentResponse[] = [
      ...additionalExistingResult,
      ...newPositionResult,
      ...vacancyResult,
    ].map((item, index) => ({ ...item, RecordID: index + 1 }));

    return {
      data: GridResult,
      status: 200,
      message: "GetNPAEPVRRDetails fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching GetNPAEPVRRDetails:", error);
    return { data: [], status: 500, message: "Error fetching data" };
  }
}

async GetRecruitmentDetails(
  filterParam: any,
  filterConditions: any
): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>> {
  try {
    const res: any[] = await SPServices.SPReadItems({
      Listname: ListNames.HRMSRecruitmentDptDetails,
      Select:  `*,Department/DepartmentName,Department/Code,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode,Status/StatusDescription,Action/Action,JobCode/JobCode,JobCode/ID,BusinessUnitCode/BusineesUnitCode`,
      Filter: filterParam,
      FilterCondition: filterConditions,
      Expand: `Department,SubDepartment,Section,DepartmentCode,Status,Action,JobCode,BusinessUnitCode`,
      Topcount: count.Topcount,
      Orderby: "ID",
      Orderbydecorasc: true,
    });

    if (!res.length) {
      return { data: [], status: 200, message: "No records found" };
    }

    const itemIds = res.map((item) => item.ID);

    const positionFilter = [
      { FilterKey: "RecruitmentID", Operator: "in", FilterValue: itemIds },
    ];

    const [GridResult, positionRes] = await Promise.all([
      Promise.resolve(_mapRecruitmentItems(res)),        
      this.GetPositionDetails(
        positionFilter,
        "and",
        ListNames.HRMSRecruitmentPositionDetails
      ),
    ]);

    const positionMap = new Map<number, any>(
      (positionRes.data ?? []).map((pos) => [pos.ID, pos])
    );

    for (const item of GridResult) {
      const pos = positionMap.get(item.ID);
      if (pos) {
        item.JobTitleEnglish = pos.title          ?? "";
        item.JobTitleEnglishId = pos.titleID        ?? 0;
        item.JobCode = pos.jobCode                ?? "";
        item.JobCodeId = pos.JobCodeId            ?? 0;
        item.JobTitleFrench  = pos.JobTitleFrench ?? "";
        item.JobTitleFrenchId = pos.JobTitleFrenchId ?? 0;
        item.PatersonGrade   = pos.PatersonGrade  ?? "";
        item.PatersonGradeId = pos.PatersonGradeId ?? 0;
        item.DRCGrade        = pos.DRCGrade       ?? "";
        item.DRCGradeId      = pos.DRCGradeId     ?? 0;
      }
    }

    return {
      data: GridResult,
      status: 200,
      message: "GetRecruitmentDetails fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching GetRecruitmentDetails:", error);
    return { data: [], status: 500, message: "Error fetching data" };
  }
}

async GetCandidateDetails(
  filterParam: any,
  filterConditions: any
): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>> {
  return this.fetchRecruitmentByLookup(
    ListNames.HRMSRecruitmentCandidatePersonalDetails,
    filterParam,
    filterConditions
  );
}

async GetSelectedCandidate(
  filterParam: any,
  filterConditions: any
): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>> {
  return this.fetchRecruitmentByLookup(
    ListNames.HRMSSelectedCandidateDetailsByHOD,
    filterParam,
    filterConditions
  );
}


private async fetchRecruitmentByLookup(
  listName: string,
  filterParam: any,
  filterConditions: any
): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>> {
  try {
    const res: any[] = await SPServices.SPReadItems({
      Listname: listName,
      Select: `*,RecruitmentID/Id`,
      Filter: filterParam,
      FilterCondition: filterConditions,
      Expand: `RecruitmentID`,
      Topcount: count.Topcount,
      Orderby: "ID",
      Orderbydecorasc: true,
    });

    if (!res.length) {
      return { data: [], status: 200, message: "No records found" };
    }

    const ids: number[] = res
      .map((item: any) => item.RecruitmentID?.Id)
      .filter(Boolean);

    if (!ids.length) {
      return { data: [], status: 200, message: "No linked recruitment records found" };
    }

    const recruitmentFilter = [
      { FilterKey: "ID", Operator: "in", FilterValue: ids },
    ];

    return await this.GetRecruitmentDetails(recruitmentFilter, filterConditions);

  } catch (error) {
    console.error(`Error fetching from ${listName}:`, error);
    return { data: [], status: 500, message: "Error fetching data" };
  }
}

async GetPositionDetails(
  Filter: any[],
  filterConditions: any,
  ListName: string
): Promise<ApiResponse<any[]>> {
  try {
    const resdata = await SPServices.SPReadItems({
      Listname: ListName,
      Select:
        "*,JobTitleEnglish/JobTitleInEnglish,JobTitleEnglish/JobCode,DRCGrade/DRCGrade,PatersonGrade/PatersonGrade,JobTitleFrench/JobTitleInFrench",
      Filter: Filter,
      FilterCondition: filterConditions,
      Expand: "JobTitleEnglish,DRCGrade,JobTitleFrench,PatersonGrade",
      Topcount: count.Topcount,
    });

    const result = resdata.map((item: any, index: number) => ({
      ID: item?.LookupIDId ?? item?.PositionRequestIDId ?? item?.RecruitmentIDId ?? 0,
      id: index + 1,
      title: item?.JobTitleEnglish?.JobTitleInEnglish ?? "",
      titleID: item?.JobTitleEnglishId ?? 0,
      jobCode: item?.JobTitleEnglish?.JobCode ?? "",
      JobCodeId: item?.JobTitleEnglishId ?? 0,
      DRCGrade: item?.DRCGrade?.DRCGrade ?? "",
      DRCGradeId: item?.DRCGradeId ?? 0,
      PatersonGrade: item?.PatersonGrade?.PatersonGrade ?? "",
      PatersonGradeId: item?.PatersonGradeId ?? 0,
      JobTitleFrench: item?.JobTitleFrench?.JobTitleInFrench ?? "",
      JobTitleFrenchId: item?.JobTitleFrenchId ?? 0,
      ActualVacantPosition: ListName === ListNames.HRMSAdditionalHCForExisitingPositionWithHeadCountDetails
        ? item?.ActualVacantPosition ?? 0
        : "",
    }));

    return { data: result, status: 200, message: "GetPositionDetails fetched successfully" };
  } catch (error) {
    console.error("GetPositionDetails error:", error);
    return { data: [], status: 500, message: "Error fetching position details" };
  }
}


async InsertRecruitmentDptBatch(
  payloads: PostRecuritmentData[]
): Promise<ApiResponse<any[]>> {
  try {
    if (!payloads.length) {
      return { data: [], status: 200, message: "No payloads to insert" };
    }

    const [batchedSP1, execute1] = getSP().batched();

    const mainPromises = payloads.map((payload) =>
      batchedSP1.web.lists
        .getByTitle(ListNames.HRMSRecruitmentDptDetails)
        .items.add(payload.Data)
    );

    const updatePromises = payloads
      .filter((payload) => payload.updatePreList?.ID)
      .map((payload) => {
        const listName =
          payload.Data.DataFrom === DataFrom.NewPosition
            ? ListNames.HRMSNewPositionRequest
            : payload.Data.DataFrom === DataFrom.ExistingPosition
            ? ListNames.HRMSAdditionalHeadCountForExisitingPosition
            : ListNames.HRMSVacancyReplacementRequest;

        return batchedSP1.web.lists
          .getByTitle(listName)
          .items.getById(payload.updatePreList!.ID)
          .update({
            ActionId:                payload.updatePreList!.ActionId,
            ItemCreated:             payload.updatePreList!.ItemCreated,
            IsDataSyncToRecruitment: payload.updatePreList!.IsDataSyncToRecruitment,
          });
      });

    await execute1();

    const [mainResults] = await Promise.all([
      Promise.all(mainPromises),
      Promise.all(updatePromises),      
    ]);

    const failedIndex = mainResults.findIndex((res) => !res?.ID);
    if (failedIndex !== -1) {
      return {
        data:    [],
        status:  500,
        message: `Main insert failed at payload index ${failedIndex}`,
      };
    }

    const enriched = mainResults.map((res, index) => ({
      insertedID: res.ID as number,
      payload:    payloads[index],
    }));


    const [batchedSP2, execute2] = getSP().batched();

    const positionPromises = enriched
      .filter(({ payload }) => payload.PositionData)
      .map(({ insertedID, payload }) =>
        batchedSP2.web.lists
          .getByTitle(ListNames.HRMSRecruitmentPositionDetails)
          .items.add({
            ...payload.PositionData,
            RecruitmentIDId: insertedID,   
          })
      );

    const commentPromises = enriched
      .filter(({ payload }) => payload.CommentsList)
      .map(({ insertedID, payload }) =>
        batchedSP2.web.lists
          .getByTitle(ListNames.HRMSRecruitmentComments)
          .items.add({
            ...payload.CommentsList,
            RecruitmentIDId: insertedID,  
          })
      );

    await execute2();

    await Promise.all([
      Promise.all(positionPromises),
      Promise.all(commentPromises),
    ]);

    return {
      data:    mainResults,
      status:  200,
      message: `Batch insert successful for ${payloads.length} record(s)`,
    };
  } catch (error) {
    console.error("InsertRecruitmentDptBatch error:", error);
    return { data: [], status: 500, message: "Batch insert failed" };
  }
}

async GetHRMSRecruitmentRoleProfileDetails(
  filterParam: any[],
  filterConditions: any
): Promise<ApiResponse<any | null>> {
  try {
    const BATCH_IDX = {
      ROLE_KNOWLEDGE: 0,
      LEVEL_PROFICIENCY: 1,
      TECHNICAL_SKILLS: 2,
      EXPERIENCE: 3,
      QUALIFICATION: 4,
      FUNCTION_TYPE: 5,
    } as const;

    const masterQueries: BatchQuery[] = [
      {
        ListName: ListNames.HRMSRoleSpecificKnowlegeMaster,
        select: ["*"],
        StateValue: BATCH_IDX.ROLE_KNOWLEDGE
      },
      {
        ListName: ListNames.HRMSLevelOfProficiency,
        select: ["*"],
        StateValue: BATCH_IDX.LEVEL_PROFICIENCY
      },
      {
        ListName: ListNames.HRMSTechnicalSkills,
        select: ["*"],
        StateValue: BATCH_IDX.TECHNICAL_SKILLS
      },
      {
        ListName: ListNames.HRMSExperienceMaster,
        select: ["*"],
        StateValue: BATCH_IDX.EXPERIENCE
      },
      {
        ListName: ListNames.HRMSQualification,
        select: ["*"],
        StateValue: BATCH_IDX.QUALIFICATION
      },
      {
        ListName: ListNames.HRMSJobTitleFunctionType,
        select: ["*"],
        StateValue: BATCH_IDX.FUNCTION_TYPE
      },
    ];

    const [batchRes, listItems]: [Record<number, any[]>, any[]] =
      await Promise.all([
        SPServices.batchGet(masterQueries),
        SPServices.SPReadItems({
          Listname: ListNames.HRMSRecruitmentRoleProfileDetails,
          Select:
            "*,JobDescription,RoleProfile,RoleSpecificKnowledgeJson,TechnicalSkillsKnowledgeJson,YearofExperience,PreferredExperience/ID,PreferredExperience/ExperienceInYearRange,Qualification,PreferredQualification,TotalPreferredExperience/ID,TotalPreferredExperience/ExperienceInYearRange,FunctionType/FunctionType,FunctionType/ID,FunctionType/FunctionTypeFrench,JobCode/JobCode,JobCode/ID",
          Filter: filterParam,
          FilterCondition: filterConditions,
          Expand: "PreferredExperience,TotalPreferredExperience,FunctionType,JobCode",
          Orderby: "ID",
          Orderbydecorasc: false,
        }),
      ]);

    const roleKnowledgeMaster: any[]    = batchRes[BATCH_IDX.ROLE_KNOWLEDGE]   ?? [];
    const levelProficiencyMaster: any[] = batchRes[BATCH_IDX.LEVEL_PROFICIENCY] ?? [];
    const technicalSkillsMaster: any[]  = batchRes[BATCH_IDX.TECHNICAL_SKILLS]  ?? [];
    const experienceMaster: any[]       = batchRes[BATCH_IDX.EXPERIENCE]        ?? [];
    const qualificationMaster: any[]    = batchRes[BATCH_IDX.QUALIFICATION]     ?? [];
    const functionTypeMaster: any[]     = batchRes[BATCH_IDX.FUNCTION_TYPE]     ?? [];

    const roleKnowledgeMap = roleKnowledgeMaster.reduce((acc, item) => {
      acc[item.Code] = {
        en: item.RoleSpecificKnowledge,
        fr: item.RoleSpecificKnowledgeFrench,
      };
      return acc;
    }, {} as Record<string, { en: string; fr: string }>);

    const levelProficiencyMap = levelProficiencyMaster.reduce((acc, item) => {
      acc[item.Code] = {
        en: item.Levels,
        fr: item.LevelsFrench,
      };
      return acc;
    }, {} as Record<string, { en: string; fr: string }>);

    const technicalSkillsMap = technicalSkillsMaster.reduce((acc, item) => {
      acc[item.Code] = {
        en: item.TechnicalSkills,
        fr: item.TechnicalSkillsfrench,
      };
      return acc;
    }, {} as Record<string, { en: string; fr: string }>);

    const qualificationMap = qualificationMaster.reduce((acc, item) => {
      acc[item.QualificationCode] = {
        en: item.Qualification,
        fr: item.QualificationFrench,
      };
      return acc;
    }, {} as Record<string, { en: string; fr: string }>);

    const experienceMap = new Map<number, string>(
      experienceMaster.map((exp) => [exp.ID, exp.ExperienceInYearRange])
    );

    const functionTypeMap = functionTypeMaster.reduce((acc, item) => {
      acc[item.ID] = {
        en: item.FunctionType,
        fr: item.FunctionTypeFrench,
      };
      return acc;
    }, {} as Record<string, { en: string; fr: string }>);

    const formattedItems = listItems.map((item) => {
      const roleKnowledgeArray: RoleSpecKnowledge[] = JSON.parse(
        item.RoleSpecificKnowledgeJson || "[]"
      );
      const techSkillsArray = JSON.parse(
        item.TechnicalSkillsKnowledgeJson || "[]"
      );
      const qualificationArray = JSON.parse(item.Qualification || "[]");
      const PrefeQualification = JSON.parse(item.PreferredQualification || "[]");

      const mergedQualifications = [...qualificationArray, ...PrefeQualification];

      const RoleSpeKnowledge = roleKnowledgeArray.map((rk: any) => {
        const knowledge = roleKnowledgeMap[rk.RoleSpeKnowledge];
        const Level = levelProficiencyMap[rk.RequiredLevel];
        return {
          RoleSpeKnowledge:    { key: rk.RoleSpeKnowledge, text: knowledge?.en ?? "" },
          RoleSpeKnowledge_fr: { key: rk.RoleSpeKnowledge, text: knowledge?.fr ?? "" },
          RequiredLevel:       { key: rk.RequiredLevel,    text: Level?.en ?? "" },
          RequiredLevel_fr:    { key: rk.RequiredLevel,    text: Level?.fr ?? "" },
        };
      });

      const TechnicalSkills = techSkillsArray.map((ts: any) => {
        const technical = technicalSkillsMap[ts.TechnicalSkills];
        const Level = levelProficiencyMap[ts.LevelProficiency];
        return {
          TechnicalSkills:    { key: ts.TechnicalSkills,   text: technical?.en ?? "" },
          TechnicalSkills_fr: { key: ts.TechnicalSkills,   text: technical?.fr ?? "" },
          LevelProficiency:   { key: ts.LevelProficiency,  text: Level?.en ?? "" },
          LevelProficiency_fr:{ key: ts.LevelProficiency,  text: Level?.fr ?? "" },
        };
      });

      const Qualification = mergedQualifications.map((qu) => {
        const qualificationKey = qu.MinQualification ?? qu.PrefeQualification;
        const qualiValue = qualificationMap[qualificationKey ?? ""];

        if (qu.PrefeQualification) {
          return {
            PrefeQualification:    { key: qualificationKey, text: qualiValue?.en ?? "" },
            PrefeQualification_fr: { key: qualificationKey, text: qualiValue?.fr ?? "" },
          };
        }
        return {
          MinQualification:    { key: qualificationKey, text: qualiValue?.en ?? "" },
          MinQualification_fr: { key: qualificationKey, text: qualiValue?.fr ?? "" },
        };
      });

      const qualificationValue: QualificationValue = Qualification.reduce(
        (acc, item) => {
          if (item.MinQualification)     acc.MinQualification.push(item.MinQualification);
          if (item.PrefeQualification)   acc.PrefeQualification.push(item.PrefeQualification);
          if (item.MinQualification_fr)  acc.MinQualification_fr.push(item.MinQualification_fr);
          if (item.PrefeQualification_fr)acc.PrefeQualification_fr.push(item.PrefeQualification_fr);
          return acc;
        },
        {
          MinQualification: [],
          PrefeQualification: [],
          MinQualification_fr: [],
          PrefeQualification_fr: [],
        } as QualificationValue
      );

      const functionType = functionTypeMap[item.FunctionType?.ID ?? ""];

      return {
        ID: item.ID,
        RecruitmentID:              item?.RecruitmentID?.ID || "",
        RolePurpose:                stripHtml(item.RoleProfile) || "",
        JobDescription:             stripHtml(item.JobDescription) || "",
        RolePurpose_fr:             stripHtml(item.RoleProfileFrench) || "",
        JobDescription_fr:          stripHtml(item.JobDescriptionFrench) || "",
        TotalExperience:            { key: item.TotalPreferredExperience?.ID, text: item.TotalPreferredExperience?.ExperienceInYearRange || "" },
        ExperienceinMiningIndustry: { key: item.PreferredExperience?.ID,      text: item.PreferredExperience?.ExperienceInYearRange || "" },
        RoleSpeKnowledgeValue:      RoleSpeKnowledge,
        TechnicalSkillValue:        TechnicalSkills,
        qualificationValue:         qualificationValue,
        JobFunctionalType:          { key: item.FunctionType?.ID, text: functionType?.en },
        JobFunctionalType_fr:       { key: item.FunctionType?.ID, text: functionType?.fr },
        JobBasedBGVVerification:    JSON.parse(item.JobBasedBGVVerification),
      };
    });

    return {
      data: formattedItems,
      status: 200,
      message: "GetHRMSRecruitmentRoleProfileDetails fetched successfully",
    };
  } catch (error) {
    console.error(
      "Error fetching data GetHRMSRecruitmentRoleProfileDetails:",
      error
    );
    return {
      data: [],
      status: 500,
      message: "Error fetching data from GetHRMSRecruitmentRoleProfileDetails",
    };
  }
}

    async GetBGVerificationType(): Promise<ApiResponse<any | null>> {
        try {
            const response = await BGverification.GetBGVerificationType();
            return {
                data: response.data,
                status: response.status,
                message: response.data.message,
            };
        } catch (error) {
            console.error(
                "Error inserting data into AdvertisementDetails:",
                error
            );
            return {
                data: [],
                status: 500,
                message: "Error inserting data into AdvertisementDetails",
            };
        }
    }

      async PostCommentsData(
    obj: InsertComments
  ): Promise<ApiResponse<InsertComments | null>> {
    try {
      await SPServices.SPAddItem({
        Listname: ListNames.HRMSRecruitmentComments,
        RequestJSON: obj,
      });

      return {
        data: null,
        status: 200,
        message: "Data Submitted successfully",
      };
    } catch (error) {
      console.error("Error posting user data:", error);
      return {
        data: null,
        status: 400,
        message: "Error On Posting Data",
      };
    }
  }

  async UploadAdvertisementInPortal(
  Filter: any[],
  Condition: string,
  RecuritmentDetails: IDptData,
  IsActive: number,
  IsExtened: number,
  JobBasedBGVVerification?: string
): Promise<ApiResponse<null>> {
  try {

    const ROLE_PROFILE = 0;
    const JOB_PORTAL   = 1;

    const queries: BatchQuery[] = [
      {
        StateValue: ROLE_PROFILE,
        ListName: ListNames.HRMSRecruitmentRoleProfileDetails,
        Filter: Filter,
        FilterCondition: Condition || "",
        select: [
          "*",
          "JobDescription",
          "RoleProfile",
          "TotalPreferredExperience/ExperienceInYearRange",
          "PreferredExperience/ExperienceInYearRange",
          "FunctionType/Code",
          "JobCode/JobCode",
        ],
        expand: [
          "PreferredExperience",
          "TotalPreferredExperience",
          "FunctionType",
          "JobCode",
        ],
      },
      {
        StateValue: JOB_PORTAL,
        ListName: ListNames.RecruitAppCareerPortalIntegration,
        Filter: [
          { FilterKey: "JobCodeId", Operator: "eq", FilterValue: RecuritmentDetails.JobCodeId },
          { FilterKey: "IsActive",  Operator: "eq", FilterValue: 1 },
        ],
        FilterCondition: "and",
        select: ["*"],
        Orderby: "ID",
        Orderbydecorasc: true,
      },
    ];

    const batchRes: Record<number, any[]> = await SPServices.batchGet(queries);

    const roleProfileList = batchRes[ROLE_PROFILE] ?? [];
    const jobPortalList   = batchRes[JOB_PORTAL]   ?? [];
if( JobBasedBGVVerification){
   await SPServices.SPUpdateItem({
          Listname: ListNames.HRMSRecruitmentRoleProfileDetails,
          RequestJSON: {
            JobBasedBGVVerification: JobBasedBGVVerification,
          },
           ID: jobPortalList[0].ID
        })
}
    

    if (roleProfileList.length === 0) {
      return { data: null, status: 400, message: "No role profile data found" };
    }

    if (jobPortalList.length === 0) {
      return { data: null, status: 400, message: "No portal job data found" };
    }

    const data           = roleProfileList[0];
    const jobUniqueKey   = jobPortalList[0].JobUniqueKey;

    const roleSpecificKnowledge: any[] = data.RoleSpecificKnowledgeJson
      ? JSON.parse(data.RoleSpecificKnowledgeJson)
      : [];

    const technicalSkill: any[] = data.TechnicalSkillsKnowledgeJson
      ? JSON.parse(data.TechnicalSkillsKnowledgeJson)
      : [];

    const roleSpecificSkills: RoleAndTechSkills[] = roleSpecificKnowledge.map(
      (item: any) => ({
        skillId: String(item.RoleSpeKnowledge || ""),
        levelId: String(item.RequiredLevel    || ""),
      })
    );

    const technicalSkills: RoleAndTechSkills[] = technicalSkill.map(
      (item: any) => ({
        skillId: String(item.TechnicalSkills  || ""),
        levelId: String(item.LevelProficiency || ""),
      })
    );

    const Roleandtechnical: RoleAndTechSkills[] = [
      ...roleSpecificSkills,
      ...technicalSkills,
    ];

    const minQualifications: MinAndPreferedQualifications[] = data.Qualification
      ? JSON.parse(data.Qualification).map((item: any) => ({
          qualification: item.MinQualification,
          type: 0,
        }))
      : [];

    const preferredQualifications: MinAndPreferedQualifications[] =
      data.PreferredQualification
        ? JSON.parse(data.PreferredQualification).map((item: any) => ({
            qualification: item.PrefeQualification,
            type: 1,
          }))
        : [];

    const MinAndPreferedQualification: MinAndPreferedQualifications[] = [
      ...minQualifications,
      ...preferredQualifications,
    ];

    const decodeBase64 = (str: string): string => {
      const utf8Bytes = new TextEncoder().encode(str);
      const binary    = String.fromCharCode.apply(null, Array.from(utf8Bytes));
      return btoa(binary);
    };

    const Description: Descriptions = {
      jobTitle:       RecuritmentDetails.JobTitleEnglish,
      jobShortSummary: decodeBase64(data.RoleProfile    || ""),
      jobSummary:      decodeBase64(data.JobDescription || ""),
    };

    const DescriptionFr: Descriptions = {
      jobTitle:        RecuritmentDetails.JobTitleFrench,
      jobShortSummary: decodeBase64(data.RoleProfileFrench      || ""),
      jobSummary:      decodeBase64(data.JobDescriptionFrench   || ""),
    };

    const onamdocpathfile = await CommonServices.GetAttachmentLink(
      RecuritmentDetails.JobCode,
      DocumentLibraray.ONAMSignedStampDocuments
    );

    const onemdocPath = String(onamdocpathfile.data);

    // const DepartmentCode = MasterData.Department.find(
    //   (item: { text: string }) => item.text === RecuritmentDetails.Department
    // );

    const FilterDept = [{ FilterKey: "DepartmentId", Operator: "eq", FilterValue: RecuritmentDetails.DepartmentID },]
    const DepartmentData = await CommonServices.GetMasterData(ListNames.HRMSDepartment,FilterDept )
    console.log(DepartmentData,"DepartmentData");
    
    const NationalityValue =
      RecuritmentDetails.Nationality === Nationality.Nationals
        ? "Congolese"
        : RecuritmentDetails.Nationality;
const todaydate = new Date();
        const vaildFrom = todaydate
        const VaildTo = AddCalculateDate(todaydate, 13)

    const advertisementDetails: AdvertisementDetails = {
      jobCode:        jobUniqueKey,
      isActive:       IsActive,
      noOfPositions:  String(RecuritmentDetails?.NumberOfPersonNeeded),
      validFrom:      vaildFrom  ?? null,
      validTo:        VaildTo    ?? null,
      employmentType: "Full Time",
      departmentId:   DepartmentData.data[0]?.Code          || "",
      role:           null,
      functionId:     String(data.FunctionType?.Code || ""),
      onemdocPath:    onemdocPath                   ?? "",
      experience:     String(data.TotalPreferredExperience?.ExperienceInYearRange || ""),
      nationality:    NationalityValue,
      Descriptions_en:              Description,
      Descriptions_fr:              DescriptionFr,
      RoleAndTechSkills:            Roleandtechnical,
      MinAndPreferedQualifications: MinAndPreferedQualification,
      IsExtened:                    IsExtened,
    };

    const response = await CareerPotalServices.UpsertJobs(advertisementDetails);

    if (response.status === ResponeStatus.SUCCESS) {
      return { data: null, status: 200, message: "Advertisement posted successfully" };
    }

    return { data: null, status: 500, message: "Error while posting advertisement details" };

  } catch (error) {
    console.error("Error posting advertisement data:", error);
    return { data: null, status: 400, message: "Error On Posting Data" };
  }
}

async UpsertBGVJobMaster(UpsertData: UpsertBGV[]): Promise<ApiResponse<any | null>> {
        try {
            const response = await BGverification.UpsertBGVJobMaster(UpsertData);
            return {
                data: response.data,
                status: response.status,
                message: response.data.message,
            };
        } catch (error) {
            console.error(
                "Error inserting data into AdvertisementDetails:",
                error
            );
            return {
                data: [],
                status: 500,
                message: "Error inserting data into AdvertisementDetails",
            };
        }
    }

}