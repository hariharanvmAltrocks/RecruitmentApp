import moment from "moment";
import { AttachmentVersion } from "../../models";
import { IDocFiles } from "../../services/SPService/Ispservice";
import { AttachmentDetails } from "../Screens/RecruitmentTable/AdvertReviewDrawer/Hooks/getAttachmentDetails";

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

export function toAttachment(
  title: string,
  docs: IDocFiles[],
  lang: AttachmentVersion["lang"] = "EN",
): AttachmentDetails {
  return {
    title,
    type: "PDF",
    versions: docs.map((d) => ({
      lang: "EN",
      label: d.name,
      content: d.content,
    })),
  };
}

export const ConvertUtc = (date: Date) => {
  const startUtc = moment(date)
    .hour(date.getHours())
    .minute(date.getMinutes() || 0)
    .second(0)
    .utc()
    .toISOString();
  return startUtc;
};

export const formatToDateTimeLocal = (dateString: string) => {
  const date = new Date(dateString);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
