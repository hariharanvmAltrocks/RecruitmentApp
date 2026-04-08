import { useEffect, useState } from "react";
import { useUIState } from "../../../../RecrutimentApp/UIStateContext";
import {
  DotAfricaStatus,
  StatusBarValue,
} from "../../../../../utilities/ConditionConfig";
import { OfferServices } from "../../../../../services/ServiceExport";
import { VerificationStep } from "../../../../Comman/Statusbadge/Statusbadge";

interface BGVRemark {
  id: number;
  BGVCode: string;
  BGVType: string;
  Remarks: string;
}

export const useBGVStatusDetails = (jobRequestID: string) => {
  const [data, setData] = useState<any>(null);
  const [bgvStatus, setBGVStatus] = useState<VerificationStep[]>([]);
  const [bgvComments, setBGVComments] = useState<BGVRemark[]>([]);
  const [rejectFlag, setRejectFlag] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
  const [revertFLag, setRevertflag] = useState(false);
  const [loading, setLoading] = useState(false);

  const { MatricID } = useUIState();

  useEffect(() => {
    if (!jobRequestID) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await OfferServices.CheckBGVerification(
          Number(jobRequestID),
        );

        const bgData = res?.data?.[0]?.bgVerification || [];

        if (!bgData.length) {
          setLoading(false);
          return;
        }

        // ✅ Map BGV Status
        const mappedStatus: VerificationStep[] = bgData.map(
          (item: any, index: number) => {
            const status = item.status?.trim().toLowerCase();
            const result = item.result?.trim().toLowerCase();
            let statusID: string = "";
            if (
              status === DotAfricaStatus.Completed.toLowerCase() &&
              result === DotAfricaStatus.Confirmed.toLowerCase()
            ) {
              statusID = "done";
            } else if (
              [
                DotAfricaStatus.skipped,
                DotAfricaStatus.skiped,
                DotAfricaStatus.error,
                DotAfricaStatus.cancelled,
              ].includes(status)
            ) {
              statusID = "warning";
            } else {
              statusID = "pending";
            }

            return {
              id: index + 1,
              name: item.bgType,
              sub: item.bgTypeCode,
              state: statusID,
            };
          },
          [],
        );

        setBGVStatus(mappedStatus);

        // ✅ Remarks
        const remarks: BGVRemark[] = bgData
          .filter((item: any) =>
            [
              DotAfricaStatus.skipped,
              DotAfricaStatus.skiped,
              DotAfricaStatus.error,
              DotAfricaStatus.cancelled,
            ].includes(item.status?.trim().toLowerCase()),
          )
          .map((item: any, index: number) => ({
            id: index + 1,
            BGVCode: item.bgTypeCode,
            BGVType: item.bgType,
            Remarks: item.remarks,
          }));

        setBGVComments(remarks);

        const revertflag = bgData
          ?.filter((item: any) => item.bgTypeCode === "IDCS")
          ?.every(
            (item: any) =>
              item.status?.trim().toLowerCase() ===
                DotAfricaStatus.skipped.trim().toLowerCase() ||
              item.status?.trim().toLowerCase() ===
                DotAfricaStatus.skiped.trim().toLowerCase() ||
              item.status?.trim().toLowerCase() ===
                DotAfricaStatus.error.trim().toLowerCase() ||
              item.status?.trim().toLowerCase() ===
                DotAfricaStatus.cancelled.trim().toLowerCase(),
          );
        setRevertflag(revertflag);

        // ✅ Reject flag
        const isRejected = bgData.some((item: any) =>
          [
            DotAfricaStatus.skipped,
            DotAfricaStatus.error,
            DotAfricaStatus.cancelled,
          ].includes(item.status?.trim().toLowerCase()),
        );

        setRejectFlag(isRejected);

        const allCompleted = bgData.every(
          (item: any) =>
            item.status?.trim().toLowerCase() ===
              DotAfricaStatus.Completed.toLowerCase() &&
            item.result?.trim().toLowerCase() ===
              DotAfricaStatus.Confirmed.toLowerCase(),
        );
        setAllCompleted(allCompleted);

        setData(res.data[0]);
      } catch (error) {
        console.error("Error fetching candidate details:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [jobRequestID, MatricID]);

  return {
    data,
    bgvStatus,
    bgvComments,
    revertFLag,
    rejectFlag,
    allCompleted,
    loading,
  };
};
