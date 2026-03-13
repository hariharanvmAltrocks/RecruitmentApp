import React, { useMemo } from 'react';
import { Bell, ChevronRight, Menu, LogOut } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import './Header.scss';
import { findBreadcrumbPath } from '../menuUtils';
import { useTheme } from '../../../theme/ThemeContext';

interface HeaderProps {
  user: any;
  menuData: any[];
  onToggleSidebar: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, menuData, onToggleSidebar, onLogout }) => {
  const { pathname } = useLocation();
  const theme = useTheme();

  const breadcrumbs = useMemo(() => findBreadcrumbPath(menuData, pathname), [menuData, pathname]);

  return (
    <header className="header" style={{ background: theme.headerColor }}>
      <div className="header-container">

        <div className="header-left">
          <button onClick={onToggleSidebar} className="menu-btn">
            <Menu size={22} />
          </button>

          <div className="breadcrumb-section">
            <h1 className="page-title">
              {breadcrumbs[breadcrumbs.length - 1]?.DisplayName || "Recruitment Process"}
            </h1>

            <nav className="breadcrumbs">
              <Link to="/">Home</Link>

              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.Id}>
                  <ChevronRight size={10} strokeWidth={3} className="crumb-icon" />
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
          <button className="notification-btn">
            <Bell size={20} />
            <span className="notification-dot" />
          </button>

          <div className="divider" />

          <div className="user-profile">
            <div className="user-info">
              <p className="user-name">{user || "Jackson"}</p>
              <p className="user-role">{user?.role || "HOD - Mining"}</p>
            </div>

            <div className="avatar-wrapper">
              <div className="avatar">
                {user?.name?.charAt(0) || "J"}
              </div>

              <button onClick={onLogout} className="logout-btn">
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
