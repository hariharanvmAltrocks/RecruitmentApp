import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Download, FileText, Paperclip, X } from "lucide-react";
import "../RecruitmentTable.scss";
import { AttachmentDetails } from "../AdvertReviewDrawer/Hooks/getAttachmentDetails";
import { truncateText } from "../../../Hooks/reusehooks";

export interface RequiredAttachmentsProps {
  attachments: AttachmentDetails[];
  isLoading: boolean;
}

interface ViewerFile {
  url: string;
  title: string;
  label: string;
  lang: string;
}

const SkeletonBlock: React.FC<{ width?: string; height?: string }> = ({ width = "100%", height = "14px" }) => (
  <div className="advert-review-drawer__skeleton" style={{ width, height }} />
);

const isSharePointUrl = (url: string) => /\.sharepoint\.com\//i.test(url);

const isPdfUrl = (url: string) => {
  const clean = url.split("?")[0].toLowerCase();
  return clean.endsWith(".pdf");
};

const buildWopiUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}/_layouts/15/WopiFrame.aspx?sourcedoc=${encodeURIComponent(url)}&action=embedview`;
  } catch {
    return url;
  }
};

const buildOfficeViewerUrl = (url: string) => `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;

const getViewerUrl = (url: string) => {
  if (isSharePointUrl(url)) {
    return buildWopiUrl(url);
  }
  if (isPdfUrl(url)) {
    return url;
  }
  return buildOfficeViewerUrl(url);
};

const getVersionUrl = (version: { fileUrl?: string; content?: string }) => version.fileUrl || version.content || "";

export const RequiredAttachments: React.FC<RequiredAttachmentsProps> = ({ attachments, isLoading }) => {
  const [viewerFile, setViewerFile] = useState<ViewerFile | null>(null);
  const [viewerLoading, setViewerLoading] = useState(false);

  const openViewer = useCallback((file: ViewerFile) => {
    setViewerFile(file);
    setViewerLoading(true);
  }, []);

  const closeViewer = useCallback(() => {
    setViewerFile(null);
    setViewerLoading(false);
  }, []);

  useEffect(() => {
    if (!viewerFile) {
      return;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeViewer();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [viewerFile, closeViewer]);

  const attachmentCards = useMemo(
    () =>
      attachments.map((doc, index) => (
        <div key={`${doc.title}-${index}`} className="advert-review-drawer__attachment-card">
          <div className="advert-review-drawer__attachment-header">
            <div className={`advert-review-drawer__attachment-type advert-review-drawer__attachment-type--${doc.type.toLowerCase()}`}>
              <FileText size={14} />
              <span>{doc.type}</span>
            </div>
            <div className="advert-review-drawer__attachment-meta">
              <div className="advert-review-drawer__attachment-title" title={doc.title}>{doc.title}</div>
              <div className="advert-review-drawer__attachment-tag">Recruitment</div>
            </div>
          </div>

          <div className="advert-review-drawer__attachment-body">
            {doc.versions.map((version, idx) => {
              const fileUrl = getVersionUrl(version as { fileUrl?: string; content?: string });

              return (
                <div key={`${version.lang}-${idx}`}
                  className="advert-review-drawer__attachment-version"
                  onClick={() => fileUrl && openViewer({
                    url: fileUrl,
                    title: doc.title,
                    label: version.label,
                    lang: version.lang,
                  })}
                  onKeyDown={(event) => {
                    if (!fileUrl) {
                      return;
                    }
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openViewer({
                        url: fileUrl,
                        title: doc.title,
                        label: version.label,
                        lang: version.lang,
                      });
                    }
                  }}
                >
                  <div className={`advert-review-drawer__attachment-lang advert-review-drawer__attachment-lang--${version.lang.toLowerCase()}`}>
                    {version.lang}
                  </div>
                  <div className="advert-review-drawer__attachment-info">
                    <span
                      className="advert-review-drawer__attachment-label advert-review-drawer__attachment-label--link"
                      // onClick={() => fileUrl && window.open(fileUrl, "_blank")}
                      role="button"
                      aria-disabled={!fileUrl}
                      style={{ cursor: fileUrl ? "pointer" : "not-allowed", opacity: fileUrl ? 1 : 0.5 }}
                    >
                      {truncateText(version.label, 20)}
                    </span>
                  </div>
                  <Download size={12} />
                </div>
              );
            })}
          </div>
        </div>
      )),
    [attachments, openViewer]
  );

  return (
    <>
      <section className="advert-review-drawer__section">
        <div className="advert-review-drawer__section-header advert-review-drawer__section-header--plain">
          <h3>
            <Paperclip size={12} />
            Required Attachments
          </h3>
        </div>
        {isLoading ? (
          <div className="advert-review-drawer__attachments">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={`attachment-skeleton-${idx}`} className="advert-review-drawer__attachment-card">
                <div className="advert-review-drawer__attachment-header">
                  <SkeletonBlock width="60%" />
                </div>
                <div className="advert-review-drawer__attachment-body">
                  <SkeletonBlock width="80%" />
                  <SkeletonBlock width="65%" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="advert-review-drawer__attachments">{attachmentCards}</div>
        )}
      </section>

      {viewerFile && (
        <div className="attachment-viewer" role="presentation">
          <div className="attachment-viewer__backdrop" onClick={closeViewer} />
          <div className="attachment-viewer__panel" role="dialog" aria-modal="true" aria-label={viewerFile.title}>
            <div className="attachment-viewer__header">
              <div className="attachment-viewer__meta">
                <div className="attachment-viewer__title">{viewerFile.title}</div>
                <div className="attachment-viewer__subtitle">{viewerFile.label} � {viewerFile.lang}</div>
              </div>
              <div className="attachment-viewer__actions">
                <a
                  className="attachment-viewer__button"
                  href={viewerFile.url}
                  download
                >
                  <Download size={14} />
                  Download
                </a>
                <button type="button" className="attachment-viewer__button attachment-viewer__button--ghost" onClick={closeViewer}>
                  <X size={14} />
                  Close
                </button>
              </div>
            </div>
            <div className="attachment-viewer__body">
              {viewerLoading && (
                <div className="attachment-viewer__loading">
                  <div className="attachment-viewer__spinner" />
                  <span>Loading document...</span>
                </div>
              )}
              <iframe
                className="attachment-viewer__iframe"
                src={getViewerUrl(viewerFile.url)}
                title={viewerFile.title}
                onLoad={() => setViewerLoading(false)}
                allow="fullscreen"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
