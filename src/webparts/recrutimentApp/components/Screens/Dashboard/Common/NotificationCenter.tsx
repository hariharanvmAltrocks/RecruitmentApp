import React, { useState, useRef, useEffect } from "react";
import { useNotifications } from "../Hooks/useNotifications";
import * as Lucide from "lucide-react";
import styles from "./Common.module.scss";

export const NotificationCenter: React.FC = () => {
  const { data: notifications, refresh } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const count = notifications ? notifications.length : 0;

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <div className={styles.notificationBadge} onClick={() => setIsOpen(!isOpen)}>
        <Lucide.Bell size={18} />
        {count > 0 && <span className={styles.badgeCount}>{count}</span>}
      </div>

      {isOpen && (
        <div className={styles.notificationDropdown}>
          <div className={styles.dropdownHeader}>
            <h3>Notifications</h3>
            {count > 0 && (
              <button 
                className={styles.clearAllBtn}
                onClick={() => {
                  // Simply refresh or clear
                  void refresh();
                }}
              >
                Clear
              </button>
            )}
          </div>
          <div className={styles.notificationList}>
            {count === 0 ? (
              <div style={{ padding: "16px", textAlign: "center", fontSize: "0.75rem", color: "#64748b" }}>
                No new notifications
              </div>
            ) : (
              notifications?.map((item) => {
                let iconColor = styles.notifIconBlue;
                let Icon = Lucide.Info;

                if (item.type === "error") {
                  iconColor = styles.notifIconRed;
                  Icon = Lucide.AlertCircle;
                } else if (item.type === "warning") {
                  iconColor = styles.notifIconYellow;
                  Icon = Lucide.AlertTriangle;
                } else if (item.type === "success") {
                  iconColor = styles.notifIconGreen;
                  Icon = Lucide.CheckCircle;
                }

                return (
                  <div key={item.id} className={styles.notificationItem}>
                    <div className={`${styles.notifIcon} ${iconColor}`}>
                      <Icon size={12} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span className={styles.notifText}>{item.text}</span>
                      <span className={styles.notifTime}>{item.timestamp}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default NotificationCenter;
