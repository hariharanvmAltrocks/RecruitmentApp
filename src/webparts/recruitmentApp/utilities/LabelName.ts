
export const labelNames = {
    PositionDetails: {
        BusinessUnitCode: "Business Unit Code",
        BusinessUnitName: "Business Unit Name",
        BusinessUnitDescription: "Business Unit Description",
        Department: "Department",
        SubDepartment: "Sub-Department",
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
        Location: "Location"
    },
    CommanLabel: {
        Comments: "Comments",
    },
    CandidateDetails: {
        ApplicantName: "Applicant Name",
        ApplicantSurname: "Applicant Surname",
        Nationality: "Nationality",
        Gender: "Gender",
        HighestRelevantQualification: "Highest Relevant Qualification",
        ExperienceInMiningIndustry: "Experience In Mining Industry(Years)",
        Numberoftaxdependents: "Number of tax dependents",
        LastCurrentposition: "Last/Current position",
        Currentemployer: "Last/Current employer",
        ExperienceInRelatedField: "Experience In Related Field(Years)",
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
        ResidencyCountry: " Are you residency in that country?",
        InterviewDateLevel1: "Interview Date -  level 1",
        InterviewTimeLevel1: "Interview Time - Level 1",
        MeetingLinkLevel1: "Meeting Link for Interview  - Level  1",
        InterviewDateLevel2: "Interviewed Date-Level 2",
        InterviewTimeLevel2: "Interview Time-Level 2",
        MeetingLinkLevel2: "Meeting Link for Interview - Level  2",
        InterviewPanelMembersLevel1: "Interview Panel Members - Level 1",
        InterviewPanelMembersLevel2: "Interview Panel Members - Level 2",
        DisabilityDetails: "Disability Details",
        Level1CandidateLabel: "Does the candidate fit for the vacant position ? (Level 1)",
        Level2CandidateLabel: "Does the candidate fit for the vacant position ? (Level 2)",
        ReviewProfileFeedback: "Review Profile Feedback - HR",
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
        NoticePeriod: "Notice Period"
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
}

export const Attachment = {
    Attachments: "Attachments",
    PositionDocument: {
        RoleProfileDocuments: "RoleProfile Documents",
        GradingDocuments: "Grading Documents",
        DraftONEMAdvertDocFrench: "Draft ONEM AdvertDoc French(Only PDF)",
        ONEMSignedStampedDocuments: "ONEM Signed and Stamped Document(Only Pdf)",
        ViewJobAdvertisement: "View Job Advertisement",
        CandidateResume: "Candidate Resume",
        ViewComments: "View Comments",
        CandidateDocuments: "Candidate Documents",
        OfferLetter: "Upload Offer Letter",
        ConsentDoc: "Upload Code of Business Content",
        EmployementDoc: "Upload Employement Contract",
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
    ConsentForm: "Code of Business Content",
    EmploymentContractForm: "Employment Contract",
    PersonalDocument: "Personal Document",
}