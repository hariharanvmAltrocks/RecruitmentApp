import { RoleID } from "../../utilities/Config";
import { ButtonAction } from "../../utilities/LabelName";

export const navigateToList = (props: any) => {
    const basePath = props.CurrentRoleID.includes(RoleID.RecruitmentHR)
        ? "/ReviewProfileList/ReviewCandidateList"
        : "/RecurimentProcess/ReviewCandidateList";

    props.navigation(basePath, {
        state: {
            ID: props.stateValue?.RecruitmentID,
            TabNames: props.stateValue?.initialTab,
            ButtonAction: ButtonAction.View,
            JobCode: props.stateValue?.JobCode,
            tab: props.stateValue?.tabs,
            tabs: props.stateValue.tab,
            JobCodeID: props.stateValue?.JobCodeID,
            CandidateTabName: props.stateValue?.TabNamed,
        },
    });
};




