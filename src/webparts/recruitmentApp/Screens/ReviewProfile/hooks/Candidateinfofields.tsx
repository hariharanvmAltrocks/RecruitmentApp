import * as React from "react";
import CustomInput from "../../../components/CustomInput";
import { labelNames, ValidationAction } from "../../../utilities/LabelName";
import { TabName, TooltipHeader, TooltipType } from "../../../utilities/Config";
import { CandidateProfileState } from "./Candidatetypes";

interface Props {
  candidateProfile: CandidateProfileState;
  initialTab: string;
  interviewLevels: string;
  interviewGrade: string;
}


const CandidateInfoFields: React.FC<Props> = React.memo(
  ({ candidateProfile, initialTab, interviewLevels, interviewGrade }) => {
    const isReviewProfile = initialTab === TabName.ReviewProfile;
    const isAssignInterview = initialTab === TabName.AssignInterviewPanel;

    return (
      <>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-lg4">
            <CustomInput
              label={labelNames.CandidateDetails.ApplicantName}
              value={candidateProfile.ApplicantName}
              disabled mandatory={false}
            />
          </div>
          <div className="ms-Grid-col ms-lg4">
            <CustomInput
              label={labelNames.CandidateDetails.ApplicantSurname}
              value={candidateProfile.ApplicantSurName}
              disabled mandatory={false}
            />
          </div>
          <div className="ms-Grid-col ms-lg4">
            <CustomInput
              label={labelNames.CandidateDetails.Nationality}
              value={candidateProfile.Nationality}
              disabled mandatory={false}
            />
          </div>
        </div>

        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-lg4">
            <CustomInput label={labelNames.CandidateDetails.Gender} value={candidateProfile.Gender} disabled mandatory={false} />
          </div>
          <div className="ms-Grid-col ms-lg4">
            <CustomInput
              label={labelNames.CandidateDetails.HighestRelevantQualification}
              value={candidateProfile.HighestQualification}
              disabled mandatory={false}
            />
          </div>
          <div className="ms-Grid-col ms-lg4">
            <CustomInput
              label={labelNames.CandidateDetails.ExperienceInMiningIndustry}
              value={candidateProfile.ExperienceMining}
              disabled mandatory={false}
            />
          </div>
        </div>

        {isReviewProfile && (
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg4">
              <CustomInput label={labelNames.CandidateDetails.Numberoftaxdependents} value={String(candidateProfile.NumberOftax)} disabled mandatory={false} />
            </div>
            <div className="ms-Grid-col ms-lg4">
              <CustomInput label={labelNames.CandidateDetails.LastCurrentposition} value={candidateProfile.CurrentPosition} disabled mandatory={false} />
            </div>
            <div className="ms-Grid-col ms-lg4">
              <CustomInput label={labelNames.CandidateDetails.Currentemployer} value={candidateProfile.CurrentEmployer} disabled mandatory={false} />
            </div>
          </div>
        )}

        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-lg4">
            <CustomInput
              label={labelNames.CandidateDetails.ExperienceInRelatedField}
              value={String(candidateProfile.ExperRelatedfield)}
              disabled mandatory={false}
            />
          </div>

          {candidateProfile.ConflictsOfInterest === ValidationAction.No && (
            <div className="ms-Grid-col ms-lg4">
              <CustomInput
                label={labelNames.CandidateDetails.ConflictsOfInterest}
                value={candidateProfile.ConflictsOfInterest}
                disabled mandatory={false}
              />
            </div>
          )}

          {candidateProfile.disability && (
            <div className="ms-Grid-col ms-lg4">
              <CustomInput label={labelNames.CandidateDetails.Disability} value={candidateProfile.disability} disabled mandatory={false} />
            </div>
          )}

          {isAssignInterview && (
            <>
              <div className="ms-Grid-col ms-lg4">
                <CustomInput label={labelNames.CandidateDetails.NoOfInterviewLevels} value={interviewLevels} disabled mandatory={false} />
              </div>
              <div className="ms-Grid-col ms-lg4">
                <CustomInput label={labelNames.CandidateDetails.Grade} value={interviewGrade} disabled mandatory={false} />
              </div>
            </>
          )}
        </div>

        {isReviewProfile && (
          <div className="ms-Grid-row">
            {candidateProfile.countryOfResidency && (
              <div className="ms-Grid-col ms-lg4">
                <CustomInput label={labelNames.CandidateDetails.CountryOfResidency} value={candidateProfile.countryOfResidency} disabled mandatory={false} />
              </div>
            )}
            {candidateProfile.residentStatus && (
              <div className="ms-Grid-col ms-lg4">
                <CustomInput label={labelNames.CandidateDetails.ResidencyCountry} value={candidateProfile.residentStatus} disabled mandatory={false} />
              </div>
            )}
            {candidateProfile.maritalStatus && (
              <div className="ms-Grid-col ms-lg4">
                <CustomInput
                  label={labelNames.CandidateDetails.MaritalStatus}
                  value={candidateProfile.maritalStatus}
                  disabled mandatory={false}
                  TooltipTitle={candidateProfile.maritalStatusId !== "MS01" ? TooltipType.ChildData : ""}
                  TooltipData={candidateProfile.childrenDetails}
                  Tooltipheader={TooltipHeader?.ChildData}
                />
              </div>
            )}
            {candidateProfile.hasIvanhoeZijinExperience && (
              <div className="ms-Grid-col ms-lg4">
                <CustomInput
                  label={labelNames.CandidateDetails.WorkedGroupPartnerCompanies}
                  value={candidateProfile.hasIvanhoeZijinExperience}
                  disabled mandatory={false}
                  TooltipTitle={candidateProfile.hasIvanhoeZijinExperience !== ValidationAction.No ? TooltipType.CompanyData : ""}
                  TooltipData={candidateProfile.companyDetails}
                  Tooltipheader={TooltipHeader?.CompanyData}
                />
              </div>
            )}
          </div>
        )}
      </>
    );
  },
);

CandidateInfoFields.displayName = "CandidateInfoFields";
export default CandidateInfoFields;