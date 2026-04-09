import { useState, useEffect } from "react";
import { IPreChecklist } from "../PositionFrame";

export interface IChecklistItem {
  ID: number;
  Title: string;
  Initials: string;
  value: boolean | null;
  type: "national" | "expat" | "common";
}

interface UsePreChecklistReturn {
  checklist: IChecklistItem[];
  allChecked: boolean;
  loading: boolean;
  updateCheckItem: (id: number, value: boolean) => void;
}

const getInitials = (title: string): string => {
  return title
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
};

const mockNationalData: IChecklistItem[] = [
  {
    ID: 1,
    Title: "Background Checks",
    Initials: "BC",
    value: null,
    type: "national",
  },
  {
    ID: 2,
    Title: "Medical Checks",
    Initials: "MC",
    value: null,
    type: "national",
  },
  {
    ID: 3,
    Title: "Signed Offer Letter",
    Initials: "SOL",
    value: null,
    type: "national",
  },
  {
    ID: 4,
    Title: "Employment Contract",
    Initials: "EC",
    value: null,
    type: "national",
  },
  {
    ID: 5,
    Title: "Ready for Onboarding",
    Initials: "RFO",
    value: null,
    type: "national",
  },
];

const mockExpatData: IChecklistItem[] = [
  {
    ID: 1,
    Title: "Background Checks",
    Initials: "BC",
    value: null,
    type: "expat",
  },
  {
    ID: 2,
    Title: "Signed Offer Letter",
    Initials: "SOL",
    value: null,
    type: "expat",
  },
  {
    ID: 3,
    Title: "Employment Contract",
    Initials: "EC",
    value: null,
    type: "expat",
  },
  {
    ID: 4,
    Title: "Work Permit Approved",
    Initials: "WPA",
    value: null,
    type: "expat",
  },
  {
    ID: 5,
    Title: "Visa Process",
    Initials: "RFO",
    value: null,
    type: "expat",
  },
  {
    ID: 6,
    Title: "Accommodation Booked",
    Initials: "AB",
    value: null,
    type: "expat",
  },
  {
    ID: 7,
    Title: "Travel Process",
    Initials: "TP",
    value: null,
    type: "expat",
  },
  {
    ID: 8,
    Title: "Ready for Onboarding",
    Initials: "RFO",
    value: null,
    type: "expat",
  },
];

export const usePreChecklist = (
  isExpat: boolean,
  preChecklist: IPreChecklist | undefined,
  IsActive: boolean,
): UsePreChecklistReturn => {
  const initialList = isExpat ? mockExpatData : mockNationalData;

  const [checklist, setChecklist] = useState<IChecklistItem[]>(initialList);
  const [loading, setLoading] = useState(false);

  const updateCheckItem = (id: number, value: boolean) => {
    setChecklist((prev) =>
      prev.map((item) => (item.ID === id ? { ...item, value } : item)),
    );
  };

  useEffect(() => {
    if (!isExpat || !IsActive || !preChecklist) {
      setChecklist(mockNationalData);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const ExpatData: IChecklistItem[] = [
        {
          ID: 1,
          Title: "Background Checks",
          Initials: "BC",
          value: preChecklist.BackgroundChecks,
          type: "expat",
        },
        {
          ID: 2,
          Title: "Signed Offer Letter",
          Initials: "SOL",
          value: preChecklist.SignedOfferLetterVerified,
          type: "expat",
        },
        {
          ID: 3,
          Title: "Employment Contract",
          Initials: "EC",
          value: preChecklist.SignedEmploymentContract,
          type: "expat",
        },
        {
          ID: 4,
          Title: "Work Permit Approved",
          Initials: "WPA",
          value: preChecklist.WorkPermitApproved,
          type: "expat",
        },
        {
          ID: 5,
          Title: "Visa Process",
          Initials: "RFO",
          value: preChecklist.VisaProcess,
          type: "expat",
        },
        {
          ID: 6,
          Title: "Accommodation Booked",
          Initials: "AB",
          value: preChecklist.AccommodationBooked,
          type: "expat",
        },
        {
          ID: 7,
          Title: "Travel Process",
          Initials: "TP",
          value: preChecklist.TravelProcess,
          type: "expat",
        },
        {
          ID: 8,
          Title: "Ready for Onboarding",
          Initials: "RFO",
          value: preChecklist.ReadyForOnboarding,
          type: "expat",
        },
      ];

      const NationalData: IChecklistItem[] = [
        {
          ID: 1,
          Title: "Background Checks",
          Initials: "BC",
          value: preChecklist.BackgroundChecks,
          type: "national",
        },
        {
          ID: 2,
          Title: "Medical Checks",
          Initials: "MC",
          value: preChecklist.MedicalCheckStatus,
          type: "national",
        },
        {
          ID: 3,
          Title: "Signed Offer Letter",
          Initials: "SOL",
          value: preChecklist.SignedOfferLetterVerified,
          type: "national",
        },
        {
          ID: 4,
          Title: "Employment Contract",
          Initials: "EC",
          value: preChecklist.SignedEmploymentContract,
          type: "national",
        },
        {
          ID: 5,
          Title: "Ready for Onboarding",
          Initials: "RFO",
          value: preChecklist.ReadyForOnboarding,
          type: "national",
        },
      ];

      setChecklist(isExpat ? ExpatData : NationalData);
    }, 650);

    return () => clearTimeout(timer);
  }, [isExpat, IsActive, preChecklist]);

  const allChecked =
    checklist.length > 0 && checklist.every((item) => item.value === true);

  return { checklist, allChecked, loading, updateCheckItem };
};
