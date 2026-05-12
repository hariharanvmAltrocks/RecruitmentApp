import { useState, useMemo, useCallback } from "react";

export interface DepartmentDataItem {
  name: string;
  value: number;
}

export interface UseDepartmentChartOptions {
  data: DepartmentDataItem[];
  itemsPerPage?: number;
}

export const DEPARTMENT_DATA: DepartmentDataItem[] = [
  { name: "Construction", value: 85 },
  { name: "Mining", value: 78 },
  { name: "Management Accounting", value: 72 },
  { name: "Human Resource", value: 68 },
  { name: "Technology", value: 65 },
  { name: "Camp and Facilities", value: 62 },
  { name: "HSE", value: 58 },
  { name: "Risk Control", value: 54 },
  { name: "Engineering", value: 48 },
  { name: "Processing", value: 42 },
  { name: "Procurement", value: 38 },
  { name: "Supply Chain", value: 35 },
  { name: "Sales and Logistics", value: 31 },
  { name: "Security", value: 28 },
  { name: "Asset Management", value: 25 },
  { name: "Concentrator", value: 22 },
  { name: "Smelter", value: 20 },
  { name: "Finance", value: 18 },
  { name: "Compliance", value: 16 },
  { name: "Community Relations", value: 14 },
  { name: "Environment", value: 12 },
  { name: "Sustainability", value: 11 },
  { name: "Quality Control", value: 10 },
  { name: "Internal Audit", value: 8 },
  { name: "Corporate Affairs", value: 6 },
  { name: "Legal", value: 5 },
  { name: "Strategy", value: 4 },
  { name: "Training", value: 3 },
];

export interface UseDepartmentChartReturn {
  visibleData: DepartmentDataItem[];
  currentPage: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  handleNext: () => void;
  handlePrev: () => void;
  goToPage: (page: number) => void;
  startIndex: number;
  totalItems: number;
}

const useDepartmentChart = ({
  data,
  itemsPerPage = 7,
}: UseDepartmentChartOptions): UseDepartmentChartReturn => {
  const [startIndex, setStartIndex] = useState(0);

  const sortedData = useMemo(
    () => [...data].sort((a, b) => b.value - a.value),
    [data],
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentPage = Math.floor(startIndex / itemsPerPage) + 1;
  const hasNext = startIndex + itemsPerPage < sortedData.length;
  const hasPrev = startIndex > 0;

  const visibleData = useMemo(
    () => sortedData.slice(startIndex, startIndex + itemsPerPage),
    [sortedData, startIndex, itemsPerPage],
  );

  const handleNext = useCallback(() => {
    if (hasNext) setStartIndex((prev) => prev + itemsPerPage);
  }, [hasNext, itemsPerPage]);

  const handlePrev = useCallback(() => {
    if (hasPrev) setStartIndex((prev) => Math.max(0, prev - itemsPerPage));
  }, [hasPrev, itemsPerPage]);

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(page, totalPages));
      setStartIndex((clamped - 1) * itemsPerPage);
    },
    [totalPages, itemsPerPage],
  );

  return {
    visibleData,
    currentPage,
    totalPages,
    hasPrev,
    hasNext,
    handleNext,
    handlePrev,
    goToPage,
    startIndex,
    totalItems: sortedData.length,
  };
};

export default useDepartmentChart;
