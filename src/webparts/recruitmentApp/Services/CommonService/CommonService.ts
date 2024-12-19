import { sp } from "@pnp/sp";
import { IDocFiles } from "../SPService/ISPServicesProps";
import SPServices from "../SPService/SPServices";
import { ICommonService } from "./ICommonService";
import GraphService from "../GraphService/GraphService";

export default class CommonService implements ICommonService {

    uploadAttachmentToLibrary = async (
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
                        const folderName = PositionID.toString();
                        const attachmentsLibrary = sp.web.lists.getByTitle(Listname);

                        const folderResult = await attachmentsLibrary.rootFolder.folders.add(folderName);
                        const folderUrl = folderResult.data.ServerRelativeUrl;

                        await attachmentsLibrary.rootFolder.files.add(
                            `${folderUrl}/${AttachFile.name}`,
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
        JobCode?: string,
        PassportID?: string
    ): Promise<ApiResponse<IDocFiles[]>> => {  // Explicitly type ApiResponse with IDocFiles[]
        try {
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


