import { getSP } from "../../../../services/SPService/spservice";
import { ICommonService } from "./ICommonService";
import { ApiResponse } from "../../../../models/apimodels";

export type AutoCompleteItem = {
  key: number;
  text: string;
};

export default class CommonService implements ICommonService {
  
  getUserGuidByEmail = async (
    email: string
  ): Promise<ApiResponse<AutoCompleteItem | null>> => {
    try {
      const sp = getSP(); 
      const user = await sp.web.siteUsers.getByEmail(email)();
      const UserID = {
        key: user.Id,
        text: user.Title 
      };
      
      return {
        data: UserID,
        status: 200,
        message: "User ID retrieved successfully",
      };
    } catch (error) {
      console.error("Error fetching user ID by email: ", error);
      return {
        data: null,
        status: 500,
        message: "Error getting User ID",
      };
    }
  };

}