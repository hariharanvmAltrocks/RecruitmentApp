import React, { useEffect, useState, useRef } from "react";
import { X, FileText, Clock, Inbox } from "lucide-react";
import styles from "./commantsPopup.module.scss";

export interface Comment {
  id: number;
  BGVCode: string;
  BGVType: string;
  Remarks: string;
}

export interface ViewCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  title?: string;
  isLoading?: boolean;
}

const parseRoleColor = (role: string) => {
  const lowerRole = role.toLowerCase();
  if (lowerRole.includes("level 1")) return styles.roleLevel1;
  if (lowerRole.includes("level 2")) return styles.roleLevel2;
  if (lowerRole.includes("level 3")) return styles.roleLevel3;
  return styles.roleDefault;
};

const formatDate = (isoString: string) => {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return isoString;
  }
};

export const ViewCommentsModal: React.FC<ViewCommentsModalProps> = ({
  isOpen,
  onClose,
  comments,
  title = "View Comments",
  isLoading = false,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle Entry / Exit states
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  // Handle Keyboard interactions (Escape key + Focus trap)
  useEffect(() => {
    if (!isOpen || isClosing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
        return;
      }

      // Basic focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) as NodeListOf<HTMLElement>;

        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            /* shift + tab */
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            /* tab */
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Auto focus modal wrapper for accessibility
    modalRef.current?.focus();

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isClosing]);

  const handleClose = () => {
    setIsClosing(true);
    // Match the CSS animation duration (0.3s)
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close icon closes the popup. Do not close on backdrop click.
    e.stopPropagation();
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`${styles.backdrop} ${isClosing ? styles.closing : ""}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`${styles.modal} ${isClosing ? styles.closing : ""}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        ref={modalRef}
      >
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <FileText size={20} />
            <span id="modal-title">{title}</span>
          </div>
          <button
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          {isLoading ? (
            <>
              {[1, 2, 3].map((n) => (
                <div key={n} className={styles.skeletonCard}>
                  <div className={`${styles.shimmer} ${styles.skBadge}`} />
                  <div className={`${styles.shimmer} ${styles.skLabel}`} />
                  <div className={`${styles.shimmer} ${styles.skText}`} />
                  <div className={`${styles.shimmer} ${styles.skTextShort}`} />
                  <div className={styles.skMeta}>
                    <div className={`${styles.shimmer} ${styles.skName}`} />
                    <div className={`${styles.shimmer} ${styles.skDept}`} />
                  </div>
                </div>
              ))}
            </>
          ) : comments.length === 0 ? (
            <div className={styles.emptyState}>
              <Inbox size={48} strokeWidth={1.5} />
              <p>No comments available</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className={`${styles.commentCard} ${parseRoleColor(
                  comment.BGVCode,
                )}`}
              >
                {/* <div className={styles.cardHeader}> */}
                {/* <span className={styles.badge}>
                    Submitted by {comment.submittedBy} ({comment.role})
                  </span> */}
                {/* <span className={styles.date}>
                    <Clock size={12} /> {formatDate(comment.date)}
                  </span>
                </div> */}
                <div className={styles.content}>
                  <div className={styles.label}>{comment.BGVType}</div>
                  <div className={styles.text}>{comment.Remarks}</div>
                </div>
                {/* <div className={styles.meta}>
                  <span className={styles.candidateInfo}>
                    {comment.candidateName} • {comment.jobTitle}
                  </span>
                  <span className={styles.departmentBadge}>
                    {comment.department}
                  </span>
                </div> */}
              </div>
            ))
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.closeOutlinedBtn} onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
