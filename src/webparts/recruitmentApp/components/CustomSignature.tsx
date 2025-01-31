import { Label } from "@fluentui/react";
import * as React from "react";
import * as moment from "moment";


// const labelStyles: React.CSSProperties = {
//   // marginTop: 10,
//   fontSize: 15,
// };

interface userDetailsProps {
    Name?: string;
    Department?: string;
    JobTitleInEnglish?: string;
    JobTitleInFrench?: string;
    Date: string;
    UserRoleName?: string;
    TermsAndCondition?: boolean;
}

export default class CustomSignature extends React.Component<userDetailsProps> {
    public render(): React.ReactElement {
        const { Name, Department, JobTitleInEnglish, JobTitleInFrench, Date, UserRoleName, TermsAndCondition } = this.props;


        const boldLabelStyles: React.CSSProperties = {
            fontWeight: "bold",
            fontSize: "18px",
        };

        const labelStyles: React.CSSProperties = {
            fontSize: "15px",
        };

        return (
            <div style={{ marginLeft: "9px" }}>

                {Name && (
                    <div >
                        <Label style={boldLabelStyles}>{Name}</Label>
                    </div>
                )}

                {JobTitleInEnglish && (
                    <div >
                        <Label className="title" style={labelStyles}>{JobTitleInEnglish}</Label>
                    </div>
                )}

                {JobTitleInFrench && (
                    <div >
                        <Label className="title" style={labelStyles}>{JobTitleInFrench}</Label>
                    </div>
                )}

                {UserRoleName && (
                    <div >
                        <Label style={labelStyles}>{UserRoleName}</Label>
                    </div>
                )}

                {Department && (
                    <div >
                        <Label style={labelStyles}>{Department}</Label>
                    </div>
                )}

                {TermsAndCondition && Date && (
                    // <div style={{ marginTop: "10px" }}>
                    <Label style={labelStyles}>
                        {moment(Date).format("DD-MMM-YYYY - hh:mm A")}
                    </Label>
                    // </div>
                )}
            </div>
        );
    }
}
