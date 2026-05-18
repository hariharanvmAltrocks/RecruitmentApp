import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IDptData } from "../../../../../../services/RecruitmentTable/IRecruitmentService";
import { RecruitmentServices } from "../../../../../../services/ServiceExport";
import SPServices from "../../../../../../services/SPService/spservice";
import { ListNames } from "../../../../../../utilities/Config";
import {
  AddCalculateDate,
  SpiltDateOnly,
} from "../../../../../Hooks/dateConfigfn";
import { useModalPopup } from "../../../../../Comman/ModalPopup/useModalPopup";
import { RecuritmentHRMsg } from "../../../../../../utilities/ConditionConfig";
import { useadvert } from "../../../Components/AdvertExtension/advertextension";

export const useAdvertExtends = (
  handleClosePopup: () => void,
  handleRefresh: () => void,
  setAdvertPopupOpen: (value: boolean) => void,
) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const Submitted = useRef<boolean>(false);
  const { modalState, showModal, closeModal } = useModalPopup();

  const handleAdvertExtend = useCallback(
    async (payload: useadvert) => {
      Submitted.current = true;

      try {
        setLoading(true);
        const filterConditions = [
          {
            FilterKey: "JobCodeId",
            Operator: "eq",
            FilterValue: payload.form.JobCodeId,
          },
        ];
        const Conditions = "";

        const IsActive = 1;
        const IsExtened = 1;

        const portalRes = await RecruitmentServices.UploadAdvertisementInPortal(
          filterConditions,
          Conditions,
          payload.form,
          IsActive,
          IsExtened,
          undefined, // JobBasedBGVVerification (optional)
          undefined, // onemDocs (optional)
          payload.extendStartDate,
          payload.extendEndDate,
        );
        if (portalRes?.status !== 200) {
          Submitted.current = false;
          showModal({
            type: "error",
            title: "Advert Extend Failed",
            message: "Something went wrong. Please try again.",
            confirmLabel: "OK",
            onConfirm: () => {
              closeModal();
              handleClosePopup();
              navigate("/MyTracker");
              handleRefresh();
              setAdvertPopupOpen(false);
            },
          });
        }

        const todaydate = new Date();
        const vaildFrom = todaydate;
        const VaildTo = AddCalculateDate(todaydate, 13);
        let labels = payload.isSecondExtension
          ? "JobPostingFirstExtensionEndDate"
          : "JobPostingSecondExtensionEndDate";
        await SPServices.SPUpdateItem({
          Listname: ListNames.HRMSRecruitmentDptDetails,
          RequestJSON: {
            [labels]: SpiltDateOnly(VaildTo),
          },
          ID: payload.form?.ID,
        });

        showModal({
          type: "success",
          title: "Assigned Successfully",
          message: RecuritmentHRMsg.AdvertExtendsionSuccessMsg,
          confirmLabel: "OK",
          onConfirm: () => {
            closeModal();
            handleClosePopup();
            navigate("/MyTracker");
            handleRefresh();
            setAdvertPopupOpen(false);
          },
        });

        Submitted.current = true;
      } catch (error) {
        Submitted.current = false;
        console.error("Critical error during submission:", error);
        showModal({
          type: "error",
          title: "Advert Extend Failed",
          message: "Something went wrong. Please try again.",
          confirmLabel: "OK",
          onConfirm: () => {
            closeModal();
            handleClosePopup();
            navigate("/MyTracker");
            handleRefresh();
          },
        });
      } finally {
        setLoading(false);
      }
    },
    [navigate, showModal, closeModal],
  );

  return {
    handleAdvertExtend,
    Submitted,
    modalState,
    closeModal,
    loading,
  };
};
