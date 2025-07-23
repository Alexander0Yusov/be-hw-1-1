import { VideoInputDto } from "./video.input-dto";

export type VideoUpdateDto = VideoInputDto & {
  //   title: string;
  //   author: string;
  //   availableResolutions: string[];
  canBeDownloaded: boolean;
  minAgeRestriction: number;
  publicationDate: string;
};
