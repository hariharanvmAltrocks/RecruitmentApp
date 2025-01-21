import * as React from "react";
import { useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TabsComponent from "../../components/TabsComponent ";
import "../../App.css";


const Emptypage: React.FC = (props: any) => {

    useEffect(() => {

    }, []);



    const tabs = [
        {
            label: "My Submission",
            value: "tab1",
            content: (
                <Card
                    variant="outlined"
                    sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
                >
                    <CardContent>
                        <div>
                            <div className="menu-card">
                                <div style={{ minHeight: "50vh", alignItems: "center", justifyContent: "center", display: "flex" }}>
                                    <h3 className="title" >
                                        {"You are not assigned to the Recuritment App"}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ),
        },
    ];


    return (
        <div className="menu-card">
            <TabsComponent tabs={tabs}
                initialTab="tab1"
            />
        </div>
    );
};

export default Emptypage;
