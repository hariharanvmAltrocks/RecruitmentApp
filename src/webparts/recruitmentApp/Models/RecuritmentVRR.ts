import { IDocFiles } from "../Services/SPService/ISPServicesProps"

export type InterviewPanelCandidateDetails = {
    ID: number;
    JobCode: string;
    PassportID: string;
    FristName: string;
    MiddleName: string;
    LastName: string;
    CandidateCVDoc: IDocFiles[];
}