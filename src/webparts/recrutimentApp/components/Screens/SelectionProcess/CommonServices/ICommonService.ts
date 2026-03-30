import { ApiResponse } from "../../../../models/apimodels";

export type AutoCompleteItem = {
  key: number;
  text: string;
};

export interface ICommonService {
  getUserGuidByEmail(
    email: string
  ): Promise<ApiResponse<AutoCompleteItem | null>>;
}