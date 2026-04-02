import React, { useState } from "react";
import styles from "./CandidateDocumentsRepository.module.scss";
import { CandidateDocument, DocumentCategory, DocumentIcon } from "../ReviewDocument/Hooks/Userequireddocuments";
import { CandidateDocumentsData } from "../ReviewDocument/Hooks/Userequireddocuments";


const ICONS: Record<DocumentIcon, (color: string) => React.ReactNode> = {
 
  // Background Verification — fingerprint ring paths
  fingerprint: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 2.76 1.12 5.26 2.93 7.07" />
      <path d="M12 6c-3.31 0-6 2.69-6 6 0 1.54.58 2.94 1.53 4" />
      <path d="M12 10c-1.1 0-2 .9-2 2 0 .55.22 1.05.58 1.42" />
      <path d="M12 10c1.1 0 2 .9 2 2 0 1.8-.8 3.6-2 4.8" />
      <path d="M12 6c3.31 0 6 2.69 6 6 0 .88-.19 1.72-.52 2.48" />
      <path d="M12 2c5.52 0 10 4.48 10 10 0 1.93-.55 3.73-1.5 5.25" />
    </svg>
  ),
 
  // Offer Letters — document with signature flourish
  "offer-letter": (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="14" y2="13" />
      <line x1="8" y1="17" x2="11" y2="17" />
      {/* pen / signature mark */}
      <polyline points="13.5 13.5 12 15 12.5 17 14 16.5 15.5 17 16 15 14.5 13.5 13.5 13.5" />
    </svg>
  ),
 
  // Work Permit — globe with latitude/longitude lines
  "work-permit": (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M5.5 6.5a17 17 0 0 0 13 0M5.5 17.5a17 17 0 0 0 13 0" strokeOpacity="0.45" />
    </svg>
  ),
 
  // Employment Contract — document with lines + seal stamp
  contract: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="16" y2="16" />
      {/* stamp badge top-left */}
      <line x1="8" y1="8" x2="11" y2="8" />
      <line x1="10" y1="7" x2="10" y2="9" />
    </svg>
  ),
 
  // Vaccination — syringe icon
  vaccination: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="2" x2="22" y2="5" />
      <path d="M17 4l3 3" />
      <path d="m15 6 1 1-7.5 7.5a2 2 0 0 0-.5 1L8 18l2.5-.5a2 2 0 0 0 1-.5L19 9.5l-1-1" />
      <line x1="2" y1="22" x2="8" y2="16" />
      <line x1="12" y1="8" x2="16" y2="12" strokeDasharray="1.5 2" />
    </svg>
  ),
 
  // Police Clearance — shield with checkmark
  police: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l7 3v5c0 5-3.5 9.74-7 11-3.5-1.26-7-6-7-11V5l7-3z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
 
  // Payment Bill — credit card / receipt
  payment: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="6" y1="15" x2="8" y2="15" />
      <line x1="10" y1="15" x2="14" y2="15" />
    </svg>
  ),
 
  // Generic fallback — plain document
  generic: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
      <line x1="8" y1="13" x2="14" y2="13" />
      <line x1="8" y1="17" x2="11" y2="17" />
    </svg>
  ),
};


const DocumentRow: React.FC<{ doc: CandidateDocument }> = ({ doc }) => (
  <a
    href={doc.downloadUrl}
    target="_blank"
    rel="noopener noreferrer"
    className={styles.docRow}
    title={`Download ${doc.fileName}`}
  >
    <span className={styles.docRowIcon}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    </span>
    <span className={styles.docRowContent}>
      <span className={styles.docRowName}>{doc.fileName}</span>
      <span className={styles.docRowMeta}>
        {doc.fileSizeMB} MB &nbsp;·&nbsp; {doc.uploadedDate}
      </span>
    </span>
  </a>
);

const CategoryCard: React.FC<{ category: DocumentCategory; defaultOpen?: boolean }> = ({
  category,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const iconRenderer = ICONS[category.icon] ?? ICONS.generic;

  return (
    <div
      className={`${styles.categoryCard} ${open ? styles.categoryCardOpen : ""}`}
      style={{ "--accent": category.accentColor } as React.CSSProperties}
    >
      <button
        className={styles.categoryHeader}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`docs-${category.categoryId}`}
      >
        <span className={styles.categoryIconWrap}>
          {iconRenderer(category.accentColor)}
        </span>

        <span className={styles.categoryMeta}>
          <span className={styles.categoryName}>{category.categoryName}</span>
          <span className={styles.categoryCount}>
            {category.documents.length} DOCUMENTS AVAILABLE
          </span>
        </span>

        <span className={`${styles.chevronBtn} ${open ? styles.chevronOpen : ""}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          id={`docs-${category.categoryId}`}
          className={styles.docGrid}
        >
          {category.documents.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  );
};


interface CandidateDocumentsRepositoryProps {
  data: CandidateDocumentsData | null;
}

const CandidateDocumentsRepository: React.FC<CandidateDocumentsRepositoryProps> = ({
  data,
}) => {
  return (
    <section className={styles.repository}>
      <div className={styles.titleRow}>
        <span className={styles.titleBar} />
        <h2 className={styles.title}>CANDIDATE DOCUMENTS REPOSITORY</h2>
        <span className={styles.totalBadge}>{data?.totalFiles} Total Files</span>
      </div>

      <div className={styles.categoryList}>
        {data?.categories.map((cat, idx) => (
          <CategoryCard
            key={cat.categoryId}
            category={cat}
            defaultOpen={idx === 0} 
          />
        ))}
      </div>
    </section>
  );
};

export default CandidateDocumentsRepository;