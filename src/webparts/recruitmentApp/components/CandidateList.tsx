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
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="candidate-list-container">
      <h3 className="candidate-list-title">Candidate Details</h3>
      <div className="candidate-card candidate-card-header" style={{ fontWeight: 700, color: '#9ca3af', background: 'transparent', border: 'none', boxShadow: 'none', cursor: 'default' }}>
        <span>CANDIDATE NAME</span>
        <span>APPLIED BY</span>
        <span>CREATED ON</span>
        <span>STATUS</span>
      </div>
      {candidates.length === 0 ? (
        <div
          className="candidate-card no-records-row"
          style={{
            gridColumn: '1 / -1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#9ca3af',
            fontWeight: 500,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            padding: '18px 0',
            marginBottom: '9px',
            minHeight: '8px',
            fontSize: '1.1rem',
          }}
        >
          No records found
        </div>
      ) : (
        candidates.map((item) => (
          <CandidateCard
            key={item.CandidateID}
            data={item}
            onClick={onCardClick}
          />
        ))
      )}
      {/* Footer */}
      <div className="candidate-list-footer">
        <div>
          Showing {start} to {end} of {totalItems} candidates
        </div>
        <div className="candidate-list-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            ◀
          </button>
          <span className="candidate-list-activePage">
            {currentPage}
          </span>
          <button
            disabled={end >= totalItems}
            onClick={() => onPageChange(currentPage + 1)}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
