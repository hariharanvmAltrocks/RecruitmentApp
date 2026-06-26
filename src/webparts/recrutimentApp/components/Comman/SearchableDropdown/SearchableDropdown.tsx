import { ChevronDown, Search, Check, Plus } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

export interface AutoCompleteState {
  key: string | number;
  text: string;
}

interface SearchableDropdownProps {
  options: { id: number | string; value: string; displayText: string }[];
  value: AutoCompleteState | null;
  onChange: (val: AutoCompleteState | null) => void;
  placeholder: string;
  error?: boolean;
  onAddCustom?: () => void;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  error,
  onAddCustom,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((opt) =>
    (opt.displayText || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    } else {
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSelect = (opt: { id: number | string; value: string; displayText: string }) => {
    onChange({ key: opt.id, text: opt.displayText });
    setIsOpen(false);
  };

  const truncateDropdownOption = (text: string, maxLength: number = 45): string => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

  return (
    <div className={`searchableDropdown ${error ? "error" : ""} ${isOpen ? "open" : ""}`} ref={dropdownRef}>
      <button
        type="button"
        className="dropdownTrigger"
        onClick={() => setIsOpen(!isOpen)}
        title={value ? value.text : ""}
      >
        <span className={`triggerText ${!value ? "placeholder" : ""}`}>
          {value ? truncateDropdownOption(value.text, 45) : placeholder}
        </span>
        <ChevronDown size={16} className="chevronIcon" />
      </button>

      {isOpen && (
        <div className="dropdownMenu">
          <div className="searchWrapper">
            <Search size={14} className="searchIcon" />
            <input
              ref={searchInputRef}
              type="text"
              className="searchInput"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            {searchTerm && (
              <button
                type="button"
                className="clearSearchBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchTerm("");
                }}
              >
                &times;
              </button>
            )}
          </div>

          <div className="optionsList">
            {filteredOptions.length === 0 ? (
              <div className="noOptions">No options found</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = value ? opt.id === value.key : false;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`optionItem ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelect(opt)}
                    title={opt.displayText}
                  >
                    <span className="optionText">{opt.displayText}</span>
                    {isSelected && <Check size={14} className="checkIcon" />}
                  </button>
                );
              })
            )}
            {onAddCustom && (
              <button
                type="button"
                className="addCustomOptionBtn"
                onClick={() => {
                  setIsOpen(false);
                  onAddCustom();
                }}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "#eff6ff",
                  border: "none",
                  borderTop: "1px solid #e2e8f0",
                  color: "#2563eb",
                  fontWeight: 600,
                  fontSize: "13px",
                  textAlign: "center",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  position: "sticky",
                  bottom: 0,
                }}
              >
                <Plus size={14} /> Add Custom
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};