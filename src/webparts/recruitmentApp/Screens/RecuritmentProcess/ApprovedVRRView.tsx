import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TabsComponent from "../../components/TabsComponent ";
import "../../App.css";
import { getVRRDetails } from "../../Services/ServiceExport";
import { StatusId } from "../../utilities/Config";
import CustomLoader from "../../Services/Loader/CustomLoader";
import TitleHeader from "../../components/TitleHeader";
import Labelheader from "../../components/LabelHeader";
import LabelValue from "../../components/LabelValue";

const ApprovedVRRView: React.FC = () => {
  const [tabVisibility, setTabVisibility] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
  });

  const [BusinessUnitCode, setBusinessUnitCode] = useState<string>("");
  const [BusinessUnitName, setBusinessUnitName] = useState<string>("");
  const [BusinessUnitDescription, setBusinessUnitDescription] = useState<string>("");
  const [Department, setDepartment] = useState<string>("");
  const [SubDepartment, setSubDepartment] = useState<string>("");
  const [Section, setSection] = useState<string>("");
  const [DepartmentCode, setDepartmentCode] = useState<string>("");
  const [Nationality, setNationality] = useState<string>("");
  const [JobNameInEnglish, setJobNameInEnglish] = useState<string>("");
  const [JobNameInFrench, setJobNameInFrench] = useState<string>("");
  const [PatersonGrade, setPatersonGrade] = useState<string>("");
  const [DRCGrade, setDRCGrade] = useState<string>("");
  const [EmployementCategory, setEmployementCategory] = useState<string>("");
  const [ContractType, setContractType] = useState<string>("");
  const [JobCode, setJobCode] = useState<string>("");
  const [AreaOfWork, setAreaOfWork] = useState<string>("");
  // const [PositionName, setPositionName] = useState<string>("");
  //const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filterConditions = [
        {
          FilterKey: "StatusId",
          Operator: "eq",
          FilterValue: StatusId.InitiatedforRecruitmentProcess,
        },
      ];
      const Conditions = "";
      const response = await getVRRDetails.GetVacancyDetails(filterConditions, Conditions);
      if (response.status === 200 && response.data !== null) {
        console.log("Fetched Data:", response.data);
        //setPositionName("test"); // Example assignment, adjust as needed
        setBusinessUnitCode("test");
        setBusinessUnitName("test");
        setBusinessUnitDescription("test");
        setDepartment("test");
        setSubDepartment("test");
        setSection("test");
        setDepartmentCode("test");
        setNationality("test");
        setJobNameInEnglish("test");
        setJobNameInFrench("test");
        setPatersonGrade("test");
        setDRCGrade("test");
        setEmployementCategory("test");
        setContractType("test");
        setJobCode("test");
        setAreaOfWork("test");
        // setData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch Vacancy Details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setTabVisibility({
        tab1: true, // Activate the first tab initially
        tab2: false,
        tab3: false,
      });

      try {
        await fetchData(); // Await the asynchronous fetchData
      } catch (error) {
        console.error("Error fetching data:", error); // Handle errors
      }
    };

    void initialize(); // Mark the call as intentionally unawaited
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
            {tabVisibility.tab1 && (
              <div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg6">
                    <TitleHeader value="Position Details" />
                  </div>
                </div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <Labelheader value="Business Unit Code" />
                    <LabelValue value={BusinessUnitCode} />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <Labelheader value="Business Unit Name" />
                    <LabelValue value={BusinessUnitName} />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <Labelheader value="Business Unit Description" />
                    <LabelValue value={BusinessUnitDescription} />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <Labelheader value="Department" />
                    <LabelValue value={Department} />
                  </div>

                </div>

                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <Labelheader value="Sub-Department" />
                    <LabelValue value={SubDepartment} />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <Labelheader value="Section" />
                    <LabelValue value={Section} />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <Labelheader value="Department Code" />
                    <LabelValue value={DepartmentCode} />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <Labelheader value="Nationality" />
                    <LabelValue value={Nationality} />
                  </div>
                </div>
                
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <Labelheader value="Position Name (English)" />
                    <LabelValue value={JobNameInEnglish} />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <Labelheader value="Position Name (French)" />
                    <LabelValue value={JobNameInFrench} />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <Labelheader value="Proposed Paterson Grade" />
                    <LabelValue value={PatersonGrade} />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <Labelheader value="Proposed DRC Grade" />
                    <LabelValue value={DRCGrade} />
                  </div>
                </div>
                
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <Labelheader value="Employment Category" />
                    <LabelValue value={EmployementCategory} />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <Labelheader value="Type of Contract" />
                    <LabelValue value={ContractType} />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <Labelheader value="Job Code" />
                    <LabelValue value={JobCode} />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <Labelheader value="Area of Work" />
                    <LabelValue value={AreaOfWork} />
                  </div>
                </div>
               
              </div>
            )}
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <CustomLoader isLoading={isLoading}>
      <Card variant="outlined" sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3" }}>
        <TabsComponent tabs={tabs} initialTab="tab1" />
      </Card>
    </CustomLoader>
  );
};

export default ApprovedVRRView;
