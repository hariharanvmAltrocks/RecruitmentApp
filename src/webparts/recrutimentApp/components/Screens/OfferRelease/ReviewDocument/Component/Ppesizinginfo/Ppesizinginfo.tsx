// components/PPESizingInfo/PPESizingInfo.tsx
import React, { useEffect, useRef, useState } from "react";
import "./Ppesizinginfo.scss"
import * as strings from 'RecrutimentAppWebPartStrings';


export interface PPEItem {
  kit: string;  
  size: string;  
}


const ShieldIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const InfoIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" stroke="#E24B4A" strokeWidth="1.2" />
    <text x="8" y="12" textAnchor="middle" fontSize="10" fontWeight="600" fill="#E24B4A">
      i
    </text>
  </svg>
);


interface PPETriggerProps {
  items: PPEItem[];
}

export const PPESizingTrigger: React.FC<PPETriggerProps> = ({ items }) => {
  const [open, setOpen] = useState(false);
  const wrapRef         = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="ppe-trigger-wrap" ref={wrapRef}>
      <button
        type="button"
        className="ppe-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <InfoIcon />
        {strings.PersonalProtectiveEquipmentSizingInforma}</button>

      {open && (
        <div className="ppe-popover" role="dialog" aria-label={strings.PpeSizingDetails}>
          {/* Header */}
          <div className="ppe-popover__header">
            <span className="ppe-popover__header-icon">
              <ShieldIcon />
            </span>
            <span className="ppe-popover__title">{strings.PersonalProtectiveEquipment}</span>
            <button
              type="button"
              className="ppe-popover__close"
              onClick={() => setOpen(false)}
              aria-label={strings.Close}
            >
              ×
            </button>
          </div>

          {/* Table */}
          <table className="ppe-table">
            <thead>
              <tr>
                <th>{strings.PpeKit}</th>
                <th>{strings.Size}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.kit}>
                  <td>{item.kit}</td>
                  <td>
                    <span className="ppe-size-badge">{item.size}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


interface PPECardProps {
  items: PPEItem[];
}

export const PPESizingCard: React.FC<PPECardProps> = ({ items }) => (
  <div className="ppe-card">
    <div className="ppe-card__header">
      <ShieldIcon className="ppe-card__header-icon" />
      <span className="ppe-card__header-text">Personal Protective Equipment</span>
    </div>

    <div className="ppe-card__body">
      {items.map((item) => (
        <div key={item.kit} className="ppe-card__row">
          <div className="ppe-card__row-left">
            <span className="ppe-card__dot" />
            <span className="ppe-card__item-name">{item.kit}</span>
          </div>
          <span className="ppe-card__size-chip">{item.size}</span>
        </div>
      ))}
    </div>
  </div>
);


interface PPETagStripProps {
  items: PPEItem[];
}

export const PPESizingTagStrip: React.FC<PPETagStripProps> = ({ items }) => (
  <div className="ppe-strip">
    <ShieldIcon className="ppe-strip__icon" />
    <span className="ppe-strip__label">{strings.PpeSizes}</span>

    {items.map((item) => (
      <div key={item.kit} className="ppe-strip__tag">
        <span className="ppe-strip__tag-name">{item.kit}</span>
        <span className="ppe-strip__tag-sep">·</span>
        <span className="ppe-strip__tag-size">{item.size}</span>
      </div>
    ))}
  </div>
);

export type { PPETriggerProps, PPECardProps, PPETagStripProps };