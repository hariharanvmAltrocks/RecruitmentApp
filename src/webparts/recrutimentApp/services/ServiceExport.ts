import CandidateService from "./CandidateTable/CandidateService";
import { ICandidateService } from "./CandidateTable/ICandidateService";
import CareerPortalService from "./CareerPortal/CareerPortalService";
import { Icareerportal } from "./CareerPortal/ICareerPortal";
import CommonService from "./CommanAPi/CommanService";
import { ICommonService } from "./CommanAPi/Icommanservice";
import DashboardService from "./Dashboard/DashboardService";
import { IDashboard } from "./Dashboard/IDashboard";
import EvalutionL2Service from "./EvalutionL2/EvalutionL2";
import { IEvalutionL2 } from "./EvalutionL2/IEvalutionL2";
import { IMasterService } from "./MasterService/IMasterService";
import MasterService from "./MasterService/MasterService";
import { IMeetingShedule } from "./MeetingSchedule/Imeetingschedule";
import MeetingSchedule from "./MeetingSchedule/MeetingSchedule";
import { IMenuService } from "./MenuService/IMenu";
import MenuService from "./MenuService/menuService";
import { IOfferService } from "./OfferRelease/IOfferService";
import OfferService from "./OfferRelease/OfferService";
import { IQuestionCreation } from "./QuestionCreation/IQuestionCreation";
import QuestionCreateService from "./QuestionCreation/QuestionCreateService";
import { IRecruitmentService } from "./RecruitmentTable/IRecruitmentService";
import RecruitmentService from "./RecruitmentTable/RecruitmentService";

export const masterService: IMasterService = new MasterService();
export const menuService: IMenuService = new MenuService();
export const DashboardServices: IDashboard = new DashboardService();
export const CommonServices: ICommonService = new CommonService();
export const CareerPotalServices: Icareerportal = new CareerPortalService();
export const RecruitmentServices: IRecruitmentService =
  new RecruitmentService();
export const QuestionService: IQuestionCreation = new QuestionCreateService();

export const CandidateTable: ICandidateService = new CandidateService();

export const MeetingSchedules: IMeetingShedule = new MeetingSchedule();
export const OfferServices: IOfferService = new OfferService();

export const EvaluationserviceL2: IEvalutionL2 = new EvalutionL2Service();
