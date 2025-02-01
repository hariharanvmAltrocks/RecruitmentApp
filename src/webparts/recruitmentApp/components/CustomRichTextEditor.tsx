import { ILabelStyles, Label } from "@fluentui/react";
import * as React from "react";
// import "react-quill/dist/quill.snow.css";  // Import the Quill CSS
import "../App.css";
import { Editor, EditorTextChangeEvent } from "primereact/editor"; // Import the event type

interface FormFields {
  label?: string;
  value: string;
  error?: boolean;
  onChange?: (value: string) => void;
  mandatory?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  placeholder?: string;
}

const labelStyles: ILabelStyles = {
  root: { marginTop: 10, overflowWrap: "inherit" },
};

function RichTextEditor({
  label,
  value,
  error,
  onChange,
  mandatory = false,
  disabled = false,
  style = {},
  placeholder = "Enter text here..."
}: FormFields) {

  // Handler for the text change event
  const handleTextChange = (e: EditorTextChangeEvent) => {
    if (onChange) {
      onChange(e.htmlValue || "");  // Pass the htmlValue to onChange
    }
  };

  const renderHeader = () => {
    return (
      <span className="ql-toolbar">
        <div id="toolbar">
          {/* Text size */}
          <select className="ql-size">
            <option value="small"></option>
            <option selected></option>
            <option value="large"></option>
            <option value="huge"></option>
          </select>

          {/* Text formatting */}
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>

          {/* Script options */}
          {/* <button className="ql-script" value="sub"></button>
          <button className="ql-script" value="super"></button> */}

          {/* List options */}
          <button className="ql-list" value="ordered"></button>
          <button className="ql-list" value="bullet"></button>

          {/* Font color */}
          <select className="ql-color"></select>
          <select className="ql-background"></select>

          {/* Text alignment */}
          <select className="ql-align">
            <option selected></option> {/* Default alignment (left) */}
            <option value="center"></option>
            <option value="right"></option>
            <option value="justify"></option>
          </select>

        </div>
      </span>
    );
  };

  const header = renderHeader();
  return (
    <>
      <Label styles={label ? labelStyles : undefined}>
        {label}
        {mandatory && <span style={{ color: "red" }}> *</span>}
      </Label>
      <div>
        <Editor
          value={value}
          onTextChange={handleTextChange}  // Use the handleTextChange
          style={{ height: "200px" }}
          placeholder={placeholder}
          readOnly={disabled}
          headerTemplate={header}
        />
      </div>
      {error && (
        <p style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}>
          Field Is Required
        </p>
      )}
    </>
  );
}

export default RichTextEditor;
