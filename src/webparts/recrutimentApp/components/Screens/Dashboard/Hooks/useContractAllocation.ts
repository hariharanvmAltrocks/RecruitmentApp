import { useState, useEffect, useCallback } from "react";
import { Contract } from "../Types";
import { ContractService } from "../Services/contract.service";

export const useContractAllocation = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Contract[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ContractService.getContracts();
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { loading, data, error, refresh };
};
export default useContractAllocation;
