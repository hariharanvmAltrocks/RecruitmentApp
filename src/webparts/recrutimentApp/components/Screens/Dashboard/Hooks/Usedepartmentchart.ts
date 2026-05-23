import { useState, useMemo, useCallback, useEffect } from "react";
import { DashboardServices } from "../../../../services/ServiceExport";
import { ResponeStatus } from "../../../../utilities/ApiConfig";

export interface DepartmentDataItem {
  name: string;
  value: number;
}

export interface UseDepartmentChartOptions {
  itemsPerPage: number;
  refreshKey: number;
}


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
  itemsPerPage,
  refreshKey,
}: UseDepartmentChartOptions): UseDepartmentChartReturn => {
  const [startIndex, setStartIndex] = useState(0);
  const [data, setData] = useState<DepartmentDataItem[]>([]);

      const fetchDepartmentPosition = useCallback(async () => {
      try {
  
        const res = await DashboardServices.GetDepartmentDetails();
        const data = res.data || [];
  
        if (res.status === ResponeStatus.SUCCESS) {
          setData(data);
        }
      } catch (error) {
        console.error("Dashboard urgent tasks error", error);
      } finally {
      }
    }, [refreshKey]);
  
    useEffect(() => {
      void fetchDepartmentPosition();
    }, [fetchDepartmentPosition, refreshKey]);


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
