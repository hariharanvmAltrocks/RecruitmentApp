import { OnboardingChecklistDRCtype, OnboardingChecklisttype } from "../Models/Screens"
import { NationalityCode } from "./Config"

export const labelNames = {
    PositionDetails: {
        BusinessUnitCode: "Business Unit Code",
        BusinessUnitName: "Business Unit Name",
        BusinessUnitDescription: "Business Unit Description",
        Department: "Department",
        SubDepartment: "Sub Department",
        Section: "Section",
        DepartmentCode: "Department Code",
        Nationality: "Nationality",
        PatersonGrade: "Paterson Grade",
        DRCGrade: "DRC Grade",
        EmploymentCategory: "Employment Category",
        TypeofContract: "Type of Contract",
        AreaofWork: "Area of Work",
        NoofPerson: "No of Person(s)",
        DatePositionRequired: "Date When Position Is Required",
        AdvertValidFrom: "Advert Valid From",
        AdvertValidTo: "Advert Valid To",
        Location: "Location",
        LabourHire: "Labour Hire"
    },
    CommanLabel: {
        Comments: "Comments",
        Reason: "Reason",
    },
    CandidateDetails: {
        ApplicantName: "Applicant Name",
        ApplicantSurname: "Applicant Surname",
        Nationality: "Nationality",
        Gender: "Gender",
        HighestRelevantQualification: "Highest Relevant Qualification",
        ExperienceInMiningIndustry: "Total Work Experience",
        Numberoftaxdependents: "Number of tax dependents",
        LastCurrentposition: "Last/Current position",
        Currentemployer: "Last/Current employer",
        ExperienceInRelatedField: "Relevant Experience(Years)",
        Disability: "Disability",
        MaritalStatus: "Marital Status",
        WorkedGroupPartnerCompanies: "Worked with Group/Partner Companies",
        Willingrelocate: "Willing to relocate if not currently living close to the relevant project site/office?",
        previouslyworked: "Has the person previously worked within the Ivanhoe Mines Group?",
        existingemployees: "Any family or other links with existing employees to declare? (If so, who? Attach detail)",
        businesslinks: "Any business links to declare? (If so, who? Attach detail)",
        ConflictsOfInterest: "Conflicts Of Interest",
        Reason: "Reason :",
        ConsultedWith: "Consulted With",
        ProofDiscussion: "Proof of Discussion",
        ReviewProfileFeedbackHR: "Review Profile Feedback - HR ",
        NoOfInterviewLevels: "No Of Interview Level's",
        Grade: "Grade",
        CountryOfResidency: "Country Of Residency",
        ResidencyCountry: "Are you Resident in that country?",
        InterviewDateLevel1: "Interview StartDate -  level 1",
        InterviewTimeLevel1: "Interview EndDate - Level 1",
        MeetingLinkLevel1: "Meeting Link for Interview  - Level  1",
        InterviewDateLevel2: "Interviewed StartDate-Level 2",
        InterviewTimeLevel2: "Interview EndDate-Level 2",
        MeetingLinkLevel2: "Meeting Link for Interview - Level  2",
        InterviewPanelMembersLevel1: "Interview Panel Members - Level 1",
        InterviewPanelMembersLevel2: "Interview Panel Members - Level 2",
        DisabilityDetails: "Disability Details",
        Level1CandidateLabel: "Does the candidate fit for the vacant position ? (Level 1)",
        Level2CandidateLabel: "Does the candidate fit for the vacant position ? (Level 2)",
        ReviewProfileFeedback: "Review Profile Feedback - HR",
        RoomDetails: "RoomDetails",
        MeetingRoom: "Meeting Room",
        MeetingRooml2: "Meeting Room for Level 2 Interview",
        DateInterview: "Date of Interview",
        NofInterviewLevel: "No of Interview Level's",
        InterviewPanelLevel1: "Interview Panel Level 1",
        InterviewPanelLevel2: "Interview Panel Level 2",
        CompanyName: "Company Name",
        PositionID: "PositionID",
        Email: "Email",
        ProofOfIdentity: "Proof Of Identity",
        IdentityNumber: "Identity Number",
        JoiningDate: "Joining Date",
        NoticePeriod: "Notice Period",
        PreviousEmployee: "Reference Employer Details",
        EmployeeName: "Reference Name",
        EmployeeDesi: " Reference Designation",
        EmployeeEmail: " Reference Email ID",
        EmployeeCN: "Reference Contact Number",
        EmployeeCompanyN: "Reference Company Name",
        PPE: " Personal Protective Equipment sizing information"
    },
    Questionnaires: {
        Questionnaires: "Questionnaires",
        QuestionGrade: "(Rating Guide: 3 - Excellent, 2 - Acceptable, 1 - Not Acceptable)",
        ExpectedAnswer: "Expected Answer:",
        Rating: "Rating ",
        ScorecardDetails: "Scorecard Details(1-Lower Score, 5 -Highest Score)",
        QualificationsRelevant: "Qualifications (Relevant)",
        ExperienceRelevant: "Experience (Relevant)",
        Knowledge: "Knowledge",
        EnergyLevel: "Energy Level",
        MeetsJobRequirements: "Meets All Job Requirements",
        WillContributeCultureRequired: "Will Contribute to the Culture Required",
        ExpatExperienceCongolese: "Expat Experience/Congolese",
        OtherCriteriaRecognizedPanel: "Other Criteria Recognized by the Panel",
        ConsiderEmployment: "To Consider for Employment",
        FeedbackRequiredRatingsBelow: "Feedback(Required for Ratings Below 2)",
        OverallEvaluationFeedback: "Overall Evaluation Feedback",
    },
    HODScordCard: {
        ScorecardDetailsLevel: "Scorecard Details - Level 1",
        ScorecardDetails: "Scorecard Details",
        QuestionEvaluationScorecard: "Question Evaluation Scorecard",
        OverallEvaluationScorecard: " Overall Evaluation Scorecard",
        wishselectcandidate: "Do you wish to select this candidate?",
        AssignPositionID: "Assign PositionID",
        Selectposition: "Select a position",
        FeedbackLevel2: "Feedback - Level 2",
        FeedbackLevel1: "Feedback - Level 1",

        //  OVERALLGRADEPOINT = (GPA: string) => {
        //     return `OVERALL GRADE POINT AVERAGE (GPA) - ${GPA} /5.0`
        //  },

    },
    DocumentViewer: "Document Viewer",
    CandidateDocument: "Candidate Documents",
    AdvertExten: {
        StartDate: "Start Date",
        EndDate: "End Date",
        Firstextensiondate: "First Extension Date",
        Secondextensiondate: "Second Extension Date",
        Thirdextensiondate: "Third Extension Date",
    },
    AdvertisementExtension: "Advertisement Extension",
    AdminPanel: {
        ExternalUserCode: "External User Code",
        FirstName: "First Name",
        LastName: "Last Name",
        CompanyName: "Company Name",
        Designation: "Designation",
        EmailID: "Email ID",
        UserType: "User Type",
        Password: "Password",
        ConfirmPassword: "Confirm Password",
        IsActive: "Is Active",
        NoOfUsers: "No of Users",
        StartDateOfContract: "Start Date of Contract",
        EndDateOfContract: "End Date of Contract",
        Nationality: "Nationality",
        FullName: "Name",
        PhoneNumber: "Phone Number",
    },
    BGVLabels: {
        BGVConsultedLabel: "Background Verification"
    },
    AdvertisementLabel: {
        Advertisement: "Advertisement",
        RolePurpose: "Role Purpose",
        JobDescription: "Job Description",
        PreferredTotalExperience: "Preferred Total Experience",
        PreferredExperienceMining: "Preferred Experience in Mining Industry (Years) ",
        MinimumQualification: "Minimum Qualification",
        PreferredQualification: "Preferred Qualification",
        RoleSpecificKnowledge: "Role Specific Knowledge ",
        RequiredLevel: "Required Level ",
        TechnicalSkills: "Technical Skills - Ability to apply Knowledge",
        LevelProficiency: "Level of Proficiency",
        JobTitleFunctionalManager: "Job Title of Functional Manager",
        FunctionalManagerName: "Functional Manager Name",
        JobTitleLineManagerSupervisor: "Job Title of Line Manager/Supervisor ",
        LineManagerSupervisorName: "Line Manager/Supervisor Name ",
        JobFunctionalType: "Job Functional Type "
    },
    Advertisement_fr: {
        Advertisement: "Annonce",
        RolePurpose: "Objectif du rôle",
        JobDescription: "Description du poste",
        PreferredTotalExperience: "Expérience totale préférée",
        PreferredExperienceMining: "Expérience préférée dans l’industrie minière (années)",
        MinimumQualification: "Qualification minimale",
        PreferredQualification: "Qualification préférée",
        RoleSpecificKnowledge: "Connaissances spécifiques au rôle",
        RequiredLevel: "Niveau requis",
        TechnicalSkills: "Compétences techniques - Capacité à appliquer les connaissances",
        LevelProficiency: "Niveau de maîtrise",
        JobTitleFunctionalManager: "Titre du poste du responsable fonctionnel",
        FunctionalManagerName: "Nom du responsable fonctionnel",
        JobTitleLineManagerSupervisor: "Titre du poste du supérieur hiérarchique",
        LineManagerSupervisorName: "Nom du supérieur hiérarchique",
        JobFunctionalType: "Type fonctionnel du poste"
    },
    DashboardGridFilter: {
        Department: "Department",
        Nationality: "Nationality",
        JobCode: "Job Code",
        BUCode: "Business Unit Code",
        PositionRequest: "Position Request"
    }
}

export const Attachment = {
    Attachments: "Attachments",
    PositionDocument: {
        RoleProfileDocuments: "RoleProfile Documents(English)",
        RoleProfileDocuments_fr: "RoleProfile Documents(French)",
        GradingDocuments: "Grading Documents(English)",
        GradingDocuments_fr: "Grading Documents(French)",
        DraftONEMAdvertDocFrench: "Draft ONEM AdvertDoc French(Only PDF)",
        ONEMSignedStampedDocuments: "ONEM Signed and Stamped Document(Only Pdf)",
        ViewJobAdvertisement: "View Job Advertisement",
        CandidateResume: "Candidate Resume",
        ViewComments: "View Comments",
        CandidateDocuments: "Candidate Documents",
        OfferLetter: "Upload Offer Letter(Only PDF)",
        OfferLetterFre: "Upload Offer Letter (French)",
        ConsentDoc: "Upload Signed Consent Form",
        EmployementDoc: "Upload Employement Contract",
        WorkpermitDocs: "Upload Workpermit Acknowledged ",
        ProofOfPayment: "Upload Proof Of Document",
        DownloadConsentForm: "Download Consent Form :",
        DOTAficaCFD: "Kindly review the consent form, provide your signature, and upload the signed document below.",
        BGVComments: "Dot's Africa Comments"
    },
}

export const CheckboxContent = {
    CheckboxContent: "I hereby agree to submit this request for approval.",
    ApprovalCheckbox: "I hereby acknowledge that I have reviewed the job advertisement.",
    UploadOnemDocument: "I hereby agree to post the advert on the portal.",
    ReviewedCandidate: "I hereby acknowledge that I have reviewed the candidate details.",
    InterviewPanel: "I hereby reviewed candidate details and assigning interview panel.",
    RescheduleInterview: "I hereby acknowledge that I have reschedule the interview.",
    ScorecardEntry: "I hereby acknowledge completion of the scorecard entry.",
    HODscorecarddetails: "I hereby acknowledge that I have reviewed the candidate scorecard details.",
    PostRecrutimentCheckboxContent: "I confirm that I have carefully reviewed the contents and will take necessary action based on my expertise."
}

export const ValidationMsg = {
    Minimumthreerequired: "Minimum of three is required",
    InvaildDate: "Invaild Date",
}

export const InterviewDate = (formattedDate: any): string => {
    return `
    <div style="text-align: center;">
      <h3>⚠️ Action cannot be performed.</h3>
      <p><strong>Interview Open Date:</strong> ${formattedDate}</p>
      <p>Please try again on the Interview Date.</p>
    </div>`;
}

export const PendingCandidateAlertMsg = (pendingcount: number): string => {
    return `
          <div style="text-align: center;">
            <h3>⚠️ Pending Candidate Review.</h3>
            <p>There is ${pendingcount} pending candidate currently on hold</p>
            <p>Please review the candidate and take the necessary action to proceed with interview scheduling.</p>
          </div>`
}

export const JobAdvertAlertMsg = (Dateformat: any): string => {
    return `
              <div style="text-align: center;">
                <h3>⚠️ Action cannot be performed.</h3>
                <p>This job advert is still active and open for recruitment.</p>
                <p><strong>Expiry Date:</strong> ${Dateformat}</p>
                <p>Please try again after it expires.</p>
              </div>`
}

export const ActionName = {
    Completed: "Completed",
    Pending: "Pending"
}

export const PositionStatus = {
    Vacant: "Vacant",
    RecruitmentInitiator: "Recruitment Initiated",
    Filled: "Filled",
    RecruitmentInProgress: "Recruitment InProgress"
}

export const ButtonAction = {
    Update: "Update",
    Next: "Next",
    Preview: "Preview",
    Submit: "Submit",
    Approve: "Approve",
    Reject: "Reject",
    Revert: "Revert",
    Cancel: "Cancel",
    Back: "Back",
    Save: "Save",
    Add: "Add",
    Delete: "Delete",
    Edit: "Edit",
    View: "View",
    Download: "Download",
    Upload: "Upload",
    Reschedule: "Reschedule",
    Assign: "Assign",
    Remove: "Remove",
    close: "Close",
    Review: "Reviewed",
    OnHold: "OnHold",
    ScheduleforInterview: "Schedule for Interview",
    Selected: "Selected",
    Rejected: "Rejected",
    Initiated: "Initiate",
    SaveAsDraft: "Save as draft",
    New: "New",
    ResetPassword: "Reset Password",
    Rework: "Rework",
    ProceedToSubmit: "Proceed To Submit",
    ReInitiate: "Re-Initiate",
}

export const IsCandidateFit = {
    Yes: "Yes",
    No: "No",
    OnHold: "On Hold",
};

export const ValidationAction = {
    Yes: "Yes",
    No: "No",
    Ok: "OK",
    Cancel: "Cancel"
}

export const DisplayFolderName = {
    Offerletter: "Offer Letter",
    LabourHireOffer: "Labour Hire Offer Letter Release",
    LabourHireEC: "Labour Hire Employment Contract Release",
    ConsentForm: "Code of Business Content",
    EmploymentContractForm: "Employment Contract",
    PersonalDocument: "Personal Document",
    BackgroundVerification: "Background Verification",
    WorkPermitDocument: "WorkPermit Document",
    WorkPermitPayment: "WorkPermit Payment Document",
    PaymentBill: "Payment Bill Document",
    PoliceClearanceCertificate: "Police Clearance Certificate",
    CovidVaccinationCertificate: "Covid Vaccination Certificate",
    YellowFeverVaccinationCertificate: "Yellow Fever Vaccination Certificate",
}

export const RadioBtnLabel = {
    BGVNationalsLabel: "Is the background verification cleared ?",
    BGVExpatriatesLabel: "Are you sure you want to initiate Background verification for this candidate?",
    OfferInitiationLabel: "Do you want to proceed with initiating the Offer Letter process for the Labour Hire?",
    DocumentVerification: "Is the document verified?",
    PaymentReview: "Has the Work Permit payment been verified ?",
    BGVNational: "Are the background documents verified ?",
    BGVStatusProcess: "Are you sure you want Move the candidate to Resi Process",
    JobBasedVerification: "For this Job Title, what types of background verification are required?",
    BGVConfirmPopup: "Do you wish to proceed with this action ?",
}

export const EmailTemplateCodes = {
    LineManagerEmail: "CANDIDATE_PROFILE_SHORTLISTED",
    CandidateRejected: "INTERVIEW_REJECTED",
    InterviewSchedule: "INTERVIEW_PROCESS",
    HODSelection: "INTERVIEW_SELECTED",
    HODSelectionLevel1: "HOD1_SelectCandidate",
    InterviewScheduleLevel1: "RecuritmentHR_ScheduleInterview_Level1",
}

export const EmployeementCategory = {
    KCSAEmployee: "KCSA Employee",
    LaborhireContractor: "Labour hire/Contractor",
}

export const quesContentId = {
    WillingRelocate: "FD889B9C1B51F13738596ACFB206E881EAC9",
}

export const BGVRequestDocument = {
    IDV: "ID Verification",
    PRE: "Matric Pre-92 Umalusi Verification",
    PST: "Matric Post-92 Umalusi Verification",
    UMF: "Umalusi Full Verification",
    SAQ: "SA University Qualification Verification",
    NL: "TVET and SA Teachers College Verification",
    TC: "Trade Certificate Verification",
    SC: "Certificate / Short Course Verification",
    SETA: "SETA Verification",

    ITC: "TransUnion Credit Check",
    IDC: "Criminal Record Check",
    EHCR: "Employment Character Reference Verification",
    PSY: "Psychometric Assessment",
    DMC: "Director Member Confirmation",
    IDCS: "ID Check Secondary",
}

export const SADocs = ["IDV", "PRE", "PST", "UMF", "SAQ", "NL", "TC", "SC", "SETA", "ITC", "IDC", "EHCR", "PSY", "DMC", "IDCS", "GQ", "EXP", "ConsentForm"]
export const NSADocs = ["GQ", "CZ", "EXP", "ConsentForm"]

export const JobBasedBVG = ["NL", "TC", "SETA", "ITC", "DMC", "PS"]

export const BGVDocumentName = {
    GQ: "Global University Qualification Verification",
    CZ: "Citizenship Verification",
    EXP: "Experian Credit Check",
    IDV: "ID Verification",
    PRE: "Matric Pre-92 Umalusi Verification",
    PST: "Matric Post-92 Umalusi Verification",
    UMF: "Umalusi Full Verification",
    SAQ: "SA University Qualification Verification",
    NL: "TVET and SA Teachers College Verification",
    TC: "Trade Certificate Verification",
    SC: "Certificate / Short Course Verification",
    SETA: "SETA Verification",
    ITC: "TransUnion Credit Check",
    IDC: "Criminal Record Check",
    EHCR: "Employment Character Reference Verification",
    PSY: "Psychometric Assessment",
    DMC: "Director Member Confirmation",
    IDCS: "ID Check Secondary",
    PS: "Psychometric Assessment",
    ConsentForm: "Dot's Africa Consent Form",
}
export const CHECKLIST_CONFIG = {
    [NationalityCode.Nationals]: {
        DocumentComplianceChecks: [
            "Background Checks",
            "Medical Checks",
            "Signed Offer Letter",
            "Employment Contract",
        ],
        LogisticsEmployeeSupport: [],
        FinalStatus: ["Ready for Onboarding"],
    },

    [NationalityCode.SouthAfrica]: {
        DocumentComplianceChecks: [
            "Background Checks",
            "Signed Offer Letter",
            "Employment Contract",
            "Work Permit Approved",
        ],
        LogisticsEmployeeSupport: [
            "Visa Process",
            "Accommodation Booked",
            "Travel Process",
        ],
        FinalStatus: ["Ready for Onboarding"],
    },
};


export const onboardingDataDRC: OnboardingChecklistDRCtype = {
    DocumentComplianceChecks: {
        label: "Document Compliance Checks",
        DocumentComplianceChecks: {
            BackgroundChecks: { id: 1, label: "Background Checks", value: false },
            SignedOfferLetter: { id: 2, label: "Signed Offer Letter", value: false },
            SignedEmploymentContract: { id: 3, label: "Employment Contract", value: false },
            MedicalChecks: {
                id: 0,
                label: "Medical Checks",
                value: false
            }
        },
    },
    FinalStatus: {
        label: "Final Status",
        FinalStatus: {
            ReadyforOnboarding: { id: 8, label: "Ready for Onboarding", value: false },
        },
    },
};

export const onboardingDataExpat: OnboardingChecklisttype = {
    DocumentComplianceChecks: {
        label: "Document Compliance Checks",
        DocumentComplianceChecks: {
            BackgroundChecks: { id: 1, label: "Background Checks", value: false },
            SignedOfferLetter: { id: 2, label: "Signed Offer Letter", value: false },
            SignedEmploymentContract: { id: 3, label: "Employment Contract", value: false },
            WorkPermitApproved: { id: 4, label: "Work Permit Approved", value: false },
        },
    },
    LogisticsEmployeeSupport: {
        label: "Logistics Employee Support",
        LogisticsEmployeeSupport: {
            VisaProcess: { id: 5, label: "Visa Process", value: false },
            AccommodationBooked: { id: 6, label: "Accommodation Booked", value: false },
            TravelProcess: { id: 7, label: "Travel Process", value: false },
        },
    },
    FinalStatus: {
        label: "Final Status",
        FinalStatus: {
            ReadyforOnboarding: { id: 8, label: "Ready for Onboarding", value: false },
        },
    },
};


export const ChecklistStatusExpat = {
    "Background Checks": false,
    "Signed Offer Letter": false,
    "Employment Contract": false,
    "Work Permit Approved": false,
    "Visa Process": false,
    "Accommodation Booked": false,
    "Travel Process": false,
    "Ready for Onboarding": false,
};

export const ChecklistStatusDRC = {
    "Background Checks": false,
    "Medical Checks": false,
    "Signed Offer Letter": false,
    "Employment Contract": false,
    "Ready for Onboarding": false,
};


export const ExternalUserType = {
    Agent: "Agent",
    LabourHire: "Labour Hire",
}

export const DotAfricaStatus = {
    Completed: "completed",
    Confirmed: "Confirmed",
    skipped: "skipped",
    skiped: "skiped",
    pending: "pending",
    error: "error",
    cancelled: "cancelled",
    new: "new",

}

export const StatusBarValue = {
    Completed: "Completed",
    Pending: "Pending",
    Failed: "Failed"
}

export const DotTooltipStatus = {
    Passed: "Passed",
    Failed: "Failed",
    Pending: "Pending"
}

export const CommanStyle = {
    frontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`
}

export const RowsPerPageOptions = {
    FirstCount: 20,
    MiddleCount: 25,
    LastCount: 30,
}

export const tabValue = {
    tab1: "tab1",
    tab2: "tab2",
    tab3: "tab3"
}

export const QuestionCreatedBy = {
    LM: "LM",
    HR: "HR"
}