
import { ApiResponse } from "../../models/apimodels";
import { AutoCompleteItem } from "../../models/fieldmodels";
import { DocumentLibraray, ListNames } from "../../utilities/Config";
import GraphService from "../GraphService/GraphService";
import { IDocFiles } from "../SPService/Ispservice";
import SPServices, { getSP } from "../SPService/spservice";
import { ICommonService, LanguageFiles } from "./Icommanservice";



export default class CommonService implements ICommonService {

    uploadRoleProfileMaster = async (
        PositionCode: string,
        DocumentName: string,
        AttachFile: IDocFiles[],
        Listname: string
    ): Promise<ApiResponse<any>> => {
        try {
            if (AttachFile.length > 0) {

                await SPServices.addDocLibFiles({
                    FilePath: Listname,
                    FolderNames: [`${PositionCode.toString()}`, `${DocumentName.toString()}`,],
                    Datas: AttachFile,
                });
                return {
                    data: "Successfully Replaced Document",
                    status: 200,
                    message: "Attachment replaced successfully",
                };
            }

            return {
                data: null,
                status: 400,
                message: "No attachments provided",
            };
        } catch (error) {
            console.error("Error during file replacement process:", error);
            return {
                data: null,
                status: 500,
                message: `Error during file replacement`,
            };
        }
    };

    GetAttachmentLink = async (
        PositionCode: string,
        Listname: string
    ): Promise<ApiResponse<any>> => {
        try {
            const sp = getSP();
            if (Listname) {
                const attachmentsLibrary = sp.web.lists.getByTitle(Listname);
                const rootFolder = await attachmentsLibrary.rootFolder.getItem();
                const folderUrl = `${rootFolder.toUrl}/${PositionCode}`;

                return {
                    data: folderUrl,
                    status: 200,
                    message: "Attachment replaced successfully",
                };
            }

            return {
                data: null,
                status: 400,
                message: "No attachments provided",
            };
        } catch (error) {
            console.error(" Error during file replacement process:", error);
            return {
                data: null,
                status: 500,
                message: `Error during file replacement`,
            };
        }
    };

    GetAttachmentToLibrary = async (
        listName: string,
        JobCode?: string,
        RoleProfile?: string,
        ProfileID?: string
    ): Promise<ApiResponse<IDocFiles[] | LanguageFiles>> => {
        try {
            let response: IDocFiles[] | LanguageFiles;

            if (RoleProfile) {
                const basePath = `${listName}/${JobCode}/${RoleProfile}`;

                const EnglishFiles = await SPServices.getDocLibFiles({
                    FilePath: `${basePath}/English`,
                }) as IDocFiles[];

                const FrenchFiles = await SPServices.getDocLibFiles({
                    FilePath: `${basePath}/French`,
                }) as IDocFiles[];

                if ((EnglishFiles && EnglishFiles.length > 0) || (FrenchFiles && FrenchFiles.length > 0)) {
                    response = {
                        English: EnglishFiles || [],
                        French: FrenchFiles || [],
                    };
                }
                else {
                    const RoleProfileFiles = await SPServices.getDocLibFiles({
                        FilePath: basePath,
                    }) as IDocFiles[];

                    response = {
                        English: RoleProfileFiles,
                        French: [], // or same files if needed
                    };
                }

            } else if (ProfileID) {
                response = await SPServices.getDocLibFiles({
                    FilePath: `${listName}/${ProfileID}/$CV/`,
                }) as IDocFiles[];

            } else if (JobCode) {
                response = await SPServices.getDocLibFiles({
                    FilePath: `${listName}/${JobCode}`,
                }) as IDocFiles[];

            } else {
                response = await SPServices.getDocLibFiles({
                    FilePath: `${listName}`,
                }) as IDocFiles[];
            }

            return {
                data: response,
                status: 200,
                message: "Attachments retrieved successfully",
            };
        } catch (error) {
            console.log("Error getting attachments:", error);
            return {
                data: [],
                status: 500,
                message: "Error getting attachments",
            };
        }
    };


    GetADgruopsEmailIDs = async (
        ADGroupID: string
    ): Promise<ApiResponse<IDocFiles[]>> => {
        try {
            const graphClient = GraphService.getGraphClient();
            const response = await graphClient
                .api(`/groups/${ADGroupID}/members`)
                .get();

            const members = response.value || [];
            const userDetailsPromises = members.map((item: { mail: string }) => {
                return getUserGuidByEmail(item.mail);
            });
            const userDetails = await Promise.all(userDetailsPromises);
            const validUserDetails = userDetails.filter((user) => user !== null);
            return {
                data: validUserDetails,
                status: 200,
                message: "ADGroups retrieved successfully",
            };
        } catch (error) {
            console.error("Error checking user in groups:", error);
            return {
                data: [],
                status: 500,
                message: "Error getting ADGroups",
            };
        }
    };

    getUserGuidByEmail = async (
        email: string
    ): Promise<ApiResponse<AutoCompleteItem | null>> => {
        try {
            const sp = getSP();
            const user = await sp.web.siteUsers.getByEmail(email)();
            const UserID = {
                key: user.Id,
                text: user.Title    //`${UserName?.FirstName || ""} ${UserName?.MiddleName || ""} ${UserName?.LastName || "" }`,
            };
            return {
                data: UserID,
                status: 200,
                message: "ADGroups retrieved successfully",
            };
        } catch (error) {
            console.error("Error fetching user ID by email: ", error);
            // Return null in case of an error
            return {
                data: null,
                status: 500,
                message: "Error getting ADGroups",
            };
        }
    };

    getUserIDByEmail = async (
        userId: number
    ): Promise<ApiResponse<any | null>> => {
        try {
            const sp = getSP();
            const user = await sp.web.siteUsers.getById(userId)();
            const UserID = user.Email
            return {
                data: UserID,
                status: 200,
                message: "ADGroups retrieved successfully",
            };
        } catch (error) {
            console.error("Error fetching user ID by email: ", error);
            // Return null in case of an error
            return {
                data: null,
                status: 500,
                message: "Error getting ADGroups",
            };
        }
    };

    GetMasterData = async (ListName: string, Filter?: any[]): Promise<ApiResponse<any[]>> => {
        try {
            const listItems: any[] = await SPServices.SPReadItems({
                Listname: ListName,
                Select: "*",
                Filter: Filter || [],
            });
            return {
                data: listItems,
                status: 200,
                message: "HRMSRecruitmentCandidateDetails fetched successfully",
            };
        } catch (error) {
            console.error(
                "Error fetching data HRMSRecruitmentCandidateDetails:",
                error
            );
            return {
                data: [],
                status: 500,
                message: "Error fetching data from HRMSRecruitmentCandidateDetails",
            };
        }
    };

    GetDocumentinUrl = async (url: string): Promise<ApiResponse<any[]>> => {
        try {
            let filteredFiles: IDocFiles[] = [];
            if (url) {
                const extractedPath =
                    url.split("/root:/")[1]?.split(":/content")[0] || "";

                if (extractedPath) {
                    const folderPath =
                        extractedPath.substring(0, extractedPath.lastIndexOf("/")) || "";

                    try {
                        let FileData = (await SPServices.getDocLibFiles({
                            FilePath: `${DocumentLibraray.HRMSCareerPortalCandidateCV}/${folderPath}`,
                        })) as IDocFiles[];

                        if (FileData && FileData.length > 0) {
                            const fileName = extractedPath.split("/").pop();
                            filteredFiles = FileData.filter((file) => file.name === fileName);
                        } else {
                            console.warn("Warning: No files found in the directory");
                        }
                    } catch (error) {
                        console.error("Error fetching document library files:", error);
                    }
                }
            }
            return {
                data: filteredFiles,
                status: 200,
                message: "HRMSRecruitmentCandidateDetails fetched successfully",
            };
        } catch (error) {
            console.error(
                "Error fetching data HRMSRecruitmentCandidateDetails:",
                error
            );
            return {
                data: [],
                status: 500,
                message: "Error fetching data from HRMSRecruitmentCandidateDetails",
            };
        }
    };

    async GetGradeLevel(PatersonGrade: string): Promise<ApiResponse<any | null>> {
        try {
            let op: AutoCompleteItem[] = [];
            if (PatersonGrade) {
                await SPServices.SPReadItems({
                    Listname: ListNames.HRMSGradeMaster,
                    Select: "*",
                    //Expand: "RoleId,Department,Status,Action",
                    Filter: [
                        {
                            FilterKey: "PatersonGrade",
                            Operator: "eq",
                            FilterValue: PatersonGrade,
                        },
                    ],
                }).then((data: any) => {
                    op = data.map((item: any) => ({
                        Level: item.Levels,
                    }));
                    // console.log("data HRMSGradeMaster", op);
                });
            }
            return {
                data: op,
                status: 200,
                message: "HRMSGradeMaster Fetched successfully",
            };
        } catch (error) {
            console.error("Error HRMSGradeMaster:", error);
            throw error;
        }
    }

    GetUserName = async (
        email: string
    ): Promise<ApiResponse<any | null>> => {
        try {
            const listItems: any[] = await SPServices.SPReadItems({
                Listname: ListNames.HRMSSageList,
                Select: "*",
                Filter: [{
                    FilterKey: "EmailId",
                    FilterValue: "eq",
                    Operator: email
                }]
            });
            let UserName = listItems.find((emp: any) => {
                return emp.EmailId?.toLowerCase() === email?.toLowerCase();
            });
            let UserRoleName = `${UserName?.FirstName || ""} ${UserName?.MiddleName || ""} ${UserName?.LastName || ""}`
            return {
                data: UserRoleName,
                status: 200,
                message: "ADGroups retrieved successfully",
            };
        } catch (error) {
            console.error("Error fetching user ID by email: ", error);
            // Return null in case of an error
            return {
                data: null,
                status: 500,
                message: "Error getting ADGroups",
            };
        }
    };


}

async function getUserGuidByEmail(email: string) {
    try {
        const sp = getSP();
        const user = await sp.web.siteUsers.getByEmail(email)();
        const listItems: any[] = await SPServices.SPReadItems({
            Listname: ListNames.HRMSSageList,
            Select: "*",
            Filter: [{
                FilterKey: "EmailId",
                FilterValue: "eq",
                Operator: email
            }]
        });
        let UserName = listItems.find((emp: any) => {
            return emp.EmailId?.toLowerCase() === email?.toLowerCase();
        });
        // console.log(UserName, "UserName");

        return {
            key: user.Id,
            text: `${UserName?.FirstName || ""} ${UserName?.MiddleName || ""} ${UserName?.LastName || ""}`,
        };
    } catch (error) {
        console.error("Error fetching user ID by email: ", error);
        return null;
    }
}