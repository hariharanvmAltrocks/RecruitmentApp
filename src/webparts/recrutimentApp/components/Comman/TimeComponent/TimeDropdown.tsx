import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { CheckCircle, ChevronDown, Clock } from "lucide-react";
import styles from "./TimeDropdown.module.scss";

// ─── TimeDropdown ─────────────────────────────────────────────────────────────
interface TimeSlot {
  value: string; // "HH:MM"
  label: string; // "12:00 PM"
}

interface TimeDropdownProps {
  value: string;
  onChange: (val: string) => void;
  slots: TimeSlot[];
  placeholder?: string;
  disabled?: boolean;
}

export const TimeDropdown: React.FC<TimeDropdownProps> = ({
  value,
  onChange,
  slots,
  placeholder = "Select time",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Scroll active item into view when opening
  useEffect(() => {
    if (open && activeRef.current) {
      activeRef.current.scrollIntoView({ block: "center" });
    }
  }, [open]);

  const selectedLabel = slots.find((s) => s.value === value)?.label ?? "";

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  // Split slots into AM / PM groups
  const amSlots = slots.filter((s) => {
    const h = parseInt(s.value.split(":")[0]);
    return h < 12;
  });
  const pmSlots = slots.filter((s) => {
    const h = parseInt(s.value.split(":")[0]);
    return h >= 12;
  });

  return (
    <div className={styles.timeDropdownWrapper} ref={wrapperRef}>
      {/* Trigger */}
      <div
        className={[
          styles.timeDropdownTrigger,
          open ? styles.timeDropdownOpen : "",
          disabled ? styles.timeDropdownDisabled : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => !disabled && setOpen((o) => !o)}
      >
        <span
          className={
            value ? styles.timeDropdownValue : styles.timeDropdownPlaceholder
          }
        >
          {value ? selectedLabel : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={[
            styles.timeDropdownChevron,
            open ? styles.timeDropdownChevronOpen : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </div>

      {/* Menu */}
      {open && !disabled && (
        <div className={styles.timeDropdownMenu}>
          <div className={styles.timeDropdownScroll}>
            {/* AM group */}
            {amSlots.length > 0 &&
              amSlots.map((slot) => {
                const isActive = slot.value === value;
                return (
                  <div
                    key={slot.value}
                    ref={isActive ? activeRef : undefined}
                    className={[
                      styles.timeDropdownOption,
                      isActive ? styles.timeDropdownOptionActive : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => handleSelect(slot.value)}
                  >
                    {slot.label}
                    {isActive && (
                      <CheckCircle
                        size={14}
                        className={styles.timeDropdownOptionCheck}
                      />
                    )}
                  </div>
                );
              })}

            {/* AM/PM divider */}
            {amSlots.length > 0 && pmSlots.length > 0 && (
              <div className={styles.timeDropdownDivider} />
            )}

            {/* PM group */}
            {pmSlots.length > 0 &&
              pmSlots.map((slot) => {
                const isActive = slot.value === value;
                return (
                  <div
                    key={slot.value}
                    ref={isActive ? activeRef : undefined}
                    className={[
                      styles.timeDropdownOption,
                      isActive ? styles.timeDropdownOptionActive : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => handleSelect(slot.value)}
                  >
                    {slot.label}
                    {isActive && (
                      <CheckCircle
                        size={14}
                        className={styles.timeDropdownOptionCheck}
                      />
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
