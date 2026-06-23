import { useEffect, useMemo, useState } from "react";
import { userInfo } from "../../../../../utilities/hooks/RoleContext";
import { masterService } from "../../../../../services/ServiceExport";

export interface SignatureDetails {
  reviewerName: string;
  reviewerInitial: string;
  jobTitleEN: string;
  jobTitleFR: string;
}

export const useSignatureDetails = () => {
  const [data, setData] = useState<SignatureDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { ADGroupData } = userInfo();
  const emailId = ADGroupData?.EmailId?.[0];

  // const mockMap = useMemo(() => ({
  //   "JOB-001": {
  //     reviewerName: "Jackson Mulenga",
  //     reviewerInitial: "JM",
  //     jobTitleEN: "HOD - Mining",
  //     jobTitleFR: "Chef de d�partement - Mines",
  //   },
  //   "JOB-002": {
  //     reviewerName: "Alisha Nsimba",
  //     reviewerInitial: "AN",
  //     jobTitleEN: "Senior Geologist",
  //     jobTitleFR: "G�ologue principal",
  //   },
  // }) as { [key: string]: SignatureDetails }, []);

  useEffect(() => {
    if (!emailId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const Filter = [
        { FilterKey: "EmailId", Operator: "eq", FilterValue: emailId }
      ]
      const response = await masterService.GetUserDetails(Filter, "and");
      if (response.status === 200 && response.data) {
        const data = response.data;
         const UserName = [data?.FirstName, data?.LastName]
    .filter(Boolean)
    .join(" ");
        const mappedData: SignatureDetails = {
          reviewerName: UserName,   //data.FirstName + " " + data.MiddleName + " " + data.LastName,
          reviewerInitial: (data.LastName || "").charAt(0).toUpperCase(),
          jobTitleEN: data.JopTitleEnglish || "",
          jobTitleFR: data.JopTitleFrench || "",
        }
         
        setData(mappedData)
        setLoading(false);
      }
    }, 550);

    return () => clearTimeout(timer);
  }, [emailId]);

  return { data, loading };
};


