import { UserRoleResponseDetails } from "../../Models/Master";
import { IMasterService } from "./IMasterService";
import { ListNames, ResponeStatus } from "../../utilities/Config";
import SPServices from "../SPService/SPServices";


export default class MasterService implements IMasterService {

    async userRole(): Promise<UserRoleResponseDetails> {
        try {
            let getjsonUserRole = {
                Listname: ListNames.HRMSUserRole,
                Select: "*",
                // Filter: [{
                //     FilterKey: "RoleTitle",
                //     Operator: "eq",
                //     FilterValue: currentUser,
                // }],
            };
            const items = await SPServices.SPReadItems(getjsonUserRole)
            debugger;
            console.log("UserRoleData", items);

            return {
                data: items,
                status: ResponeStatus.SUCCESS,
                message: "Data Fetched Success",
            };
        } catch (error) {
            console.log("userRole error", error);
            return {
                data: null,
                status: ResponeStatus.FAILED,
                message: "Data Fetched Failed",
            };
        }
    }

}