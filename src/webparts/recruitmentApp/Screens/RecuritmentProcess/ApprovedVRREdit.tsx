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
import { handleHRLeadProcess, handleHRProcess, updateMainRecord } from "./EditHooks/SaveData";

const ApprovedVRREdit: React.FC = (props: any) => {
  const { stateValue, navigation, userDetails, EmployeeList, webURL } = props;
  const form = useVrrFormState();
  const { 
    validateandSubmit, 
    NextValidation, 
  } = form;
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
  const [isMainComOpen, setMainComOpen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentRoleID = useMemo(
    () => GetStatusIdRoles(stateValue?.StatusId) ?? 0,
    [stateValue?.StatusId],
  );
  const pageLoading = isVrrDataLoading || isMasterDataLoading || isLoading;

const showAlert = (visible: boolean, Message?: string, Type?: string, onAction?: (confirmed: boolean) => void) => {
    setAlertProps({
        visible,
        Message: Message ?? "",
        Type: Type ?? HRMSAlertOptions.Error,
        ButtonAction: (confirmed: boolean) => {
            setAlertProps(prev => ({ ...prev, visible: false }));
            if (onAction) onAction(confirmed);
        },
    });
};

  console.log(dataError);

  const handleOpenComments = useCallback(async () => {
    setMainComOpen(false);
    const CommentsList = await getVRRDetails.GetCommentsData(
    EmployeeList,
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
  }, [stateValue.ID, EmployeeList]);

    const handleAdvertClick = useCallback(async () => {
   setIsViewed(true);
                  setMainComOpen(false);
                  setPreviewOpen(true);
  }, [isViewed]);

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

    const handlePreview = () => {
     const hasErrors = validateandSubmit(currentRoleID, stateValue?.StatusId , activeTab);
     if(hasErrors){
setPreviewOpen(true);
    setMainComOpen(false);
     }else{
        showAlert(
    true, 
    RecuritmentHRMsg.FormValidationMsg, 
    HRMSAlertOptions.Error,
    (confirmed: boolean) => {
        if (confirmed) {
            showAlert(false)
        } 
    }
  )
  }
}

const handleSubmit = async () => {
  const finalize = (msg: string, type = HRMSAlertOptions.Success) => {
    setIsLoading(false);
    showAlert(true, msg, type, (confirmed: boolean) => {
      if (confirmed && type === HRMSAlertOptions.Success) {
        navigation("/RecurimentProcess", {
          state: { TabName: stateValue?.TabName, tab: stateValue?.tab },
        });
      }
    });
  };

  const hasErrors = validateandSubmit(currentRoleID, stateValue?.StatusId, stateValue?.tab);

  if (hasErrors) {
    finalize(RecuritmentHRMsg.FormValidationMsg, HRMSAlertOptions.Error);
    return;
  }
  try {
    setIsLoading(true);
    
    switch (currentRoleID) {
      case RoleID.RecruitmentHRLead:
        if (stateValue?.StatusId === StatusId.PendingwithHRLeadtouploadONEMsigneddoc) {
          await handleHRLeadProcess(form, props, currentRoleID, finalize);
        }
        break;

      case RoleID.RecruitmentHR:
        await handleHRProcess(form, props, currentRoleID, finalize);
        break;

      case RoleID.HOD:
      case RoleID.LineManager:
        await updateMainRecord(form, props, currentRoleID);
        finalize(currentRoleID === RoleID.HOD ? RecuritmentHRMsg.ApprovedMsg : RecuritmentHRMsg.AdvertisementReveiwMsg);
        break;

      default:
        setIsLoading(false);
        break;
    }
  } catch (error) {
    console.error("Submit Error:", error);
    finalize(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error);
  }
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
            webURL={webURL}
            userDetails={userDetails}
            handleComments={handleOpenComments} 
            props={props} 
            handleAdvertClick= {handleAdvertClick}
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
            webURL={webURL}
            userDetails={userDetails}
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
      stateValue?.StatusId === StatusId.PendingwithRecruitmentHRtouploadAdv &&
      !form.advDetails.JobcodeChecked
    ) {
      return [
        { label: ButtonAction.Preview, onClick: handlePreview },
        ...(isViewed
          ? [{ label: ButtonAction.Submit, onClick: handleSubmit }]
          : []),
      ];
    }
     if (isViewed) {
      return [
          { label: ButtonAction.Submit, onClick: handleSubmit }
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

  const tabNameData = useMemo(() => {
  const base = props.stateValue?.TabName ? [{ tabName: props.stateValue.TabName }] : [];
  const activeIndex = tabs.findIndex((t) => t.value === activeTab);
  const trail = tabs
    .slice(0, activeIndex + 1)
    .map((t) => ({ tabName: t.label }));
  return [...base, ...trail].filter((item) => item.tabName);
}, [activeTab, tabs, props.stateValue?.TabName]);

  return (
    <>
     {isMainComOpen ? ( 
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
             TabName={tabNameData}
             ValidationError={() => NextValidation(activeTab)}
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
      </>
     ) : isPreviewOpen ? (
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
            setMainComOpen(true)
          }}
        />
      ) : isCommentsOpen && (
        <CommanComments
          Comments={commentsData}
          onClose={() => {setCommentsOpen(false) ; setMainComOpen(true)}}
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
