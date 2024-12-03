import * as React from "react";
import { viewLabelcolor } from "../utilities/Config"; 
import { Label, ILabelStyles } from "@fluentui/react";

interface FieldItems {
  value: string | any;
}

const labelStyles: ILabelStyles = {
  root: { marginTop: 10, overflowWrap: "inherit" },
};

const Labelheader: React.FC<FieldItems> = ({ value }) => {
  return (
    <Label styles={labelStyles} style={{ color: viewLabelcolor.Labelcolor }}>
      {value}
    </Label>
  );
};

export default Labelheader;
