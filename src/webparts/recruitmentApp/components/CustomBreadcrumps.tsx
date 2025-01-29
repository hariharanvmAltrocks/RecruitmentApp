import * as React from "react";
import { Breadcrumbs, Typography } from "@mui/material";

interface SimpleBreadcrumbsProps {
    items: string[];
    separator?: string;
}

const SimpleBreadcrumbs: React.FC<SimpleBreadcrumbsProps> = ({ items, separator = "|" }) => {
    return (
        <Breadcrumbs aria-label="breadcrumb" separator={separator}>
            {items.map((item, index) => (
                <Typography key={index} color="text.primary">
                    {item}
                </Typography>
            ))}
        </Breadcrumbs>
    );
};

export default SimpleBreadcrumbs;
