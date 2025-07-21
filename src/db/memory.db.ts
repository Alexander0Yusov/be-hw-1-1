import { AvailableResolutions, Video } from "../videos/types/video";

export const db = {
  videos: <Video[]>[
    {
      id: 1,
      title: "nature",
      author: "King",
      canBeDownloaded: true,
      minAgeRestriction: 5,
      createdAt: "2025-07-21T19:15:04.310Z",
      publicationDate: "2025-07-21T19:15:04.310Z",
      availableResolutions: [
        AvailableResolutions.P720,
        AvailableResolutions.P1080,
      ],
    },
    {
      id: 2,
      title: "politics",
      author: "Doe",
      canBeDownloaded: true,
      minAgeRestriction: 5,
      createdAt: "2025-07-21T19:15:04.310Z",
      publicationDate: "2025-07-21T19:15:04.310Z",
      availableResolutions: [
        AvailableResolutions.P720,
        AvailableResolutions.P1080,
      ],
    },
  ],
};
