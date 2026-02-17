import * as React from "react";
import CandidateCard, { CandidateItem } from "./CandidateCard";
import "./CandidateList.css";

interface Props {
  candidates: CandidateItem[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onCardClick?: (id: number) => void;
}

const CandidateList: React.FC<Props> = ({
  candidates,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onCardClick,
}) => {

  //  Pagination Logic
  const paginatedCandidates = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return candidates.slice(startIndex, startIndex + pageSize);
  }, [candidates, currentPage, pageSize]);

  //  Footer Count
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="candidate-list-container">
      <h3 className="candidate-list-title">Candidate Details</h3>

      {/* Header Row */}
      <div
        className="candidate-card candidate-card-header"
        style={{
          fontWeight: 700,
          color: "#9ca3af",
          background: "transparent",
          border: "none",
          boxShadow: "none",
          cursor: "default",
        }}
      >
        <span>CANDIDATE NAME</span>
        <span>AppliedBy</span>
        <span>CREATED ON</span>
        <span>STATUS</span>
      </div>

      {/* Candidate Cards */}
      {paginatedCandidates.length > 0 ? (
        paginatedCandidates.map((item) => (
          <CandidateCard
            key={item.CandidateID}
            data={item}
            onClick={onCardClick}
          />
        ))
      ) : (
        <div
          style={{
            width: "100%",
            padding: "16px 0 16px 18px",
            color: "#6e6b6b",
            border: "2px solid #e0e4ea",
            background: "#fff",
            fontSize: "18px",
            fontWeight: 400,
            borderRadius: "12px",
            margin: "16px 0",
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          No Record Found
        </div>
      )}

      {/* Footer */}
      <div className="candidate-list-footer">
        <div>
          Showing {start} to {end} of {totalItems} candidates
        </div>

        <div className="candidate-list-pagination">
          {/* Previous */}
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="pagination-btn"
            aria-label="Previous Page"
          >
            ◀
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, idx) => {
            const page = idx + 1;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`pagination-btn${currentPage === page ? " active" : ""}`}
                disabled={currentPage === page}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            );
          })}

          {/* Next */}
          <button
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="pagination-btn"
            aria-label="Next Page"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
