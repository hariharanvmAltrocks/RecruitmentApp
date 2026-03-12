export function calculateTotalExperienceYears(experiences: any[]) {
    let totalMonths = 0;

    experiences.forEach((exp) => {
        const startDate = new Date(exp.startFrom);

        let endDate;
        if (exp.endTo === "current date" || exp.isCurrent === 1 || !exp.endTo) {
            endDate = new Date(); // today
        } else {
            endDate = new Date(exp.endTo);
        }

        let months =
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth());

        // If end day is before start day, reduce one month
        if (endDate.getDate() < startDate.getDate()) {
            months--;
        }

        totalMonths += months;
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return `${years} years and ${months} months`;
}

export function getcountryCode(Code: any[], refMobile: string) {
    if (!refMobile) return null;
    const [countryCode, mobileNumber] = refMobile.split("-");
    const country = Code.find((item) => item.code === countryCode);
    if (!country) return null;
    return `${country.id}-${mobileNumber}`;
}