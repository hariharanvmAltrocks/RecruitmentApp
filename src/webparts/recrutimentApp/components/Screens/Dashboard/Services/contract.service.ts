import { Contract, HRWorkflow } from "../Types";

const MOCK_CONTRACTS: Contract[] = [
  {
    id: "CON-001",
    contractName: "CYBER SECURITY MONITORING SERVICES",
    contractId: "1013-CT-14-010",
    department: "SENIOR MANAGEMENT",
    supplier: "ACCENTURE TECHNOLOGIES",
    assignedHR: "Altkamoa01",
    requiredPositions: 10,
    filledPositions: 3,
    balance: 7,
    candidateCount: 6,
    interviewCount: 10,
    offerCount: 3,
    joiningCount: 2,
    endDate: "25-05-2026",
    remainingDays: 5,
    slaProgress: 86,
    slaStatus: "On Track",
    priority: "High",
    status: "Active",
    submissionDate: "25-05-25"
  },
  {
    id: "CON-002",
    contractName: "ERP SYSTEM MAINTENANCE AGREEMENT",
    contractId: "1013-CT-14-011",
    department: "MINING OPERATIONS",
    supplier: "CAPGEMINI SOLUTIONS",
    assignedHR: "Altkamoa01",
    requiredPositions: 8,
    filledPositions: 2,
    balance: 6,
    candidateCount: 5,
    interviewCount: 15,
    offerCount: 8,
    joiningCount: 6,
    endDate: "25-06-2026",
    remainingDays: 36,
    slaProgress: 64,
    slaStatus: "At Risk",
    priority: "High",
    status: "Active",
    submissionDate: "25-06-25"
  },
  {
    id: "CON-003",
    contractName: "SERVICES AGREEMENT - ANAPLAN IMPLEMENTATION",
    contractId: "1013-CT-14-006",
    department: "SENIOR MANAGEMENT",
    supplier: "DELOITTE CONSULTING",
    assignedHR: "Altkamoa01",
    requiredPositions: 6,
    filledPositions: 4,
    balance: 2,
    candidateCount: 7,
    interviewCount: 8,
    offerCount: 5,
    joiningCount: 4,
    endDate: "25-05-2026",
    remainingDays: 5,
    slaProgress: 71,
    slaStatus: "At Risk",
    priority: "Medium",
    status: "Active",
    submissionDate: "25-05-25"
  },
  {
    id: "CON-004",
    contractName: "MOBILE APPLICATION DEVELOPMENT PHASE II",
    contractId: "1013-CT-14-016",
    department: "SENIOR MANAGEMENT",
    supplier: "KAMOA IT SOLUTIONS",
    assignedHR: "Altkamoa01",
    requiredPositions: 12,
    filledPositions: 2,
    balance: 10,
    candidateCount: 10,
    interviewCount: 6,
    offerCount: 2,
    joiningCount: 1,
    endDate: "14-06-2026",
    remainingDays: 25,
    slaProgress: 42,
    slaStatus: "Overdue",
    priority: "High",
    status: "Active",
    submissionDate: "14-06-25"
  },
  {
    id: "CON-005",
    contractName: "IT INFRASTRUCTURE SUPPORT SERVICES PHASE II",
    contractId: "1013-CT-14-017",
    department: "SENIOR MANAGEMENT",
    supplier: "KAMOA IT SOLUTIONS",
    assignedHR: "Altkamoa01",
    requiredPositions: 5,
    filledPositions: 1,
    balance: 4,
    candidateCount: 4,
    interviewCount: 3,
    offerCount: 1,
    joiningCount: 0,
    endDate: "02-06-2026",
    remainingDays: 13,
    slaProgress: 25,
    slaStatus: "Overdue",
    priority: "High",
    status: "Active",
    submissionDate: "02-06-25"
  },
  {
    id: "CON-006",
    contractName: "CLOUD MIGRATION & SUPPORT SERVICES",
    contractId: "1013-CT-14-018",
    department: "TECH & INNOVATION",
    supplier: "KAMOA IT SOLUTIONS",
    assignedHR: "Altkamoa01",
    requiredPositions: 6,
    filledPositions: 0,
    balance: 6,
    candidateCount: 6,
    interviewCount: 0,
    offerCount: 0,
    joiningCount: 0,
    endDate: "30-07-2026",
    remainingDays: 71,
    slaProgress: 90,
    slaStatus: "On Track",
    priority: "High",
    status: "Active",
    submissionDate: "30-07-25"
  }
];

const MOCK_HR_WORKFLOWS: HRWorkflow[] = [
  {
    hrName: "Altkamoa04",
    hrAvatar: "A",
    assignedContracts: 0,
    requiredPositions: 14,
    filledPositions: 0,
    balance: 0,
    candidates: 0,
    completionPercentage: 0,
    status: "Active",
    slaPercentage: 0
  },
  {
    hrName: "Altkamoa01",
    hrAvatar: "A",
    assignedContracts: 5,
    requiredPositions: 14,
    filledPositions: 0,
    balance: 5,
    candidates: 0,
    completionPercentage: 36,
    status: "Active",
    slaPercentage: 36
  },
  {
    hrName: "Altkamoa02",
    hrAvatar: "A",
    assignedContracts: 0,
    requiredPositions: 14,
    filledPositions: 0,
    balance: 0,
    candidates: 0,
    completionPercentage: 0,
    status: "Active",
    slaPercentage: 0
  },
  {
    hrName: "Altkamoa03",
    hrAvatar: "A",
    assignedContracts: 0,
    requiredPositions: 14,
    filledPositions: 0,
    balance: 0,
    candidates: 0,
    completionPercentage: 0,
    status: "Active",
    slaPercentage: 0
  },
  {
    hrName: "Altkamoa09",
    hrAvatar: "A",
    assignedContracts: 0,
    requiredPositions: 14,
    filledPositions: 0,
    balance: 0,
    candidates: 0,
    completionPercentage: 0,
    status: "Active",
    slaPercentage: 0
  }
];

export class ContractService {
  public static async getContracts(): Promise<Contract[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_CONTRACTS);
      }, 300);
    });
  }

  public static async getContractsByHr(hrName: string): Promise<Contract[]> {
    const all = await this.getContracts();
    return all.filter((c) => c.assignedHR.toLowerCase() === hrName.toLowerCase());
  }

  public static async getHRWorkflows(): Promise<HRWorkflow[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_HR_WORKFLOWS);
      }, 300);
    });
  }
}
