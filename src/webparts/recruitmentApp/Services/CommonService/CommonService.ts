import { sp } from "@pnp/sp";
import { IDocFiles } from "../SPService/ISPServicesProps";
import SPServices from "../SPService/SPServices";
import { ICommonService } from "./ICommonService";
import GraphService from "../GraphService/GraphService";
import { AutoCompleteItem } from "../../Models/Screens";
import { ListNames } from "../../utilities/Config";


export default class CommonService implements ICommonService {

    uploadAttachmentToLibrary = async (
        PositionCode: string,
        AttachFile: File,
        Listname: string
    ): Promise<ApiResponse<any>> => {
        return new Promise<ApiResponse<any>>((resolve, reject) => {
            try {
                const fileReader = new FileReader();

                fileReader.onload = async (event: any) => {
                    try {
                        const fileContent = event.target.result;
                        const attachmentsLibrary = sp.web.lists.getByTitle(Listname);
                        const positionFolderName = PositionCode.toString();
                        let positionFolderUrl = `${attachmentsLibrary.rootFolder.serverRelativeUrl}/${positionFolderName}`;

                        try {
                            await sp.web.getFolderByServerRelativeUrl(positionFolderUrl).get();
                        } catch {
                            const positionFolderResult = await attachmentsLibrary.rootFolder.folders.add(positionFolderName);
                            positionFolderUrl = positionFolderResult.data.ServerRelativeUrl;
                        }
                        const fileUrl = `${positionFolderUrl}/${AttachFile.name}`;
                        try {
                            await sp.web.getFileByServerRelativeUrl(fileUrl).delete();
                            console.log(`Existing file ${AttachFile.name} deleted.`);
                        } catch (deleteError) {
                            console.warn(`File ${AttachFile.name} not found. Uploading new file.`);
                        }

                        await sp.web.getFolderByServerRelativeUrl(positionFolderUrl).files.add(
                            AttachFile.name,
                            fileContent,
                            true // Overwrite if exists
                        );

                        resolve({
                            data: "Successfully Added Document",
                            status: 200,
                            message: "Attachment uploaded successfully"
                        });
                    } catch (innerError) {
                        console.error("Error uploading attachment:", innerError);
                        reject({
                            data: null,
                            status: 500,
                            message: "Error uploading attachment"
                        });
                    }
                };

                fileReader.onerror = (error) => {
                    console.error("Error reading file:", error);
                    reject({
                        data: null,
                        status: 500,
                        message: "Error reading file"
                    });
                };

                fileReader.readAsArrayBuffer(AttachFile);
            } catch (error) {
                console.error("Error during file upload process:", error);
                reject({
                    data: null,
                    status: 500,
                    message: "Error during file upload process"
                });
            }
        });
    };


    GetAttachmentToLibrary = async (
        listName: string,
        JobCode?: string,
        PassportID?: string
    ): Promise<ApiResponse<IDocFiles[]>> => {
        try {
            debugger;
            let response;
            if (PassportID) {
                response = (await SPServices.getDocLibFiles({
                    FilePath: `${listName}/${JobCode}/${PassportID}`,
                })) as IDocFiles[];
            } else if (JobCode) {
                response = (await SPServices.getDocLibFiles({
                    FilePath: `${listName}/${JobCode}`,
                })) as IDocFiles[];
            } else {
                response = (await SPServices.getDocLibFiles({
                    FilePath: `${listName}`,
                })) as IDocFiles[];
            }
            return {
                data: response,
                status: 200,
                message: "Attachments retrieved successfully"
            };
        } catch (error) {
            console.log("Error getting attachments:", error);
            return {
                data: [],
                status: 500,
                message: "Error getting attachments"
            };
        }
    };

    GetADgruopsEmailIDs = async (
        ADGroupID: string,
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
            const validUserDetails = userDetails.filter(user => user !== null);
            console.log("validUserDetails", validUserDetails);
            return {
                data: validUserDetails,
                status: 200,
                message: "ADGroups retrieved successfully"
            };
        } catch (error) {
            console.error("Error checking user in groups:", error);
            return {
                data: [],
                status: 500,
                message: "Error getting ADGroups"
            };
        }
    };

    getUserGuidByEmail = async (
        email: string,
    ): Promise<ApiResponse<AutoCompleteItem | null>> => {
        try {
            const user = await sp.web.siteUsers.getByEmail(email)();
            console.log(user, "user");
            const UserID = {
                key: user.Id,
                text: user.Title
            }
            return {
                data: UserID,
                status: 200,
                message: "ADGroups retrieved successfully"
            };
        } catch (error) {
            console.error("Error fetching user ID by email: ", error);
            // Return null in case of an error
            return {
                data: null,
                status: 500,
                message: "Error getting ADGroups"
            };
        }
    };

    GetMasterData = async (
        ListName: string,
    ): Promise<ApiResponse<any[]>> => {  // Here, specify the type that ApiResponse should work with, in this case, an array of any type
        try {
            const listItems: any[] = await SPServices.SPReadItems({
                Listname: ListName,
                Select: "*",
            });
            return {
                data: listItems,
                status: 200,
                message: "HRMSRecruitmentCandidateDetails fetched successfully",
            };
        } catch (error) {
            console.error("Error fetching data HRMSRecruitmentCandidateDetails:", error);
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
                    console.log('data HRMSGradeMaster', op);
                })
            }
            return {
                data: op,
                status: 200,
                message: "HRMSGradeMaster Fetched successfully",
            };
        }
        catch (error) {
            console.error("Error HRMSGradeMaster:", error);
            throw error;
        }
    }
}

async function getUserGuidByEmail(email: string) {
    try {
        const user = await sp.web.siteUsers.getByEmail(email)();
        console.log(user, "user");
        return {
            key: user.Id,
            text: user.Title
        };
    } catch (error) {
        console.error("Error fetching user ID by email: ", error);
        return null;
    }
}





