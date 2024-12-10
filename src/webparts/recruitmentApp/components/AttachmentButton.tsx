import  { useRef, useState } from "react";
import * as React from "react";
import { Button } from "primereact/button";
import { Icon } from "@fluentui/react/lib/Icon";
import { Label } from "@fluentui/react";

interface AttachmentButtonProps {
  iconName?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  paragraphStyle?: React.CSSProperties;
  backgroundColor?: string;
  label?: string;
  onClick?: () => void;
  error?: boolean;
  buttonHeading?: string;
  mandatory?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  Style?: React.CSSProperties;
  iconNameHover?: string;
  AttachState?: (value: Item[]) => void;
}

interface Item {
  name: string;
  fileContent: ArrayBuffer;
  file?: File | any;
  serverRelativeUrl?: string;
  ID?: string;
}

const AttachmentButton: React.FC<AttachmentButtonProps> = ({
  iconName,
  label,
  error,
  paragraphStyle,
  mandatory,
  Style,
  buttonHeading,
  iconNameHover,
  backgroundColor,
  AttachState,
}: AttachmentButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const onAttachmentIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;

    if (fileInput.files && fileInput.files.length > 0) {
      const files = fileInput.files;
      const newAttachments: Item[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileReader = new FileReader();

        fileReader.onload = (event) => {
          const fileContent = event.target?.result as ArrayBuffer;

          newAttachments.push({
            name: file.name,
            fileContent,
            file,
          });

          if (newAttachments.length === files.length) {
            if (AttachState) {
              AttachState(newAttachments);
            }
            console.log("AttachState", newAttachments);
          }
        };

        fileReader.readAsArrayBuffer(file);
      }
    }
  };

  const buttonStyle = {
    backgroundColor: isHovered ? "#EF3340" : backgroundColor || "white",
    border: "1px solid rgb(205, 45, 45)",
    padding: "6px",
    borderRadius: "5px",
    ...Style,
  };

  const LabelStyle = {
    color: "rgb(205, 45, 45)",
    marginBottom: "0",
    ...Style,
  };

  const IconStyle = {
    marginRight: "8px",
    marginLeft: "6px",
    fontSize: "20px",
    color: "rgb(205, 45, 45)",
  };

  const LabelStyleHover = {
    color: "#FFFF",
  };

  const IconStyleHover = {
    color: "#FFFF",
    backgroundColor: "#EF3340",
    marginRight: "8px",
    marginLeft: "6px",
    fontSize: "20px",
  };

  return (
    <div>
      {buttonHeading && (
        <Label>
          {buttonHeading}
          {mandatory && <span style={{ color: "red" }}> *</span>}
        </Label>
      )}
      <Button
        onClick={onAttachmentIconClick}
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered ? (
          <>
            <Label style={LabelStyleHover}>{label}</Label>
            <Icon iconName={iconNameHover} style={IconStyleHover}></Icon>
          </>
        ) : (
          <>
            <Label style={LabelStyle}>
              {label}
              {/* {mandatory && <span style={{ color: "red" }}> *</span>} */}
            </Label>
            <Icon iconName={iconName} style={IconStyle}></Icon>
          </>
        )}
        <input
          type="file"
          multiple={true}
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept=".pdf, .doc, .docx"
        />
      </Button>
      {error && (
        <p
          style={{
            marginTop: 5,
            color: "red",
            fontSize: 12,
            marginLeft: 0,
            ...paragraphStyle,
          }}
        >
          File Is Required
        </p>
      )}
    </div>
  );
};

export default AttachmentButton;
