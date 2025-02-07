import CommonService from "./CommonService/CommonService";
import { ICommonService } from "./CommonService/ICommonService";
import { IInterviewProcessService } from "./InterviewProcess/IInterviewProcessService";
import InterviewProcessService from "./InterviewProcess/InterviewProcessService";
import { IMasterService } from "./Master/IMasterService";
import MasterService from "./Master/MasterService";
import { IRecruitmentService } from "./RecruitmentProcess/IRecruitmentProcessService";
import RecruitmentService from "./RecruitmentProcess/RecruitmentProcessService";

export const masterService: IMasterService = new MasterService();
export const getVRRDetails: IRecruitmentService = new RecruitmentService();
export const CommonServices: ICommonService = new CommonService();
export const InterviewServices: IInterviewProcessService =
  new InterviewProcessService();
