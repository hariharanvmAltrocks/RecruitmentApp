import * as React from "react";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

interface CheckboxProps {
    label?: string;
    onChange?: (checked: boolean) => void;
    error?: boolean;
    // mandatory?: boolean;
    checked: boolean;
}



export default class SignatureCheckbox extends React.Component<CheckboxProps> {
    render() {
        const { label, onChange, error, checked } = this.props;

        return (
            <>

                <FormControlLabel
                    control={<Checkbox checked={checked} onChange={(e) => onChange?.(e.target.checked)} />}
                    label={label}
                />
                {error && (
                    <p style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}>
                        Field Is Required
                    </p>
                )}
            </>
        );
    }
}