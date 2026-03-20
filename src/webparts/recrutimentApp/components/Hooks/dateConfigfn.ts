export const SpiltDateOnly = (date: Date) => {
  const updatedDate = date;
  const year = updatedDate?.getFullYear();
  const month = String(updatedDate?.getMonth() + 1).padStart(2, "0");
  const day = String(updatedDate?.getDate()).padStart(2, "0");

  const dateOnly = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  ); //`${year}-${month}-${day}`;
  return dateOnly.toISOString();
};

export const AddCalculateDate = (startDate: Date, daysToAdd: number): Date => {
  let validToDate = new Date(startDate);
  let addedDays = 0;

  while (addedDays < daysToAdd) {
    validToDate.setDate(validToDate.getDate() + 1);

    if (validToDate.getDay() === 0) {
      continue;
    }

    addedDays++;
  }

  if (validToDate.getDay() === 0) {
    validToDate.setDate(validToDate.getDate() + 1);
  }

  return validToDate;
};