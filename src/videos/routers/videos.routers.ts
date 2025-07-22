import { Request, Response, Router } from "express";
import { db } from "../../db/memory.db";
import { Video } from "../types/video";
import { videoInputDtoValidation } from "../validation/videoInputDtoValidation";
import { HttpStatus } from "../../core/types/http-statuses";
import { createErrorMessages } from "../../core/utils/error.utils";

export const videosRouter = Router({});

videosRouter
  .get("", (req, res) => {
    res.status(200).send(db.videos);
  })

  .get(
    "/:id",
    (req: Request<{ id: string }, {}, {}, {}>, res: Response<Video | null>) => {
      const video = db.videos.find((v) => v.id === +req.params.id);
      if (!video) {
        return res.sendStatus(404);
      }

      res.status(200).send(video);
    }
  )

  .post("", (req: Request, res: Response) => {
    const errors = videoInputDtoValidation(req.body);

    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
      return;
    }

    const newVideo: Video = {
      id: db.videos.length ? db.videos[db.videos.length - 1].id + 1 : 1,

      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: new Date(),
      publicationDate: new Date(),

      ...req.body,
    };

    db.videos.push(newVideo);

    res.status(201).send(newVideo);
  });
