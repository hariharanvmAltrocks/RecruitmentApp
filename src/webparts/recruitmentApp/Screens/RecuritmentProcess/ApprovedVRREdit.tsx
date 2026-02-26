import * as React from "react";
import { useVrrFormState } from "./EditHooks/useVrrFormState";
import { useMasterData } from "./EditHooks/useMasterData";
import { useCallback, useMemo, useState } from "react";
import { GetStatusIdRoles } from "../../components/TabMerge";
import { getVRRDetails } from "../../Services/ServiceExport";
import {
  HRMSAlertOptions,
  RecuritmentHRMsg,
  RoleID,
  StatusId,
  TabName,
} from "../../utilities/Config";
import { ButtonAction } from "../../utilities/LabelName";
import CustomLoader from "../../Services/Loader/CustomLoader";
import BreadcrumbsComponent from "../../components/CustomBreadcrumps";
import PreviewScreen from "./PreviewScreen";
import CommanComments from "../../components/CommanComments";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import AdvertisementDetailsTab from "./EditHooks/AdvertisementDetailsTab";
import { useVrrData } from "./EditHooks/useVrrData";
import AdvertReviewTab from "./EditHooks/AdvertReviewTab";
import { CommentsData } from "../../Services/RecruitmentProcess/IRecruitmentProcessService";

const ApprovedVRREdit: React.FC = (props: any) => {
  const { stateValue, navigation } = props;

  const form = useVrrFormState();
  const { isLoading: isMasterDataLoading } = useMasterData();
  const { isLoading: isVrrDataLoading, error: dataError } = useVrrData(
    stateValue,
    props,
    form,
  );
  // const { validateAndSubmit, isSubmitting } = useVrrData(form, props);

  const [activeTab, setActiveTab] = useState("tab1");
  const [alertProps, setAlertProps] = useState({
    visible: false,
    Message: "",
    Type: "",
    ButtonAction: (confirmed: boolean) => {},
  });
  const [commentsData, setCommentsData] = useState<CommentsData[]>([]);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [isCommentsOpen, setCommentsOpen] = useState(false);
  const [isViewed, setIsViewed] = useState(false);
  const [advTab, setAdvTab] = useState(0);

  const currentRoleID = useMemo(
    () => GetStatusIdRoles(stateValue?.StatusId) ?? 0,
    [stateValue?.StatusId],
  );
  const pageLoading = isVrrDataLoading || isMasterDataLoading;

  const showAlert = (Message: string, Type: string, onAction?: () => void) => {
    setAlertProps({
      visible: true,
      Message,
      Type,
      ButtonAction: (confirmed: boolean) => onAction?.(),
    });
  };

  React.useEffect(() => {
    if (dataError) {
      showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error);

      console.error("API Error Details:", dataError);
    }
  }, [dataError, showAlert]);

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handleOpenComments = useCallback(async () => {
    const CommentsList = await getVRRDetails.GetCommentsData(
      props.EmployeeList,
      "",
      [
        {
          FilterKey: "RecruitmentID",
          Operator: "eq",
          FilterValue: stateValue.ID,
        },
      ],
    );
    if (CommentsList.status === 200) {
      setCommentsData(CommentsList.data);
    }
    setCommentsOpen(true);
  }, [stateValue.ID, props.EmployeeList]);

  const handleCancel = () => {
    setAlertProps({
      visible: true,
      Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
      Type: HRMSAlertOptions.Confirmation,
      ButtonAction: (confirmed) => {
        if (confirmed) {
          navigation("/RecurimentProcess", {
            state: { TabName: stateValue?.TabName, tab: stateValue?.tab },
          });
        }
        setAlertProps((prev) => ({ ...prev, visible: false }));
      },
    });
  };

  const handleSubmit = async () => {
    // await validateAndSubmit(currentRoleID, (alertOptions) => {
    //     setAlertProps({ ...alertOptions, visible: true });
    // });
  };

  const tabs = useMemo(() => {
    const items = [
      {
        label: TabName.PositionDetails,
        value: "tab1",
        content: (
          <AdvertReviewTab
            form={form}
            currentRoleID={currentRoleID}
            stateValue={stateValue}
            webURL={props.webURL}
            userDetails={props.useDetails}
          />
        ),
      },
    ];

    if (
      currentRoleID === RoleID.RecruitmentHR &&
      stateValue?.StatusId === StatusId.PendingwithRecruitmentHRtouploadAdv &&
      !form.advDetails.JobcodeChecked
    ) {
      items.push({
        label: TabName.AdvertisementDetails,
        value: "tab2",
        content: (
          <AdvertisementDetailsTab
            form={form}
            MasterData={props}
            advTab={advTab}
            setAdvTab={setAdvTab}
            currentRoleID={currentRoleID}
            stateValue={stateValue}
            webURL={props.webURL}
            userDetails={props.useDetails}
            handleComments={handleOpenComments}
          />
        ),
      });
    } else if (currentRoleID !== RoleID.RecruitmentHR) {
    }
    return items;
  }, [currentRoleID, stateValue?.StatusId, form]);

  const activeTabContent = useMemo(
    () => tabs.find((tab) => tab.value === activeTab)?.content,
    [tabs, activeTab],
  );

  const getActionButtons = useMemo(() => {
    if (
      currentRoleID === RoleID.RecruitmentHR &&
      stateValue?.StatusId === StatusId.PendingwithRecruitmentHRtouploadAdv
    ) {
      return [
        { label: ButtonAction.Preview, onClick: handlePreview },
        ...(isViewed
          ? [{ label: ButtonAction.Submit, onClick: handleSubmit }]
          : []),
      ];
    }
    if (
      currentRoleID === RoleID.HOD ||
      currentRoleID === RoleID.LineManager ||
      (currentRoleID === RoleID.RecruitmentHRLead &&
        stateValue?.StatusId ===
          StatusId.PendingwithHRLeadtouploadONEMsigneddoc)
    ) {
      return [{ label: ButtonAction.Submit, onClick: handleSubmit }];
    }
    return [];
  }, [currentRoleID, stateValue?.StatusId, isViewed, handleSubmit]);

  return (
    <>
      <CustomLoader isLoading={pageLoading}>
        <div className="menu-card">
          <BreadcrumbsComponent
            items={tabs.map(({ label, value, content }) => ({
              label,
              value,
              content,
            }))}
            initialItem={activeTab}
            onBreadcrumbChange={setActiveTab}
            handleCancel={handleCancel}
            JobValue={{
              JobTitle: form.formState.JobNameInEnglish,
              JobCode: form.formState.JobCode,
              Status:
                stateValue?.StatusId === StatusId.ReadyforRecruitmentProcess
                  ? ""
                  : stateValue?.Status,
            }}
            additionalButtons={getActionButtons}
          />
          {activeTabContent}
        </div>
      </CustomLoader>

      {isPreviewOpen && (
        <PreviewScreen
          data={form.advDetails}
          RoleSpec={form.roleSpeKnowledgeValue}
          Qualification={form.qualificationValue}
          TechinicalSkills={form.technicalSkillValue}
          JobTitle={form.formState.JobNameInEnglish}
          JobTitle_fr={form.formState.JobNameInFrench}
          onclose={() => setPreviewOpen(false)}
          Ok_btnfn={() => {
            setPreviewOpen(false);
            setIsViewed(true);
          }}
        />
      )}

      {isCommentsOpen && (
        <CommanComments
          Comments={commentsData}
          onClose={() => setCommentsOpen(false)}
        />
      )}

      {alertProps.visible && (
        <CustomAlert
          {...alertProps}
          onClose={() => setAlertProps({ ...alertProps, visible: false })}
        />
      )}
    </>
  );
};

export default ApprovedVRREdit;
