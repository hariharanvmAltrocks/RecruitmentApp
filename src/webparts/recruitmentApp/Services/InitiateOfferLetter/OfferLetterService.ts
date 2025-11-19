
import { sp } from "@pnp/sp";
import { count, DocumentFolderName, DocumentLibraray, ListNames, RoleName } from "../../utilities/Config";
import { getVRRDetails, laborHireService } from "../ServiceExport";
import { IDocFiles } from "../SPService/ISPServicesProps";
import SPServices from "../SPService/SPServices";
import { DataSyncToResiProcess, DocumentName, GetBGVDocument, GetCandidateDocument, GetDOTAfricaCF, ICandidateDetails, IOfferLetterService, UpdateCandidateData } from "./IOfferLetterService";
import { initiateLaborHire, ITSystem, TASystem, TrainingSystem, UploadDocument } from "../../Models/ApIInterface";
import { AutoCompleteItem } from "../../Models/Screens";


export default class OfferLetterService implements IOfferLetterService {

    fetchResiCandidateDetails = async (
        Filter: any[],
        Conditions: any,
    ): Promise<ApiResponse<DataSyncToResiProcess[]>> => {
        let GridResult: DataSyncToResiProcess[] = [];
        try {
            const res = await SPServices.SPReadItems({
                Listname: ListNames.HRMSSelectedCandidateDetailsByHOD,
                Select:
                    "*,RecruitmentID/ID,PositionID/PositionID,CandidateID/ID,Status/StatusDescription",
                Filter: Filter,
                Expand:
                    "RecruitmentID,PositionID,CandidateID,Status",
                FilterCondition: Conditions,
                Orderby: "ID",
                Orderbydecorasc: false,
                Topcount: count.Topcount,
            });
            if (res.length > 0) {
                GridResult = await Promise.all(
                    res.map(async (objresult: any, index: number) => {
                        const filterCandidate = [
                            {
                                FilterKey: "ID",
                                Operator: "eq",
                                FilterValue: objresult?.CandidateID?.ID,
                            },
                        ];
                        let CandidateData = await this.fetchCandidateDetails(filterCandidate, "")
                        let CandidateDetails: ICandidateDetails = CandidateData.data;
                        const filterConditions = [
                            {
                                FilterKey: "ID",
                                Operator: "eq",
                                FilterValue: objresult?.RecruitmentID?.ID,
                            },
                        ];

                        const response = await getVRRDetails.GetRecruitmentDetails(
                            filterConditions,
                            ""
                        );

                        const item: DataSyncToResiProcess = {
                            ID: objresult?.ID,
                            BusinessUnitCode: response.data[0]?.BusinessUnitCode,
                            Department: response.data[0]?.Department,
                            JobTitle: response.data[0]?.JobTitleEnglish,
                            ApplicantName: CandidateDetails?.ApplicantName,
                            PositionID: objresult?.PositionID?.PositionID,
                            RecruitmentIDId: objresult?.RecruitmentID?.ID,
                            CandidateDetails: CandidateDetails,
                            RecruitmentDetails: response.data[0],
                            Status: objresult?.Status ? objresult?.Status?.StatusDescription : "",
                            StatusID: objresult?.StatusId,
                            IsExpat: objresult?.IsExpat ?? ""
                        };
                        item.CandidateDetails.Location = response.data[0]?.Location ? response.data[0]?.Location : "";
                        return item;
                    })
                );
            }
            return {
                data: GridResult,
                status: 200,
                message: "Candidate details fetched successfully",
            };
        } catch (error) {
            console.error("Error during file replacement process:", error);
            return {
                data: GridResult,
                status: 500,
                message: `Error during file replacement: ${error.message}`,
            };
        }
    };

    fetchCandidateDetails = async (
        Filter: any[],
        Conditions: any,
    ): Promise<ApiResponse<ICandidateDetails>> => {
        let GridResult: any = {};
        try {
            const res = await SPServices.SPReadItems({
                Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
                Select: "*,RecruitmentID/ID,Status/StatusDescription",
                Filter: Filter,
                Expand: "RecruitmentID,Status",
                FilterCondition: Conditions,
                Orderby: "ID",
                Orderbydecorasc: false,
                Topcount: count.Topcount,
            });
            if (res.length > 0) {
                const candidateArray = await Promise.all(
                    res.map(async (objresult: any, index: number) => {
                        const attachmentsLibrary = sp.web.lists.getByTitle(DocumentLibraray.HRMSCandidateDocs);
                        const rootFolder = await attachmentsLibrary.rootFolder.get();
                        const folderUrl = `${rootFolder.ServerRelativeUrl}/${objresult?.JobRequestID}`;
                        let folderLink = "";
                        try {
                            const folder = await sp.web.getFolderByServerRelativeUrl(folderUrl).get();
                            folderLink = folder.ServerRelativeUrl;
                        } catch (err) {
                            folderLink = "";
                        }
                        let Hardware: AutoCompleteItem[] = (objresult?.Hardware ?? []).map((item: any, index: number) => ({
                            key: index + 1,
                            text: item ?? ""
                        }))
                        let TrainingSystem: TrainingSystem = {
                            Inductiontype: { key: 0, text: objresult?.InductionType ?? "" },
                            StartDate: objresult?.TCSStartDate ? new Date(objresult?.TCSStartDate) : undefined,
                            EndDate: objresult?.TCSEndDate ? new Date(objresult?.TCSEndDate) : undefined,
                            Region: [], //{ key: 0, text: objresult?.TCSRegion ?? "" },
                            Zone: [], //{ key: 0, text: objresult?.TCSZone ?? "" },
                            Comments: objresult?.TCSComments ?? "",
                        }
                        let TASystem: TASystem = {
                            StartDate: objresult?.PermanentBadgeStartDate ? new Date(objresult?.PermanentBadgeStartDate) : undefined,
                            EndDate: objresult?.PermanentBadgeEndDate ? new Date(objresult?.PermanentBadgeEndDate) : undefined,
                            Region: [],//{ key: 0, text: objresult?.PermanentBadgeRegion ?? "" },
                            Zone: [],//{ key: 0, text: objresult?.PermanentBadgeZone ?? "" },
                            Comments: objresult?.PermanentBadgeComments ?? ""
                        }
                        let ITSystem: ITSystem = {
                            StartDate: objresult?.ITStartDate ? new Date(objresult?.ITStartDate) : undefined,
                            Hardware: Hardware ?? [],
                            Region: [],//{ key: 0, text: objresult?.ITRegion ?? "" },
                            Zone: [],//{ key: 0, text: objresult?.ITZone ?? "" },
                            Comments: objresult?.ITComments ?? "",
                            ITStatus: objresult?.ITStatus
                        }
                        let item: ICandidateDetails = {
                            CandidateID: objresult?.ID,
                            ApplicantName: `${objresult?.FristName ?? ""} ${objresult?.MiddleName ?? ""} ${objresult?.LastName ?? ""}`,
                            FristName: objresult?.FristName,
                            MiddleName: objresult?.MiddleName,
                            LastName: objresult?.LastName,
                            Email: objresult?.Email,
                            JobRequestID: objresult?.JobRequestID,
                            ProfileID: objresult?.ProfileID,
                            Nationality: objresult?.Nationality,
                            IdentityNumber: objresult?.IdentityNumber,
                            ProofOfIdentity: objresult?.ProofOfIdentity,
                            Location: "",
                            DocumentFolderPath: folderLink,
                            TrainingSystem: TrainingSystem,
                            TASystem: TASystem,
                            ITSystem: ITSystem,
                            BackgroundChecks: objresult?.BackgroundChecks,
                            SignedOfferLetterVerified: objresult?.SignedOfferLetterVerified,
                            SignedEmploymentContract: objresult?.SignedEmploymentContract,
                            WorkPermitApproved: objresult?.WorkPermitApproved,
                            VisaProcess: objresult?.VisaProcess,
                            AccommodationBooked: objresult?.AccommodationBooked,
                            TravelProcess: objresult?.TravelProcess,
                            ReadyforOnboarding: objresult?.ReadyforOnboarding
                        }
                        return item;
                    })
                );
                GridResult = candidateArray[0];
            }
            return {
                data: GridResult,
                status: 200,
                message: "Candidate details fetched successfully",
            };
        } catch (error) {
            console.error("Error during file replacement process:", error);
            return {
                data: GridResult,
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
                        FolderNames: [`${DocumentName.ProfileID.toString()}`, `${DocumentName.DocumentName.toString()}`],
                        Datas: AttachFile,
                    });

                } else if (DocumentName.DocumentName === DocumentFolderName.ProofOfDocument) {
                    response = await SPServices.addDocLibFiles({
                        FilePath: DocumentLibraray.HRMSCareerPortalCandidateCV,
                        FolderNames: [`${DocumentName.ProfileID.toString()}`, `${DocumentName.RequestID.toString()}`, `${DocumentName.DocumentName.toString()}`],
                        Datas: AttachFile,
                    });
                } else if (DocumentName.DocumentName === DocumentFolderName.WorkPermit) {
                    response = await SPServices.addDocLibFiles({
                        FilePath: DocumentLibraray.HRMSCareerPortalCandidateCV,
                        FolderNames: [`${DocumentName.ProfileID.toString()}`, `${DocumentName.RequestID.toString()}`, `${DocumentName.DocumentName.toString()}`],
                        Datas: AttachFile,
                    });
                } else {
                    response = await SPServices.addDocLibFiles({
                        FilePath: DocumentLibraray.HRMSCareerPortalCandidateCV,
                        FolderNames: [`${DocumentName.ProfileID.toString()}`, `${DocumentName.RequestID.toString()}`, `${DocumentName.DocumentName.toString()}`, `${DocumentName.UnsignedDoc.toString()}`],
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
                message: `Error during file replacement: ${error.message}`,
            };
        }
    };

    FetchCandidateDocument = async (
        DocumentName: GetCandidateDocument,
    ): Promise<ApiResponse<any>> => {
        try {
            let response: IDocFiles[];
            switch (DocumentName.DocumentType) {
                case DocumentFolderName.BackgroundVerification:
                    response = (await SPServices.getDocLibFiles({
                        FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}/${DocumentName.DocumentType}`,
                    })) as IDocFiles[];
                    break;
                case DocumentFolderName.Offerletter:
                    response = (await SPServices.getDocLibFiles({
                        FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}/${DocumentName.RequestID}/${DocumentName.DocumentType}/${DocumentName.UnsignedDoc}`,
                    })) as IDocFiles[];
                    break;
                case DocumentFolderName.WorkPermit: {
                    const Medical = await SPServices.getDocLibFiles({
                        FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}/${DocumentName.RequestID}/${DocumentFolderName.Medical}`,
                    }) as IDocFiles[];

                    const Vaccination = await SPServices.getDocLibFiles({
                        FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}/${DocumentFolderName.Vaccination}`,
                    }) as IDocFiles[];

                    const WorkPermit = await SPServices.getDocLibFiles({
                        FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}/${DocumentName.RequestID}/${DocumentFolderName.WorkPermit}`,
                    }) as IDocFiles[];

                    response = [...Medical, ...Vaccination, ...WorkPermit];
                    break;
                }
                case DocumentFolderName.CovidVaccinationCertificate: {
                    response = (await SPServices.getDocLibFiles({
                        FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}/${DocumentName.RequestID}/${DocumentName.DocumentType}`,
                    })) as IDocFiles[];
                    break;
                }
                case DocumentFolderName.PoliceClearanceCertificate: {
                    response = (await SPServices.getDocLibFiles({
                        FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}/${DocumentName.RequestID}/${DocumentName.DocumentType}`,
                    })) as IDocFiles[];
                    break;
                }
                case DocumentFolderName.YellowFeverVaccinationCertificate: {
                    response = (await SPServices.getDocLibFiles({
                        FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}/${DocumentName.RequestID}/${DocumentName.DocumentType}`,
                    })) as IDocFiles[];
                    break;
                }
                case DocumentFolderName.EmploymentContractForm: {
                    response = (await SPServices.getDocLibFiles({
                        FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}/${DocumentName.RequestID}/${DocumentName.DocumentType}/${DocumentName.UnsignedDoc}`,
                    })) as IDocFiles[];
                    break;
                }
                case DocumentFolderName.PaymentBill: {
                    response = (await SPServices.getDocLibFiles({
                        FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}/${DocumentName.RequestID}/${DocumentName.DocumentType}`,
                    })) as IDocFiles[];
                    break;
                }
                default:
                    response = (await SPServices.getDocLibFiles({
                        FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}`,
                    })) as IDocFiles[];
                    break;
            }
            return {
                data: response,
                status: 200,
                message: "No attachments provided",
            };
        } catch (error) {
            console.error("Error during file replacement process:", error);
            return {
                data: null,
                status: 500,
                message: `Error during file replacement: ${error.message}`,
            };
        }
    };

    UpdateStatusInSpfxlist = async (
        UpdateParams: any,
    ): Promise<ApiResponse<any>> => {
        let response: any;
        try {
            let ListUpdate = UpdateParams.map((item: any) => ({
                ID: item.ID,
                ActionId: item.ActionId,
                ItemCreated: "Yes",
            }));
            response = await SPServices.batchUpdate({
                ListName: `${ListNames.HRMSSelectedCandidateDetailsByHOD}`,
                responseData: ListUpdate
            })
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
                message: `Error during file replacement: ${error.message}`,
            };
        }
    };

    FilterZoneInRegion = async (
        Filter: any[],
        Conditions: any,
    ): Promise<ApiResponse<any>> => {
        try {
            const response = await SPServices.SPReadItems({
                Listname: ListNames.HRMSZone,
                Select: "*,Region/Region",
                Filter: Filter,
                Expand: "Region",
                FilterCondition: Conditions,
                Orderby: "ID",
                Orderbydecorasc: false,
                Topcount: count.Topcount,
            });

            return {
                data: response,
                status: 200,
                message: "No zone found",
            };
        } catch (error) {
            console.error("Error during file replacement process:", error);
            return {
                data: null,
                status: 500,
                message: `Error during file replacement: ${error.message}`,
            };
        }
    }

    UpdateCandidateOnboardDate = async (
        UpdateData: UpdateCandidateData,
        CandidateID: number
    ): Promise<ApiResponse<UpdateCandidateData>> => {
        let response: any;
        try {

            response = await SPServices.SPUpdateItem({
                Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
                RequestJSON: UpdateData,
                ID: CandidateID,
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
                message: `Error during file replacement: ${error.message}`,
            };
        }
    };

    async InitiateLabouHireOfferRelease(
        data: UploadDocument,
        HODData: DataSyncToResiProcess,
        CurrentUserEmail: string
    ): Promise<ApiResponse<null>> {
        try {
            const res = await SPServices.SPGetItems({
                Listname: HODData.IsExpat ? ListNames.HRMSRESIExpatDetails : ListNames.HRMSRESIDRCDetails,
                Filter: [
                    {
                        FilterKey: "SelectedCandidateHODId",
                        Operator: "eq",
                        FilterValue: HODData.ID,
                    },
                ],
                Select: "*,SelectedCandidateHODId/ID,LabourhireORContractor/AgentCode",
                Expand: "SelectedCandidateHODId,LabourhireORContractor",
            });
            console.log(res, "responseData");
            const todaydate = new Date();
            let laborHireData: initiateLaborHire = {
                jobRequestID: Number(data?.jobRequestID),
                positionId: data?.positionID,
                location: data?.Location,
                businessUnit: data?.BusinessUnitCode,
                department: data?.Department,
                section: data?.Section,
                patersonGrade: HODData.RecruitmentDetails.PatersonGrade, //data?.PatersonGrade,
                drcGrade: HODData.RecruitmentDetails.DRCGrade, //data?.DRCGrade,
                reportingManager: RoleName.RecruitmentHR,
                dateOfJoining: (data?.JoiningDate) ? new Date(data?.JoiningDate) : new Date(),
                typeOfContract: data?.TypeOfCOntract,
                noOfMonths:
                    data?.NoticePeriod === ""
                        ? "20"
                        : String(data?.NoticePeriod) ?? "0",
                netPay: res[0]?.ProposedNetUSDAmount,
                lhCode: res[0]?.LabourhireORContractor?.AgentCode,
                createdOn: new Date(todaydate),
                createdBy: RoleName.RecruitmentHR,
                createrEmail: CurrentUserEmail //props.userDetails[0]?.EmailId,
            };
            let response =
                await laborHireService.initiateLaborHire(laborHireData);

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
                            FilePath: `${DocumentName.ListName}/${DocumentName.ProfileID}/${DocumentName.RequestID.toString()}/${DocumentName.DocumentType}/${item}`,
                        });

                        return files[0] as IDocFiles[];
                    })
                );

                response = BGVDocs.filter(x => x !== null);
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
                message: `Error during file replacement: ${error.message}`,
            };
        }
    };

    FetchDotAfricaConsentForm = async (
        DocumentName: GetDOTAfricaCF,
    ): Promise<ApiResponse<any>> => {
        try {
            let response: IDocFiles[];
            response = (await SPServices.getDocLibFiles({
                FilePath: `${DocumentName.ListName}/${DocumentName.Natioality}`,
            })) as IDocFiles[];
            return {
                data: response,
                status: 200,
                message: "No attachments provided",
            };
        } catch (error) {
            console.error("Error during file replacement process:", error);
            return {
                data: null,
                status: 500,
                message: `Error during file replacement: ${error.message}`,
            };
        }
    };

}
