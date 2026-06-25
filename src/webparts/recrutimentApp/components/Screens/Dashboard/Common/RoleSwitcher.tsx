import React from "react";
import * as Lucide from "lucide-react";
import styles from "./Common.module.scss";

interface RoleSwitcherProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onRoleChange }) => {
  return (
    <div className={styles.roleSwitcherWrapper}>
      <Lucide.ShieldAlert size={14} style={{ color: "#d97706" }} />
      <label>Dev Role Swapping:</label>
      <select
        className={styles.roleSelect}
        value={currentRole}
        onChange={(e) => onRoleChange(e.target.value)}
      >
        <option value="Admin">Super Admin</option>
        <option value="HRLead">HR Lead</option>
        <option value="HR">HR Recruiter</option>
        <option value="DepartmentManager">Department Manager (HOD)</option>
        <option value="LineManager">Line Manager</option>
        <option value="Candidate">Candidate</option>
      </select>
    </div>
  );
};
export default RoleSwitcher;
