import React, { useMemo } from "react";
import { Bell, ChevronRight, Menu, LogOut } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import "./Header.scss";
import { findBreadcrumbPath } from "../menuUtils";
import { useTheme } from "../../../theme/ThemeContext";
import * as strings from "RecrutimentAppWebPartStrings";
import { userInfo } from "../../../utilities/hooks/RoleContext";

interface HeaderProps {
  menuData: any[];
  onToggleSidebar: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  menuData,
  onToggleSidebar,
  onLogout,
}) => {
  const { pathname } = useLocation();
  const theme = useTheme();
  const { ADGroupData } = userInfo();
  console.log(ADGroupData, "ADGroupData");

  const breadcrumbs = useMemo(
    () => findBreadcrumbPath(menuData, pathname),
    [menuData, pathname],
  );

  const user = ADGroupData?.userDetails?.[0];
  const UserName = [user?.FirstName, user?.MiddleName, user?.LastName]
    .filter(Boolean)
    .join(" ");
  return (
    <header className="header" style={{ background: theme.headerColor }}>
      <div className="header-container">
        <div className="header-left">
          <button onClick={onToggleSidebar} className="menu-btn">
            <Menu size={22} />
          </button>

          <div className="breadcrumb-section">
            <h1 className="page-title">{strings.AppTitle}</h1>

            <nav className="breadcrumbs">
              {/* <Link to="/">{strings.HomeLabel}</Link> */}

              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.Id}>
                  <ChevronRight
                    size={10}
                    strokeWidth={3}
                    className="crumb-icon"
                  />
                  <Link
                    to={crumb.Path}
                    className={idx === breadcrumbs.length - 1 ? "active" : ""}
                  >
                    {crumb.DisplayName}
                  </Link>
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>

        <div className="header-right">
          {/* <button className="notification-btn">
            <Bell size={20} />
            <span className="notification-dot" />
          </button> */}

          <div className="divider" />

          <div className="user-profile">
            <div className="user-info">
              <p className="user-name">{UserName}</p>
              <p className="user-role">
                {ADGroupData.userDetails[0]?.DepartmentName}
              </p>
            </div>

            <div className="avatar-wrapper">
              <div className="avatar">
                {ADGroupData.userDetails?.[0]?.LastName?.[0] || "S"}
              </div>

              {/* <button onClick={onLogout} className="logout-btn">
                <LogOut size={14} /> {strings.LogoutLabel}
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
