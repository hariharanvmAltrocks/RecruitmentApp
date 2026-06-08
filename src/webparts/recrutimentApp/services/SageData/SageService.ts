import { IUserDetails } from "../../models/master";
import { ListNames } from "../../utilities/Config";
import { getSP } from "../SPService/spservice";

   export async function GetEmployeeDictionary(
  emails: string[],
): Promise<Map<string, IUserDetails>> {
  const employeeMap = new Map<string, IUserDetails>();

  if (!emails.length) {
    return employeeMap;
  }

  try {
     const filter = emails
      .map((email) => `EmailId eq '${email}'`)
      .join(" or ");
    const sp = getSP();

const employees = await sp.web.lists
  .getByTitle(ListNames.HRMSSageList)
  .items
  .select(
    "*,JobTitleInEnglish/JobTitleInEnglish,JobTitleInFrench/JobTitleInFrench,Department/DepartmentName,PatersonGrade/PatersonGrade,DRCGrade/DRCGrade"
  )
  .expand("JobTitleInEnglish,JobTitleInFrench,Department,PatersonGrade,DRCGrade")
  .filter(filter)
  .top(1)();
   

    employees.forEach((item: any) => {
      employeeMap.set(
        item.EmailId?.toLowerCase(),
        {
          ID: item.ID,
          EmailId: item.EmailId,
          DepartmentId: item.DepartmentId,
          CurrentPosition: item.CurrentPosition,
          DepartmentName:
            item.Department?.DepartmentName || "",
          FirstName: item.FirstName || "",
          MiddleName: item.MiddleName || "",
          LastName: item.LastName || "",
          JopTitleEnglish:
            item.JobTitleInEnglish?.JobTitleInEnglish || "",
          JopTitleFrench:
            item.JobTitleInFrench?.JobTitleInFrench || "",
          DRCGrade:
            item.DRCGrade?.DRCGrade || "",
          PatersonGrade:
            item.PatersonGrade?.PatersonGrade || "",
          BusinessAddress:
            item.BusinessAddress || "",
          HomeAddress:
            item.HomeAddress || "",
          ContactNumber:
            item.ContactNumber || "",
          BusinessUnitCode:
            item.BusinessUnitCode || "",
          BusinessUnitID:
            item.BusinessUnitID || 0,
          Nationality:
            item.Nationality || "",
        }
      );
    });

    return employeeMap;
  } catch (error) {
    console.error(
      "Error fetching employee dictionary:",
      error,
    );
    return employeeMap;
  }
}