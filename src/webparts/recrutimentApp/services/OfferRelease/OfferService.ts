import {
  IPreChecklist,
  IselectedPosition,
} from "../../components/Screens/OfferRelease/ReviewDocument/PositionFrame";
import { ApiResponse } from "../../models/apimodels";
import { initiateLaborHire, UploadDocument } from "../../models/Icareerportal";
import {
  ActionName,
  BGVDocumentName,
  DocumentFolderName,
  RoleName,
} from "../../utilities/ConditionConfig";
import { DocumentLibraray, ListNames } from "../../utilities/Config";
import {
  BGverification,
  GetJobRequestData,
  LaborHire,
} from "../AxiosService/CareerPortalAPI";
import { CandidateTable } from "../ServiceExport";
import { BatchQuery, IDocFiles } from "../SPService/Ispservice";
import SPServices from "../SPService/spservice";
import {
  DocumentName,
  GetBGVDocument,
  GetCandidateDocument,
  GetDOTAfricaCF,
  InitiateLaborHire,
  IOfferService,
  IUpdateCandidate,
  IUpdateStatusSelectedHOD,
  UpdateCandidateData,
} from "./IOfferService";

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

      const ref = careerRes?.data?.[0]?.PreviousEmployerDetails;

      const PPT = careerRes?.data?.[0]?.PPEDetails?.map((item: any) => {
        return {
          kit: item?.PPEType,
          size: item?.PPESize,
        };
      });

      const getDotAfricaCF = (await SPServices.getDocLibFiles({
        FilePath: `${DocumentLibraray.HRMSCareerPortalCandidateCV}/${careerRes?.data?.[0]?.profileID}/${JobRequestID}/${DocumentFolderName.BackgroundVerification}/${"ConsentForm"}`,
      })) as IDocFiles[];

      let PreOnboarding: IPreChecklist = {
        BackgroundChecks:
          candidatePersonal?.BackgroundChecks === ActionName.Completed
            ? true
            : false,
        SignedOfferLetterVerified:
          candidatePersonal?.SignedOfferLetterVerified === ActionName.Completed
            ? true
            : false,
        VisaProcess:
          candidatePersonal?.VisaProcess === ActionName.Completed
            ? true
            : false,
        AccommodationBooked:
          candidatePersonal?.AccommodationBooked === ActionName.Completed
            ? true
            : false,
        SignedEmploymentContract:
          candidatePersonal?.SignedEmploymentContract === ActionName.Completed
            ? true
            : false,
        WorkPermitApproved:
          candidatePersonal?.WorkPermitApproved === ActionName.Completed
            ? true
            : false,
        TravelProcess:
          candidatePersonal?.TravelProcess === ActionName.Completed
            ? true
            : false,
        MedicalCheckStatus:
          candidatePersonal?.MedicalCheckStatus === ActionName.Completed
            ? true
            : false,
        ReadyForOnboarding:
          candidatePersonal?.ReadyforOnboarding === ActionName.Completed
            ? true
            : false,
      };

      const mappedData: IselectedPosition = {
        ID: SelectedCandidateID,
        CandidateID: CandidateID,
        RecID: RecID,
        JobTiltle: recruitmentPosition?.JobTitleEnglish?.JobTitleInEnglish,
        JobCode: recruitmentPosition?.JobTitleEnglish?.JobCode,
        positionID: candidateSelected?.PositionID?.PositionID,
        ApplicantName: [
          candidatePersonal.FristName,
          candidatePersonal.MiddleName,
          candidatePersonal.LastName,
        ]
          .filter(Boolean)
          .join(" "),
        // .trim(),`${?.firstName || ""} ${candidatePersonal?.middleName || ""} ${candidatePersonal?.lastName || ""}`,
        Nationality: candidatePersonal?.Nationality,
        Gender: candidatePersonal?.Gender,
        ProofOfIdentity: candidatePersonal?.ProofOfIdentity,
        IdentityNumber: candidatePersonal?.IdentityNumber,
        Email: candidatePersonal?.Email,
        Location: "DRC", // candidatePersonal?.Location,
        BusinessUnitCode: recruitment?.BusinessUnitCode?.BusineesUnitCode,
        BusinessUnitCodeId: recruitment?.BusinessUnitCode?.Id,
        Department: recruitment?.Department?.DepartmentName,
        SubDepartment: recruitment?.SubDepartment?.SubDepTitle,
        Section: recruitment?.Section?.SectionName,
        DepartmentCode: recruitment?.DepartmentCode?.DptCode,
        EmploymentCategory: recruitment?.EmploymentCategory,
        TypeofContract: recruitment?.TypeOfContract,
        AreaofWork: recruitment?.AreaofWork,
        JoiningDate: careerRes?.data?.[0]?.joiningDate ?? "-",
        NoticePeriod: careerRes?.data?.[0]?.noticePeriod ?? "-",
        ReferenceName: ref?.name ?? "-",
        ReferenceDesignation: ref?.Designation ?? "-",
        ReferenceEmail: ref?.Email ?? "-",
        ReferencePhone: ref?.ContractNumber ?? "-",
        ReferenceCompanyName: ref?.CompanyName ?? "-",
        StatusID: candidateSelected?.StatusId,

        ProfileID: String(careerRes?.data?.[0]?.profileID) ?? "-",
        JobRequestID: String(JobRequestID) ?? "-",
        PPEItems: PPT ?? [],
        DotAfricaCF: getDotAfricaCF[0],
        NationalityCode: careerRes?.data?.[0]?.NatioCode ?? "",

        patersonGrade: recruitmentPosition?.PatersonGrade?.PatersonGrade,
        drcGrade: recruitmentPosition?.DRCGrade?.DRCGrade,
        PreChecklist: PreOnboarding,
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

  async InitiateLabouHireOfferRelease(
    data: InitiateLaborHire,
    CurrentUserEmail: string,
  ): Promise<ApiResponse<null>> {
    try {
      const res: any[] = await SPServices.SPGetItems({
        Listname: data.IsExpat
          ? ListNames.HRMSRESIExpatDetails
          : ListNames.HRMSRESIDRCDetails,
        Filter: [
          {
            FilterKey: "SelectedCandidateHODId",
            Operator: "eq",
            FilterValue: data.ID,
          },
        ],
        Select: "*,SelectedCandidateHODId/ID,LabourhireORContractor/AgentCode",
        Expand: "SelectedCandidateHODId,LabourhireORContractor",
      });
      // console.log(res, "responseData");
      const todaydate = new Date();
      let laborHireData: initiateLaborHire = {
        jobRequestID: Number(data?.jobRequestID),
        positionId: data?.positionId,
        location: data?.location,
        businessUnit: data?.businessUnit,
        department: data?.department,
        section: data?.section,
        patersonGrade: data.patersonGrade,
        drcGrade: data.drcGrade,
        reportingManager: RoleName.RecruitmentHR,
        dateOfJoining: data?.dateOfJoining
          ? new Date(data?.dateOfJoining)
          : new Date(),
        typeOfContract: data?.typeOfContract,
        noOfMonths:
          data?.noOfMonths === "" ? "20" : (String(data?.noOfMonths) ?? "0"),
        netPay: data.IsExpat
          ? res[0]?.ProposedNetUSDAmount
          : res[0]?.ProposedNetAmount,
        lhCode: res[0]?.LabourhireORContractor?.AgentCode,
        createdOn: new Date(todaydate),
        createdBy: RoleName.RecruitmentHR,
        createrEmail: CurrentUserEmail,
      };
      let response = await LaborHire.initiateLaborHire(laborHireData);

      return {
        data: response.data,
        status: response.status,
        message: "Error while posting advertisement details",
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

  FetchBGVerificationDOcs = async (
    DocumentName: GetBGVDocument,
  ): Promise<ApiResponse<any>> => {
    try {
      let response: any = [];

      if (DocumentName?.DocumentName?.length > 0) {
        const BGVDocs = await Promise.all(
          DocumentName.DocumentName.map(async (item) => {
            if (!SPServices?.getDocLibFiles) {
              console.error("SPServices.getDocLibFiles is undefined");
              return null;
            }

            const files = await SPServices.getDocLibFiles({
              FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}/${DocumentName.RequestID}/${DocumentName.DocumentType}/${item}`,
            });
            // console.log(files, "Files.IDV");

            // const latestFile = files?.length
            //     ? (files as any[]).reduce((latest, current) => {
            //         const currDate = new Date(current?.TimeLastModified || current?.Modified || current?.Created);
            //         const latestDate = new Date(latest?.TimeLastModified || latest?.Modified || latest?.Created);

            //         return currDate > latestDate ? current : latest;
            //     })
            //     : null;

            let folderName = "";
            if (item in BGVDocumentName) {
              let VerifiName = DocumentName.VerificationName?.filter(
                (items: any) => items.value === item,
              );
              folderName =
                VerifiName && VerifiName?.length > 0
                  ? VerifiName[0]?.displayText
                  : "";
              // folderName = BGVDocumentName[item as keyof typeof BGVDocumentName];
            }

            const file = [folderName, files];

            return file as unknown as IDocFiles[];
          }),
        );

        response = BGVDocs.filter(
          (x) =>
            x &&
            x !== null &&
            x[1] &&
            (!Array.isArray(x[1]) || x[1].length > 0),
        );
      }

      return {
        data: response,
        status: 200,
        message: "BGV Documents fetched",
      };
    } catch (error: any) {
      console.error("Error during file replacement process:", error);
      return {
        data: null,
        status: 500,
        message: `Error during file replacement: ${error.message}`,
      };
    }
  };

  UploadCandidateDocument = async (
    DocumentName: DocumentName,
    AttachFile: IDocFiles[],
  ): Promise<ApiResponse<any>> => {
    try {
      let response;
      if (AttachFile.length > 0) {
        if (DocumentName.DocumentName === DocumentFolderName.BGVConsentform) {
          response = await SPServices.addDocLibFiles({
            FilePath: DocumentLibraray.HRMSCareerPortalCandidateCV,
            FolderNames: [
              `${DocumentName.ProfileID.toString()}`,
              `${DocumentName.DocumentName.toString()}`,
            ],
            Datas: AttachFile,
          });
        } else if (
          DocumentName.DocumentName === DocumentFolderName.ProofOfDocument
        ) {
          response = await SPServices.addDocLibFiles({
            FilePath: DocumentLibraray.HRMSCareerPortalCandidateCV,
            FolderNames: [
              `${DocumentName.ProfileID.toString()}`,
              `${DocumentName.RequestID.toString()}`,
              `${DocumentName.DocumentName.toString()}`,
            ],
            Datas: AttachFile,
          });
        } else if (
          DocumentName.DocumentName === DocumentFolderName.BGVProofOfDocument
        ) {
          response = await SPServices.addDocLibFiles({
            FilePath: DocumentLibraray.HRMSCareerPortalCandidateCV,
            FolderNames: [
              `${DocumentName.ProfileID.toString()}`,
              `${DocumentName.RequestID.toString()}`,
              `${DocumentName.DocumentName.toString()}`,
            ],
            Datas: AttachFile,
          });
        } else if (
          DocumentName.DocumentName === DocumentFolderName.WorkPermit
        ) {
          response = await SPServices.addDocLibFiles({
            FilePath: DocumentLibraray.HRMSCareerPortalCandidateCV,
            FolderNames: [
              `${DocumentName.ProfileID.toString()}`,
              `${DocumentName.RequestID.toString()}`,
              `${DocumentName.DocumentName.toString()}`,
            ],
            Datas: AttachFile,
          });
        } else {
          response = await SPServices.addDocLibFiles({
            FilePath: DocumentLibraray.HRMSCareerPortalCandidateCV,
            FolderNames: [
              `${DocumentName.ProfileID.toString()}`,
              `${DocumentName.RequestID.toString()}`,
              `${DocumentName.DocumentName.toString()}`,
              `${DocumentName.UnsignedDoc.toString()}`,
            ],
            Datas: AttachFile,
          });
        }

        return {
          data: response,
          status: 200,
          message: "Attachment replaced successfully",
        };
      }
      return {
        data: response,
        status: 400,
        message: "No attachments provided",
      };
    } catch (error) {
      console.error("Error during file replacement process:", error);
      return {
        data: null,
        status: 500,
        message: `Error during file replacement}`,
      };
    }
  };

  FetchCandidateDocument = async (
    DocumentName: GetCandidateDocument,
  ): Promise<ApiResponse<IDocFiles[] | null>> => {
    try {
      // const getLatestFile = (files: any[] = []): any[] => {
      //     if (!files.length) return [];

      //     const latest = files.reduce((latest, current) => {
      //         const currDate = new Date(
      //             current?.TimeLastModified || current?.Modified || current?.Created
      //         );
      //         const latestDate = new Date(
      //             latest?.TimeLastModified || latest?.Modified || latest?.Created
      //         );

      //         return currDate > latestDate ? current : latest;
      //     });

      //     return [latest];
      // };

      let response: IDocFiles[] | null = null;

      switch (DocumentName.DocumentType) {
        case DocumentFolderName.BackgroundVerification: {
          const files = (await SPServices.getDocLibFiles({
            FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}/${DocumentName.DocumentType}`,
          })) as IDocFiles[];

          response = files;
          break;
        }

        case DocumentFolderName.Offerletter: {
          const files = (await SPServices.getDocLibFiles({
            FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}/${DocumentName.RequestID}/${DocumentName.DocumentType}/${DocumentName.UnsignedDoc}`,
          })) as IDocFiles[];

          response = files;
          break;
        }

        case DocumentFolderName.WorkPermit: {
          const medical = (await SPServices.getDocLibFiles({
            FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}/${DocumentName.RequestID}/${DocumentFolderName.Medical}`,
          })) as IDocFiles[];

          const vaccination = (await SPServices.getDocLibFiles({
            FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}/${DocumentFolderName.Vaccination}`,
          })) as IDocFiles[];

          const workPermit = (await SPServices.getDocLibFiles({
            FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}/${DocumentName.RequestID}/${DocumentFolderName.WorkPermit}`,
          })) as IDocFiles[];

          const allFiles = [
            ...(medical || []),
            ...(vaccination || []),
            ...(workPermit || []),
          ];

          response = allFiles;
          break;
        }

        case DocumentFolderName.CovidVaccinationCertificate:
        case DocumentFolderName.PoliceClearanceCertificate:
        case DocumentFolderName.YellowFeverVaccinationCertificate:
        case DocumentFolderName.PaymentBill: {
          const files = (await SPServices.getDocLibFiles({
            FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}/${DocumentName.RequestID}/${DocumentName.DocumentType}`,
          })) as IDocFiles[];

          response = files;
          break;
        }

        case DocumentFolderName.EmploymentContractForm: {
          const files = (await SPServices.getDocLibFiles({
            FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}/${DocumentName.RequestID}/${DocumentName.DocumentType}/${DocumentName.UnsignedDoc}`,
          })) as IDocFiles[];

          response = files;
          break;
        }

        default: {
          const files = (await SPServices.getDocLibFiles({
            FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}`,
          })) as IDocFiles[];

          response = files;
          break;
        }
      }

      return {
        data: response,
        status: 200,
        message: response
          ? "Latest file fetched successfully"
          : "No attachments provided",
      };
    } catch (error: any) {
      console.error("Error during file fetch:", error);
      return {
        data: null,
        status: 500,
        message: `Error during file fetch: ${error.message}`,
      };
    }
  };

  async CheckBGVerification(
    JobRequestId: number,
  ): Promise<ApiResponse<any | null>> {
    try {
      const response = await BGverification.UpdateBGVerification(JobRequestId);
      return {
        data: response.data,
        status: response.status,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error inserting data into AdvertisementDetails:", error);
      return {
        data: [],
        status: 500,
        message: "Error inserting data into AdvertisementDetails",
      };
    }
  }

  async InsertRecruitmentCandidateDetails(
    data: IUpdateCandidate,
  ): Promise<ApiResponse<any | null>> {
    try {
      const response = await SPServices.SPUpdateItem({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        RequestJSON: data,
        ID: data.ID,
      });
      return {
        data: response,
        status: 200,
        message: "Data updated successfully",
      };
    } catch (error) {
      console.error("Error inserting data into AdvertisementDetails:", error);
      return {
        data: [],
        status: 500,
        message: "Error inserting data into AdvertisementDetails",
      };
    }
  }

  UpdateStatusSelectedHOD = async (
    UpdateParams: IUpdateStatusSelectedHOD[],
  ): Promise<ApiResponse<any>> => {
    let response: any;
    try {
      let ListUpdate = UpdateParams.map((item: any) => ({
        ID: item.ID,
        StatusId: item.StatusId,
        // ActionId: item.ActionId,
        // ItemCreated: "Yes",
      }));
      response = await SPServices.batchUpdate({
        ListName: `${ListNames.HRMSSelectedCandidateDetailsByHOD}`,
        responseData: ListUpdate,
      });
      return {
        data: response,
        status: 200,
        message: "Candidate details fetched successfully",
      };
    } catch (error) {
      console.error("Error during file replacement process:", error);
      return {
        data: response,
        status: 500,
        message: `Error during file replacement`,
      };
    }
  };

  async GetJobRequestData(data: any[]): Promise<ApiResponse<any | null>> {
    try {
      const Response = await GetJobRequestData.GetJobRequestStatus(data);
      return {
        data: Response.data,
        status: Response.status,
        message: Response.data.message,
      };
    } catch (error) {
      console.error("Error inserting data into AdvertisementDetails:", error);
      return {
        data: [],
        status: 500,
        message: "Error inserting data into AdvertisementDetails",
      };
    }
  }

  async PerformCriminalRecordCheck(
    id: number,
  ): Promise<ApiResponse<any | null>> {
    try {
      const response = await BGverification.PerformCriminalRecordCheck(id);
      return {
        data: response.data,
        status: response.status,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error inserting data into AdvertisementDetails:", error);
      return {
        data: [],
        status: 500,
        message: "Error inserting data into AdvertisementDetails",
      };
    }
  }

  UpdateStatusCandidatelist = async (
    UpdateParams: any,
  ): Promise<ApiResponse<any>> => {
    let response: any;
    try {
      response = await SPServices.SPUpdateItem({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        RequestJSON: UpdateParams,
        ID: UpdateParams.ID,
      });

      return {
        data: response,
        status: 200,
        message: "Candidate details fetched successfully",
      };
    } catch (error) {
      console.error("Error during file replacement process:", error);
      return {
        data: response,
        status: 500,
        message: `Error during file replacement`,
      };
    }
  };

  fetchPreChecklist = async (UpdateParams: any): Promise<ApiResponse<any>> => {
    let response: any;
    try {
      response = await SPServices.SPUpdateItem({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        RequestJSON: UpdateParams,
        ID: UpdateParams.ID,
      });

      return {
        data: response,
        status: 200,
        message: "Candidate details fetched successfully",
      };
    } catch (error) {
      console.error("Error during file replacement process:", error);
      return {
        data: response,
        status: 500,
        message: `Error during file replacement`,
      };
    }
  };
}
