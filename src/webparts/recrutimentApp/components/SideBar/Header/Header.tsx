// import React, { useMemo } from 'react';
// import { Bell, ChevronRight, Menu, LogOut } from 'lucide-react';
// import { useLocation, Link } from 'react-router-dom';
// import './Header.scss';
// import { findBreadcrumbPath } from '../menuUtils';

// interface HeaderProps {
//   user: any;
//   menuData: any[];
//   onToggleSidebar: () => void;
//   onLogout: () => void;
// }

// const Header: React.FC<HeaderProps> = ({ user, menuData, onToggleSidebar, onLogout }) => {
//   const { pathname } = useLocation();

//   const breadcrumbs = useMemo(() => findBreadcrumbPath(menuData, pathname), [menuData, pathname]);

//   return (
//     <header className="header">
//       <div className="header-container">

//         <div className="header-left">
//           <button onClick={onToggleSidebar} className="menu-btn">
//             <Menu size={22} />
//           </button>

//           <div className="breadcrumb-section">
//             <h1 className="page-title">
//               {breadcrumbs[breadcrumbs.length - 1]?.DisplayName || "Recruitment Process"}
//             </h1>

//             <nav className="breadcrumbs">
//               <Link to="/">Home</Link>

//               {breadcrumbs.map((crumb, idx) => (
//                 <React.Fragment key={crumb.Id}>
//                   <ChevronRight size={10} strokeWidth={3} className="crumb-icon" />
//                   <Link
//                     to={crumb.Path}
//                     className={idx === breadcrumbs.length - 1 ? "active" : ""}
//                   >
//                     {crumb.DisplayName}
//                   </Link>
//                 </React.Fragment>
//               ))}
//             </nav>
//           </div>
//         </div>

//         <div className="header-right">
//           <button className="notification-btn">
//             <Bell size={20} />
//             <span className="notification-dot"></span>
//           </button>

//           <div className="divider"></div>

//           <div className="user-profile">
//             <div className="user-info">
//               <p className="user-name">{user || "Jackson"}</p>
//               <p className="user-role">{user?.role || "HOD - Mining"}</p>
//             </div>

//             <div className="avatar-wrapper">
//               <div className="avatar">
//                 {user?.name?.charAt(0) || "J"}
//               </div>

//               <button onClick={onLogout} className="logout-btn">
//                 <LogOut size={14} /> Logout
//               </button>
//             </div>
//           </div>
//         </div>

//       </div>
//     </header>
//   );
// };

// export default Header;
//============
import React, { useMemo } from 'react';
import { Bell, ChevronRight, Menu, LogOut } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import './Header.scss';
import { findBreadcrumbPath } from '../menuUtils';

interface HeaderProps {
  user: any;
  menuData: any[];
  onToggleSidebar: () => void;
  onLogout: () => void;
  isFormOpen?: boolean; 
}

const Header: React.FC<HeaderProps> = ({ user, menuData, onToggleSidebar, onLogout, isFormOpen }) => {
  const { pathname } = useLocation();
  const breadcrumbs = useMemo(() => findBreadcrumbPath(menuData, pathname), [menuData, pathname]);
  const handleCloseForm = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new Event("close-evaluation-form"));
  };

  return (
    <header className="header">
      <div className="header-container">

        <div className="header-left">
          <button onClick={onToggleSidebar} className="menu-btn">
            <Menu size={22} />
          </button>

          <div className="breadcrumb-section">
            <h1 className="page-title">
              {breadcrumbs[breadcrumbs.length - 1]?.DisplayName || "Selection Process"}
            </h1>

            {isFormOpen ? (
              <nav className="breadcrumbs">
                <Link to="/">HOME</Link>
                <ChevronRight size={10} strokeWidth={3} className="crumb-icon" />
                
                <Link to="/Dashboard">DASHBOARD</Link>
                <ChevronRight size={10} strokeWidth={3} className="crumb-icon" />
              
                <Link to="#" onClick={handleCloseForm}>
                  CANDIDATE EVALUATIONS
                </Link>
                <ChevronRight size={10} strokeWidth={3} className="crumb-icon" />
                
                <span className="active" style={{ fontWeight: 800, fontSize: "11px" }}>
                  EVALUATION FORM
                </span>
              </nav>
            ) : (
              <nav className="breadcrumbs">
                <Link to="/">HOME</Link>
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
            )}
            
          </div>
        </div>

        <div className="header-right">
          <button className="notification-btn">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>

          <div className="divider"></div>

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