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
    AttachFile: IDocFiles[],
    Listname: string
  ): Promise<ApiResponse<any>> => {
    try {
      if (AttachFile) {
        const attachmentsLibrary = sp.web.lists.getByTitle(Listname);
        const rootFolder = await attachmentsLibrary.rootFolder.get();
        const folderUrl = `${rootFolder.ServerRelativeUrl}/${PositionCode}`

        await sp.web.getFolderByServerRelativeUrl(folderUrl).delete();


        await SPServices.addDocLibFiles({
          FilePath: Listname,
          FolderNames: [`${PositionCode.toString()}`],
          Datas: AttachFile,
        });

        console.log("✅ Files deleted and new files added successfully");

        return {
          data: "Successfully Replaced Document",
          status: 200,
          message: "Attachment replaced successfully"
        };
      }

      return {
        data: null,
        status: 400,
        message: "No attachments provided"
      };
    } catch (error) {
      console.error("❌ Error during file replacement process:", error);
      return {
        data: null,
        status: 500,
        message: `Error during file replacement: ${error.message}`
      };
    }
  };


  GetAttachmentToLibrary = async (
    listName: string,
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
      const user = await sp.web.siteUsers.getByEmail(email)();
      const UserID = {
        key: user.Id,
        text: user.Title,
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

  GetMasterData = async (ListName: string): Promise<ApiResponse<any[]>> => {
    // Here, specify the type that ApiResponse should work with, in this case, an array of any type
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
          console.log("data HRMSGradeMaster", op);
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
}

async function getUserGuidByEmail(email: string) {
  try {
    const user = await sp.web.siteUsers.getByEmail(email)();
    return {
      key: user.Id,
      text: user.Title,
    };
  } catch (error) {
    console.error("Error fetching user ID by email: ", error);
    return null;
  }
}
