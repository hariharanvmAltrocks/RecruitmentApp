import { useEffect, useMemo, useState } from "react";

export interface PositionDetails {
  jobId: string;
  jobTitle: string;
  jobCode: string;
  department: string;
  buCode: string;
  buName: string;
  subDepartment: string;
  section: string;
  deptCode: string;
  reportsTo: string;
  areaOfWork: string;
  nationality: string;
  patersonGrade: string;
  drcGrade: string;
  employmentCategory: string;
  contractType: string;
  numberOfPersons: number;
  dateRequired: string;
}

const buildMockPosition = (jobId: string): PositionDetails => ({
  jobId,
  jobTitle: "Head of Mining",
  jobCode: "MIN-001",
  department: "Mining Operations",
  buCode: "BU-OPS",
  buName: "Operations",
  subDepartment: "Open Pit",
  section: "Drilling",
  deptCode: "DEPT-MIN",
  reportsTo: "VP Operations",
  areaOfWork: "Kilimanjaro Site",
  nationality: "Open",
  patersonGrade: "D5",
  drcGrade: "G12",
  employmentCategory: "Permanent",
  contractType: "Full-time",
  numberOfPersons: 2,
  dateRequired: "2026-04-01",
});

export const usePositionDetails = (jobId: string | null) => {
  const [data, setData] = useState<PositionDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const mockMap = useMemo(() => ({
    "JOB-001": {
      ...buildMockPosition("JOB-001"),
      jobTitle: "HOD - Mining",
      jobCode: "HOD-MIN",
      department: "Mining",
      areaOfWork: "Kolwezi Site",
    },
    "JOB-002": {
      ...buildMockPosition("JOB-002"),
      jobTitle: "Senior Geologist",
      jobCode: "GEO-204",
      department: "Exploration",
      areaOfWork: "Lubumbashi",
      numberOfPersons: 1,
    },
  }), []);

  useEffect(() => {
    if (!jobId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      setData(mockMap[jobId] ?? buildMockPosition(jobId));
      setLoading(false);
    }, 650);

    return () => clearTimeout(timer);
  }, [jobId, mockMap]);

  return { data, loading };
};
