import { IselectedPosition } from "../../components/Screens/OfferRelease/ReviewDocument/PositionFrame";
import { ApiResponse } from "../../models/apimodels";
import { ListNames } from "../../utilities/Config";
import { CandidateTable } from "../ServiceExport";
import { BatchQuery } from "../SPService/Ispservice";
import SPServices from "../SPService/spservice";
import { IOfferService } from "./IOfferService";

export default class OfferService implements IOfferService {
  async GetSelectedCandidate(
    RecID: number,
    CandidateID: number,
    SelectedCandidateID: number,
    JobRequestID: string,
  ): Promise<ApiResponse<IselectedPosition | null>> {
    try {
      const queries: BatchQuery[] = [
        {
          StateValue: 1,
          ListName: ListNames.HRMSRecruitmentDptDetails,
          Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: RecID }],
          FilterCondition: "and",
          select: [
            "*",
            "Department/DepartmentName",
            "Department/Code",
            "SubDepartment/SubDepTitle",
            "Section/SectionName",
            "DepartmentCode/DptCode",
            "Status/StatusDescription",
            "Action/Action",
            "JobCode/JobCode",
            "JobCode/ID",
            "BusinessUnitCode/BusineesUnitCode",
          ],
          expand: [
            "Department",
            "SubDepartment",
            "Section",
            "DepartmentCode",
            "Status",
            "Action",
            "JobCode",
            "BusinessUnitCode",
          ],
        },
        {
          StateValue: 2,
          ListName: ListNames.HRMSRecruitmentPositionDetails,
          Filter: [
            { FilterKey: "RecruitmentID", Operator: "eq", FilterValue: RecID },
          ],
          FilterCondition: "and",
          select: [
            "*",
            "JobTitleEnglish/JobTitleInEnglish",
            "JobTitleEnglish/JobCode",
            "DRCGrade/DRCGrade",
            "PatersonGrade/PatersonGrade",
            "JobTitleFrench/JobTitleInFrench",
          ],
          expand: [
            "JobTitleEnglish",
            "DRCGrade",
            "JobTitleFrench",
            "PatersonGrade",
          ],
        },
        {
          StateValue: 3,
          ListName: ListNames.HRMSRecruitmentCandidatePersonalDetails,
          Filter: [
            { FilterKey: "ID", Operator: "eq", FilterValue: CandidateID },
          ],
          FilterCondition: "and",
          select: ["*", "Status/StatusDescription", "RecruitmentID/Id"],
          expand: ["RecruitmentID", "Status"],
        },
        {
          StateValue: 4,
          ListName: ListNames.HRMSSelectedCandidateDetailsByHOD,
          Filter: [
            {
              FilterKey: "ID",
              Operator: "eq",
              FilterValue: SelectedCandidateID,
            },
          ],
          FilterCondition: "and",
          select: [
            "*",
            "Status/StatusDescription",
            "RecruitmentID/Id",
            "CandidateID/ID",
            "PositionID/PositionID",
          ],
          expand: ["RecruitmentID", "Status", "CandidateID", "PositionID"],
        },
      ];

      // ── Fire both calls simultaneously ────────────────────────────────────────
      const [batchRes, careerRes] = await Promise.all([
        SPServices.batchGet(queries),
        CandidateTable.fetchCandidateDetails(JobRequestID),
      ]);

      // ── Destructure SP results ────────────────────────────────────────────────
      const recruitment = batchRes[1]?.[0] as any;
      const recruitmentPosition = batchRes[2]?.[0] as any;
      const candidatePersonal = batchRes[3]?.[0] as any;
      const candidateSelected = batchRes[4]?.[0] as any;

      // ── Destructure .NET result ───────────────────────────────────────────────
      // const careerData = careerRes?.data?.[0]?.employeeReferenceDetails ?? {};
      const ref = careerRes?.data?.[0]?.PreviousEmployerDetails;

      // ── Map to interface ──────────────────────────────────────────────────────
      const mappedData: IselectedPosition = {
        JobTiltle: recruitmentPosition?.JobTitleEnglish?.JobTitleInEnglish,
        JobCode: recruitmentPosition?.JobTitleEnglish?.JobCode,
        positionID: candidateSelected?.PositionID?.PositionID,
        ApplicantName: candidatePersonal?.ApplicantName,
        Nationality: candidatePersonal?.Nationality,
        Gender: candidatePersonal?.Gender,
        ProofOfIdentity: candidatePersonal?.ProofOfIdentity,
        IdentityNumber: candidatePersonal?.IdentityNumber,
        Email: candidatePersonal?.Email,
        Location: candidatePersonal?.Location,
        BusinessUnitCode: recruitment?.BusinessUnitCode?.BusineesUnitCode,
        Department: recruitment?.Department?.DepartmentName,
        SubDepartment: recruitment?.SubDepartment?.SubDepTitle,
        Section: recruitment?.Section?.SectionName,
        DepartmentCode: recruitment?.DepartmentCode?.DptCode,
        EmploymentCategory: recruitment?.EmploymentCategory,
        TypeofContract: recruitment?.TypeofContract,
        AreaofWork: recruitment?.AreaofWork,
        JoiningDate: careerRes?.data?.[0]?.joiningDate ?? "-",
        NoticePeriod: careerRes?.data?.[0]?.noticePeriod ?? "-",
        ReferenceName: ref?.name ?? "-",
        ReferenceDesignation: ref?.Designation ?? "-",
        ReferenceEmail: ref?.Email ?? "-",
        ReferencePhone: ref?.ContractNumber ?? "-",
        ReferenceCompanyName: ref?.CompanyName ?? "-",
      };

      return {
        data: mappedData,
        status: 200,
        message: "Selected candidate fetched successfully",
      };
    } catch (error) {
      console.error("GetSelectedCandidate error:", error);
      return {
        data: null,
        status: 500,
        message: "Error fetching selected candidate",
      };
    }
  }
}
