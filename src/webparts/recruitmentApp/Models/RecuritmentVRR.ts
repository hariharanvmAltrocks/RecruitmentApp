import { IDocFiles } from "../Services/SPService/ISPServicesProps"

export type InterviewPanelCandidateDetails = {
    ID: any;
    JobCode: any;
    PassportID: any;
    FristName: any;
    MiddleName: any;
    LastName: any;
    CandidateCVDoc: IDocFiles[];
}