import { sp } from "@pnp/sp";
import { IDocFiles } from "../SPService/ISPServicesProps";
import SPServices from "../SPService/SPServices";
import { ICommonService } from "./ICommonService";
import GraphService from "../GraphService/GraphService";
import { AutoCompleteItem } from "../../Models/Screens";

export default class CommonService implements ICommonService {

    uploadAttachmentToLibrary = async (
        ID: number,
        PositionID: number,
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
                        const positionFolderName = PositionID.toString();
                        const idFolderName = ID.toString();

                        // Step 1: Ensure PositionID folder exists, and create it if not
                        const positionFolderResult = await attachmentsLibrary.rootFolder.folders.add(positionFolderName);
                        const positionFolderUrl = positionFolderResult.data.ServerRelativeUrl;

                        // Step 2: Ensure ID folder exists inside the PositionID folder
                        const idFolderResult = await attachmentsLibrary.rootFolder.folders.add(
                            `${positionFolderUrl}/${idFolderName}`
                        );
                        const idFolderUrl = idFolderResult.data.ServerRelativeUrl;

                        // Step 3: Upload the file to the ID folder
                        await attachmentsLibrary.rootFolder.files.add(
                            `${idFolderUrl}/${AttachFile.name}`,
                            fileContent
                        );

                        resolve({
                            data: "Successfully Added Document",
                            status: 200,
                            message: "Attachment uploaded successfully"
                        });
                    } catch (innerError) {
                        console.log("Error uploading attachment:", innerError);
                        reject({
                            data: null,
                            status: 500,
                            message: "Error uploading attachment"
                        });
                    }
                };

                fileReader.onerror = (error) => {
                    console.log("Error reading file:", error);
                    reject({
                        data: null,
                        status: 500,
                        message: "Error reading file"
                    });
                };

                fileReader.readAsArrayBuffer(AttachFile);
            } catch (error) {
                console.log("Error during file upload process:", error);
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
        ID?: string,
        JobCode?: string,
        PassportID?: string
    ): Promise<ApiResponse<IDocFiles[]>> => {
        try {
            let response;
            if (PassportID) {
                response = (await SPServices.getDocLibFiles({
                    FilePath: `${listName}/${JobCode}/${PassportID}`,
                })) as IDocFiles[];
            } else if (JobCode) {
                response = (await SPServices.getDocLibFiles({
                    FilePath: `${listName}/${ID}/${JobCode}`,
                })) as IDocFiles[];
            } else {
                response = (await SPServices.getDocLibFiles({
                    FilePath: `${listName}`,
                })) as IDocFiles[];
            }
            // for (const file of response) {
            //     const fileContent = await fetch(file.content)  // You might need to adjust based on how file URL is provided
            //         .then(res => res.text())  // Fetch the binary content
            //         .catch(err => {
            //             console.error("Error fetching file content:", err);
            //             return null;
            //         });

            //     if (fileContent) {
            //         // Process the file content here (e.g., display, save, etc.)
            //         console.log(fileContent, "RoleProfileContent");
            //     }
            // }
            return {
                data: response,  // Return data as an array of IDocFiles[]
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


