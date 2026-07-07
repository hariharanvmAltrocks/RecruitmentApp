import { StatusId } from "../../../utilities/Config";

export const currentDate = new Date();
export const currentYear = currentDate.getFullYear();
export const currentMonthIndex = currentDate.getMonth(); // 0-11
export const monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const currentMonthAbbr = monthsArray[currentMonthIndex];
export const currentMonthLong = currentDate.toLocaleString("default", { month: "long" }).toLowerCase();

export const isCurrentMonthAndYear = (itemMonth: any, itemYear: any) => {
    if (!itemMonth) return false;
    const y = Number(itemYear) || currentYear;
    if (y !== currentYear) return false;
    const m = String(itemMonth).toLowerCase();
    return m.startsWith(currentMonthAbbr.toLowerCase()) || m === currentMonthLong;
};

export const isCurrentMonthAndYear2 = (dateValue: any): boolean => {
    if (!dateValue) return false;

    const date = new Date(dateValue);

    // Invalid date
    if (isNaN(date.getTime())) return false;

    return (
        date.getFullYear() === currentYear &&
        date.getMonth() === currentMonthIndex
    );
};

export const getMonthDifference = (d1: Date, d2: Date): number => {
    return (d2.getFullYear() - d1.getFullYear()) * 12 + d2.getMonth() - d1.getMonth();
};


export const getDueMonthRatio = (month: number, recruitmentProcess: any[]) => {
    const matchingItems = recruitmentProcess.filter((item: any) => {
        if (!item.DateRequried) return false;

        const date = new Date(item.DateRequried);
        return !isNaN(date.getTime()) && date.getMonth() === month;
    });

    const total = matchingItems.length;

    const onboarded = matchingItems.filter(
        (item: any) => Number(item.StatusId) === StatusId.Onboarded
    ).length;

    return `${onboarded} / ${total}`;
};

export const isFiveMonthsBeforeCurrent = (dateRequired: string) => {
    if (!dateRequired) return false;

    const requiredDate = new Date(dateRequired);

    requiredDate.setMonth(requiredDate.getMonth() - 5);

    const currentDate = new Date();

    return (
        requiredDate.getMonth() === currentDate.getMonth() &&
        requiredDate.getFullYear() === currentDate.getFullYear()
    );
};

    export  const groupedHR = (rec: any) => {
        return rec.reduce(
        (acc: Record<string, any[]>, item: any) => {
          const email = item.AssignedHR;
          if (!email) return acc;
          if (!acc[email]) acc[email] = [];
          acc[email].push(item);
          return acc;
        },
        {} as Record<string, any[]>
      );
    };

    export  const groupedHRLead = (rec: any) => {
        return rec.reduce(
        (acc: Record<string, any[]>, item: any) => {
          const email = item.RecruitmentHRLead;
          if (!email) return acc;
          if (!acc[email]) acc[email] = [];
          acc[email].push(item);
          return acc;
        },
        {} as Record<string, any[]>
      );
    };

    // const _hrNameCache = new Map<string, string>();
    
    //   const _getHRName = async (email: string) => {
    //     if (!email) return "N/A";
    //     const normalizedEmail = email.toLowerCase().trim();
    //     if (this._hrNameCache.has(normalizedEmail)) {
    //       return this._hrNameCache.get(normalizedEmail)!;
    //     }
    //     try {
    //       const hrRes = await CommonServices.GetUserName(email);
    //       const name = hrRes.data ?? email;
    //       this._hrNameCache.set(normalizedEmail, name);
    //       return name;
    //     } catch (error) {
    //       console.error(`Error resolving HR name for ${email}:`, error);
    //       return email;
    //     }
    //   }