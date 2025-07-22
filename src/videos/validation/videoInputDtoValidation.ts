import { VideoInputDto } from "../dto/video.input-dto";
import { ValidationError } from "../types/validationError";
import { AvailableResolutions } from "../types/video";

export const videoInputDtoValidation = (
  data: VideoInputDto
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (
    !data.title ||
    typeof data.title !== "string" ||
    data.title.trim().length > 40
  ) {
    errors.push({ field: "title", message: "Invalid title" });
  }

  if (
    !data.author ||
    typeof data.author !== "string" ||
    data.author.trim().length > 20
  ) {
    errors.push({ field: "author", message: "Invalid author" });
  }

  if (
    !data.availableResolutions ||
    !Array.isArray(data.availableResolutions) ||
    data.availableResolutions.length < 1 ||
    !data.availableResolutions.every((item) =>
      Object.values(AvailableResolutions).includes(item as AvailableResolutions)
    )
  ) {
    errors.push({
      field: "availableResolutions",
      message: "Invalid availableResolutions",
    });
  }

  return errors;
};
