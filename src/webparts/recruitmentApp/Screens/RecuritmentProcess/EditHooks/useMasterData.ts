import { useState, useEffect } from 'react';
import { CommonServices } from '../../../Services/ServiceExport';
import { ListNames } from '../../../utilities/Config';

interface IOption {
    key: string | number;
    text: string;
}

interface IMasterOptions {
    qualification: IOption[];
    roleSpecificKnowledge: IOption[];
    technicalSkills: IOption[];
    levelOfProficiency: IOption[];
    experience: IOption[];
    jobFunctionType: IOption[];
}

export const useMasterData = () => {
    const [options, setOptions] = useState<IMasterOptions>({
        qualification: [],
        roleSpecificKnowledge: [],
        technicalSkills: [],
        levelOfProficiency: [],
        experience: [],
        jobFunctionType: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllMasterData = async () => {
            try {
                const [qual, role, skills, proficiency, exp, funcType] = await Promise.all([
                    CommonServices.GetMasterData(ListNames.HRMSQualification),
                    CommonServices.GetMasterData(ListNames.HRMSRoleSpecificKnowlegeMaster),
                    CommonServices.GetMasterData(ListNames.HRMSTechnicalSkills),
                    CommonServices.GetMasterData(ListNames.HRMSLevelOfProficiency),
                    CommonServices.GetMasterData(ListNames.HRMSExperienceMaster),
                    CommonServices.GetMasterData(ListNames.HRMSJobTitleFunctionType),
                ]);

                setOptions({
                    qualification: qual.data.map((i: any) => ({ key: i.QualificationCode, text: i.Qualification })),
                    roleSpecificKnowledge: role.data.map((i: any) => ({ key: i.Code, text: i.RoleSpecificKnowledge })),
                    technicalSkills: skills.data.map((i: any) => ({ key: i.Code, text: i.TechnicalSkills })),
                    levelOfProficiency: proficiency.data.map((i: any) => ({ key: i.Code, text: i.Levels })),
                    experience: exp.data.map((i: any) => ({ key: i.Id, text: i.ExperienceInYearRange })),
                    jobFunctionType: funcType.data.map((i: any) => ({ key: i.Id, text: i.FunctionType })),
                });
            } catch (error) {
                console.error("Failed to fetch master data", error);
            } finally {
                setIsLoading(false);
            }
        };

       void fetchAllMasterData();
    }, []);

    return { ...options, isLoading };
};