import { VideoUpdateDto } from "../dto/video.update-dto";
import { ValidationError } from "../types/validationError";
import { videoInputDtoValidation } from "./videoInputDtoValidation";

export const videoUpdateDtoValidation = (
  data: VideoUpdateDto
): ValidationError[] => {
  // за базу берется функция на частичную проверку
  const errors: ValidationError[] = videoInputDtoValidation(data);

  if (typeof data.canBeDownloaded !== "boolean") {
    errors.push({
      field: "canBeDownloaded",
      message: "Invalid canBeDownloaded",
    });
  }

  if (
    (data.minAgeRestriction !== null &&
      typeof data.minAgeRestriction !== "number") ||
    data.minAgeRestriction > 18 ||
    data.minAgeRestriction < 1
  ) {
    errors.push({
      field: "minAgeRestriction",
      message: "Invalid minAgeRestriction",
    });
  }

  if (typeof data.publicationDate !== "string" || data.publicationDate === "") {
    errors.push({
      field: "publicationDate",
      message: "Invalid publicationDate",
    });
  }

  return errors;
};
