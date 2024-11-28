import { IMasterService } from "./Master/IMasterService";
import MasterService from "./Master/MasterService"
import { IRecruitmentService } from "./RecruitmentProcess/IRecruitmentProcessService";
import RecruitmentService from "./RecruitmentProcess/RecruitmentProcessService";

export const masterService: IMasterService = new MasterService();
export const getVRRDetails: IRecruitmentService = new RecruitmentService();