
import * as React from "react";
import { useState } from "react";
import { Dropdown, IDropdownOption } from "@fluentui/react";
import "./RoleSelection.css";

type Role = {
  ID: number;
  RoleTitle: string;
  ADGroupID: string;
};

type Props = {
  roles: Role[];
  onRoleSelect: (role: Role) => void;
};

const RoleSelection = ({ roles, onRoleSelect }: Props) => {
  const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>();

  const dropdownOptions: IDropdownOption[] = roles.map((role) => ({
    key: role.ID,
    text: role.RoleTitle,
  }));

  const handleGetStarted = () => {
    const selected = roles.find((r) => r.ID === selectedRoleId);
    if (selected) {
      onRoleSelect(selected);
    }
  };

  return (
    <>
    
      <div className="roleHeader">
        <div className="logo">
          <img 
           src={require("../assets/Logo.png")}
           alt="KAMOA Copper Logo" />
        </div>
        <h2>Human Resource Management System</h2>
      </div>

      <div className="RoleContainer">
        <div className="selRoleContainer">
          <div className="role-card">
            <label htmlFor="roleDropdown" className="dropdownLabel">Select Role</label>
            <Dropdown
              id="roleDropdown"
              placeholder="Select a role"
              options={dropdownOptions}
              onChange={(e, option) => setSelectedRoleId(option?.key as number)}
            />
            <button
              className="startBtn"
              onClick={handleGetStarted}
              disabled={!selectedRoleId}
            >
              Get Started
            </button>
          </div>
        </div>

        <div className="imgContainer">
          <div className="imgBorder">
            <img
              src={require("../assets/Main.png")}
              alt="KAMOA Site"
            />
          </div>
        </div>
      </div>

  
      <div className="footer">
        <span>KAMOA Copper S.A | All Rights Reserved</span>
      </div>
    </>
  );
};

export default RoleSelection;
