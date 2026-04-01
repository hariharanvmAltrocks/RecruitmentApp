import { IselectedPosition } from "../../components/Screens/OfferRelease/ReviewDocument/PositionFrame";
import { ApiResponse } from "../../models/apimodels";

export type IOfferService = {
  GetSelectedCandidate(
    RecID: number,
    CandidateID: number,
    SelectedCandidateID: number,
    JobRequestID: string,
  ): Promise<ApiResponse<IselectedPosition | null>>;
};
