export type ISharePointMenuItem = {
  MenuID: number;
  MenuIsActive: boolean;
  MenuActiveIcon: string;
  MenuInactiveIcon: string;
  MenuLabel: string;
  MenuPath: string;
};

export type ISharePointMenuItemAccess = {
  MenuIdId: number;
  RoleIdId: number;
  IsActive: string;

};

export type MenuResponse = {
  Id: number;
  DisplayName: string;
  Path: string;
  Icon: string;
  ActiveIcon: string;
  ParentId: number;
  Sort: number;
  IsActive: boolean;
  SubMenu?: MenuResponse;
  Tab?: ITab;
  Action?: IAction;
  Status?: IStatus;
  Children?: MenuResponse[];
  TabDetails?: any[];
}

interface ITab {
  key: string;
  text: string;
  sorting: string;
}

interface IAction {
  key: number;
  text: string;
}
interface IStatus {
  key: number;
  text: string;
}


export type MenuDetailsResponse = {
  data: MenuResponse[];
  status: number;
  message: string;
};

export type UserAccessDetailsResponse = {
  data: ISharePointMenuItemAccess[];
  status: number;
  message: string;
};


export const mockMenuData = [
  {
    Id: 27,
    DisplayName: "Selection Process",
    ParentId: 0,
    Path: "/RecurimentProcess",
    Icon: null,
    ActiveIcon: null,
    Sort: 1,
    IsActive: true,
    Action: { key: 2, text: "View" },
    Status: { key: null, text: null },
    Tab: { key: 3, text: "My Submission", sorting: null },
    TabDetails: [],
    SubMenu: {
      Id: 30,
      DisplayName: "Pre- Selection Process",
      Path: "/RecurimentProcess",
      Icon: null,
      ActiveIcon: null,
      Children: [],
      TabDetails: [
        { TabName: "Job Advertisement", Value: " ", StatusDetails: [{}] },
        { TabName: "Assign Agencies", Value: " ", StatusDetails: [{}] },
        { TabName: "Upload CV", Value: " ", StatusDetails: [{}] },
        { TabName: "My Submission", Value: " ", StatusDetails: [{}] },
      ],
    },
    Children: [
      {
        Id: 30,
        DisplayName: "Pre- Selection Process",
        ParentId: 27,
        Path: "/RecurimentProcess",
        Icon: null,
        ActiveIcon: null,
        Sort: 1.1,
        IsActive: true,
        Children: [],
        TabDetails: [
          { TabName: "Job Advertisement", Value: " ", StatusDetails: [{}] },
          { TabName: "Assign Agencies", Value: " ", StatusDetails: [{}] },
          { TabName: "Upload CV", Value: " ", StatusDetails: [{}] },
          { TabName: "My Submission", Value: " ", StatusDetails: [{}] },
        ],
      },
      {
        Id: 31,
        DisplayName: "Post- Selection Process",
        ParentId: 27,
        Path: "/ReviewProfileList",
        Icon: null,
        ActiveIcon: null,
        Sort: 1.2,
        IsActive: true,
        Children: [],
        TabDetails: [
          {
            TabName: "Review Profile",
            Value: " ",
            StatusDetails: [
              {
                Status: "Recruitment In Progress",
                StatusId: "28",
                ActionId: [2],
                Action: ["View"],
              },
            ],
          },
          {
            TabName: "Assign Interview Panel",
            Value: " ",
            StatusDetails: [
              {
                Status: "Recruitment In Progress",
                StatusId: "28",
                ActionId: [2],
                Action: ["View"],
              },
            ],
          },
          {
            TabName: "Interview Questions",
            Value: " ",
            StatusDetails: [
              {
                Status: "Pending with LM to Create a Minimum Selection Criteria Questions",
                StatusId: "126",
                ActionId: [2],
                Action: ["View"],
              },
              {
                Status: "Pending with HR and LM to create interview Question",
                StatusId: "124",
                ActionId: [2],
                Action: ["View"],
              },
            ],
          },
          {
            TabName: "Evaluation",
            Value: " ",
            StatusDetails: [{}, {}],
          },
        ],
      },
    ],
  },

  {
    Id: 28,
    DisplayName: "Recruitment Process",
    ParentId: 0,
    Path: "/UploadOfferDocumentList",
    Icon: null,
    ActiveIcon: null,
    Sort: 2,
    IsActive: true,
    Action: { key: 2, text: "View" },
    Status: { key: null, text: null },
    Tab: { key: 3, text: "My Submission", sorting: null },
    SubMenu: null,
    Children: [],
    TabDetails: [
      { TabName: "Background Verification", Value: " ", StatusDetails: [{}] },
      { TabName: "Offer Letter - Labour Hire", Value: " ", StatusDetails: [{}] },
      { TabName: "Offer Letter - KCSA", Value: " ", StatusDetails: [{}] },
      { TabName: "My Submission", Value: " ", StatusDetails: [{}] },
    ],
  },

  // ── Extra mock items so you can see the sidebar with more depth ────────────

  {
    Id: 29,
    DisplayName: "Onboarding",
    ParentId: 0,
    Path: "/Onboarding",
    Icon: null,
    ActiveIcon: null,
    Sort: 3,
    IsActive: true,
    Action: { key: 2, text: "View" },
    Status: { key: null, text: null },
    Tab: { key: 1, text: "Overview", sorting: null },
    SubMenu: null,
    Children: [
      {
        Id: 40,
        DisplayName: "Document Collection",
        ParentId: 29,
        Path: "/Onboarding/Documents",
        Icon: null,
        ActiveIcon: null,
        Sort: 3.1,
        IsActive: true,
        Children: [],
        TabDetails: [
          { TabName: "ID Documents", Value: " ", StatusDetails: [{}] },
          { TabName: "Contracts", Value: " ", StatusDetails: [{}] },
          { TabName: "Bank Details", Value: " ", StatusDetails: [{}] },
        ],
      },
      {
        Id: 41,
        DisplayName: "IT Setup",
        ParentId: 29,
        Path: "/Onboarding/IT",
        Icon: null,
        ActiveIcon: null,
        Sort: 3.2,
        IsActive: true,
        Children: [],
        TabDetails: [
          { TabName: "Equipment Request", Value: " ", StatusDetails: [{}] },
          { TabName: "Access Rights", Value: " ", StatusDetails: [{}] },
        ],
      },
      {
        Id: 42,
        DisplayName: "Orientation",
        ParentId: 29,
        Path: "/Onboarding/Orientation",
        Icon: null,
        ActiveIcon: null,
        Sort: 3.3,
        IsActive: true,
        Children: [],
        TabDetails: [
          { TabName: "Schedule", Value: " ", StatusDetails: [{}] },
        ],
      },
    ],
    TabDetails: [],
  },

  {
    Id: 32,
    DisplayName: "Reports",
    ParentId: 0,
    Path: "/Reports",
    Icon: null,
    ActiveIcon: null,
    Sort: 4,
    IsActive: true,
    Action: { key: 2, text: "View" },
    Status: { key: null, text: null },
    Tab: { key: 2, text: "Summary", sorting: null },
    SubMenu: null,
    Children: [],
    TabDetails: [
      { TabName: "Monthly Summary", Value: " ", StatusDetails: [{}] },
      { TabName: "Headcount Report", Value: " ", StatusDetails: [{}] },
      { TabName: "Audit Log", Value: " ", StatusDetails: [{}] },
    ],
  },
];