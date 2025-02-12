import { ILabelStyles, Label } from "@fluentui/react";
import * as React from "react";
import "../App.css";
import { Editor } from "primereact/editor";

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

  const customToolbar = (
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

  return (
    <>
      <Label styles={label ? labelStyles : undefined}>
        {label}
        {mandatory && <span style={{ color: "red" }}> *</span>}
      </Label>
      <div>
        <Editor
          value={value}
          onTextChange={(e) => onChange ? onChange(e.htmlValue || "") : undefined}
          style={{ height: "200px" }}
          placeholder={placeholder}
          readOnly={disabled}
          headerTemplate={customToolbar}
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
