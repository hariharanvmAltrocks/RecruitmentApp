
import { sp } from "@pnp/sp";
import { count, DocumentFolderName, DocumentLibraray, ListNames } from "../../utilities/Config";
import { getVRRDetails } from "../ServiceExport";
import { IDocFiles } from "../SPService/ISPServicesProps";
import SPServices from "../SPService/SPServices";
import { DataSyncToResiProcess, DocumentName, GetCandidateDocument, ICandidateDetails, IOfferLetterService, UpdateCandidateData } from "./IOfferLetterService";
import { ITSystem, TASystem, TrainingSystem } from "../../Models/ApIInterface";
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
                            Region: { key: 0, text: objresult?.TCSRegion ?? "" },
                            Zone: { key: 0, text: objresult?.TCSZone ?? "" },
                            Comments: objresult?.TCSComments ?? "",
                        }
                        let TASystem: TASystem = {
                            StartDate: objresult?.PermanentBadgeStartDate ? new Date(objresult?.PermanentBadgeStartDate) : undefined,
                            EndDate: objresult?.PermanentBadgeEndDate ? new Date(objresult?.PermanentBadgeEndDate) : undefined,
                            Region: { key: 0, text: objresult?.PermanentBadgeRegion ?? "" },
                            Zone: { key: 0, text: objresult?.PermanentBadgeZone ?? "" },
                            Comments: objresult?.PermanentBadgeComments ?? ""
                        }
                        let ITSystem: ITSystem = {
                            StartDate: objresult?.ITStartDate ? new Date(objresult?.ITStartDate) : undefined,
                            Hardware: Hardware ?? [],
                            Region: { key: 0, text: objresult?.ITRegion ?? "" },
                            Zone: { key: 0, text: objresult?.ITZone ?? "" },
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
                response = await SPServices.addDocLibFiles({
                    FilePath: DocumentLibraray.HRMSCandidateDocs,
                    FolderNames: [`${DocumentName.RequestID.toString()}`, `${DocumentName.DocumentName.toString()}`, `${DocumentName.UnsignedDoc.toString()}`],
                    Datas: AttachFile,
                });

                console.log(
                    "All existing files deleted, and new files added successfully"
                );

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
            let response;
            switch (DocumentName.DocumentType) {
                case DocumentFolderName.Offerletter:
                    response = (await SPServices.getDocLibFiles({
                        FilePath: `${DocumentName.ListName}/${DocumentName.RequestID}/${DocumentName.DocumentName}/${DocumentName.UnsignedDoc}`,
                    })) as IDocFiles[];
                    break;
                case DocumentFolderName.EmploymentContractForm:
                    response = (await SPServices.getDocLibFiles({
                        FilePath: `${DocumentName.ListName}/${DocumentName.RequestID}/${DocumentName.DocumentName}/${DocumentName.UnsignedDoc}`,
                    })) as IDocFiles[];
                    break;
                case DocumentFolderName.Medical:
                    response = (await SPServices.getDocLibFiles({
                        FilePath: `${DocumentName.ListName}/${DocumentName.RequestID}/${DocumentName.DocumentName}`,
                    })) as IDocFiles[];
                    break;
                case DocumentFolderName.PersonalDocs: {
                    const attachmentsLibrary = sp.web.lists.getByTitle(DocumentName.ListName);

                    const rootFolder = await attachmentsLibrary.rootFolder.get();
                    const folderUrl = `${rootFolder.ServerRelativeUrl}/${DocumentName.RequestID}`;

                    const folders = await sp.web.getFolderByServerRelativeUrl(folderUrl).folders();

                    const targetFolder = folders.filter(
                        folder => folder.Name !== DocumentFolderName.Offerletter && folder.Name !== DocumentFolderName.EmploymentContractForm && folder.Name !== DocumentFolderName.Medical
                    );

                    if (targetFolder) {
                        const filesArray = await Promise.all(
                            targetFolder.map(async (item) => {
                                const folderUrl = item?.ServerRelativeUrl;
                                const files = folderUrl ? await sp.web.getFolderByServerRelativeUrl(folderUrl).files() : [];
                                console.log("Files in the filtered folder:", files);
                                return files;
                            })
                        );
                        let personalDocs: { [category: string]: IDocFiles[] } = {};

                        filesArray.forEach((files) => {
                            if (files && files.length > 0) {
                                files.forEach((item) => {
                                    const filePath = item.ServerRelativeUrl;
                                    const parts = filePath.split("/");
                                    const folderName = parts[parts.length - 2]; // e.g. 'Medical'

                                    const categoryDoc: IDocFiles = {
                                        name: item.Name,
                                        content: item.ServerRelativeUrl,
                                        type: "Inlist"
                                    };

                                    if (!personalDocs[folderName]) {
                                        personalDocs[folderName] = [];
                                    }

                                    personalDocs[folderName].push(categoryDoc);
                                });
                            }
                        });

                        response = Object.keys(personalDocs).map((key) => ({
                            category: key,
                            documents: personalDocs[key]
                        }));
                        console.log(response, " response.....");

                    }
                    break;
                }
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


}
