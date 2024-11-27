import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Label } from "@fluentui/react";

interface ReuseButtonProps {
    label?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    spacing?: number;
    height?: string;
    width?: string;
    Style?: React.CSSProperties;
    backgroundColor?: string;
    imgSrc?: string;
    imgAlt?: string;
    imgAltHover?: string;
    imgSrcHover?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    inputRef?: React.RefObject<HTMLInputElement>;
    error?: boolean;
    buttonHeading?: string;
    mandatory?: boolean;
    paragraphStyle?: React.CSSProperties;
    disabled?: boolean;
}

export default class ReuseButton extends React.Component<ReuseButtonProps> {
    state = {
        isHovered: false,
    };

    public render(): React.ReactElement {
        const {
            label,
            onClick,
            icon,
            spacing,
            height,
            width,
            Style,
            backgroundColor,
            imgSrc,
            imgAlt,
            onChange,
            inputRef,
            imgSrcHover,
            imgAltHover,
            error,
            buttonHeading,
            mandatory = false,
            paragraphStyle,
            disabled = false,
        } = this.props;

        const buttonStyles = {
            height: height || "40px",
            width: width || "40px",
            background: backgroundColor || "white",

            border: "1px solid rgb(205, 45, 45)",
            fontWeight: "500",
            fontSize: "17px",
            fontFamily: "Roboto, sans-serif",
            color: "#EF3340 !important",
            transition: "background 0.3s ease, color 0.3s ease",
            textTransform: "none",
            textDecoration: "none",
            cursor: "pointer",
            minWidth: "75px",
            // maxWidth: "80px",
            ...Style,
            "&:hover": {
                cursor: "pointer",
                background: backgroundColor || "#EF3340",

                color: "white !important",
                textDecoration: "none",
            },
        };

        const iconButtonStyles = {
            height: height || "40px",
            width: width || "40px",
            background: backgroundColor || "#EF3340",

            border: "1px solid rgb(205, 45, 45)",
            fontWeight: "500",
            fontSize: "17px",
            fontFamily: "Roboto, sans-serif",
            color: "#FFFF !important",
            transition: "background 0.3s ease, color 0.3s ease",
            textTransform: "none",
            textDecoration: "none",
            cursor: "pointer",
            // minWidth: "75px",
            minWidth: "80px",
            maxWidth: "80px",
            ...Style,
            "&:hover": {
                background: backgroundColor || "#EF3340",
                textDecoration: "none",
            },
        };

        return (
            <div>
                {buttonHeading && (
                    <>
                        <Label>
                            {buttonHeading}
                            {mandatory && <span style={{ color: "red" }}> *</span>}{" "}
                        </Label>
                    </>
                )}

                <Stack spacing={spacing} direction="row">
                    {icon ? (
                        <Button
                            variant="contained"
                            startIcon={icon}
                            onClick={onClick}
                            sx={iconButtonStyles}
                            style={Style}
                            disabled={disabled}
                        >
                            {label}
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={onClick}
                            sx={buttonStyles}
                            style={Style}
                            disabled={disabled}
                            onMouseEnter={() =>
                                imgSrcHover && this.setState({ isHovered: true })
                            }
                            onMouseLeave={() =>
                                imgSrcHover && this.setState({ isHovered: false })
                            }
                        >
                            {label}

                            {this.state.isHovered ? (
                                <img src={imgSrcHover} alt={imgAltHover} />
                            ) : (
                                <img src={imgSrc} alt={imgAlt} />
                            )}
                            {onChange && (
                                <input
                                    type="file"
                                    ref={inputRef}
                                    style={{ display: "none" }}
                                    onChange={onChange}
                                    multiple={true}
                                />
                            )}
                        </Button>
                    )}
                </Stack>

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
    }
}
