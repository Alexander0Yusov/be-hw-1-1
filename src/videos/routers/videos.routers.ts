import { Request, Response, Router } from "express";
import { db } from "../../db/memory.db";
import { Video } from "../types/video";
import { HttpStatus } from "../../core/types/http-statuses";
import { createErrorMessages } from "../../core/utils/error.utils";
import { videoUpdateDtoValidation } from "../validation/videoUpdateDtoValidation";
import { videoInputDtoValidation } from "../validation/videoInputDtoValidation";

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

    const now = new Date();
    const future_24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const newVideo: Video = {
      id: db.videos.length ? db.videos[db.videos.length - 1].id + 1 : 1,

      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: now.toISOString(),
      publicationDate: future_24h.toISOString(),

      ...req.body,
    };

    db.videos.push(newVideo);

    res.status(201).send(newVideo);
  })

  .put("/:id", (req: Request, res: Response) => {
    const errors = videoUpdateDtoValidation(req.body);

    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
      return;
    }

    const indexVideo = db.videos.findIndex(
      (item) => item.id === +req.params.id
    );

    if (indexVideo === -1) {
      res.sendStatus(HttpStatus.NotFound);
      return;
    }

    const videoForUpdate = db.videos[indexVideo];

    videoForUpdate.title = req.body.title;
    videoForUpdate.author = req.body.author;
    videoForUpdate.availableResolutions = req.body.availableResolutions;
    videoForUpdate.canBeDownloaded = req.body.canBeDownloaded;
    videoForUpdate.minAgeRestriction = req.body.minAgeRestriction;
    videoForUpdate.publicationDate = req.body.publicationDate;

    res.sendStatus(HttpStatus.NoContent);
  })
  .delete("/:id", (req: Request, res: Response) => {
    const index = db.videos.findIndex((v) => v.id === +req.params.id);

    if (index === -1) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: "id", message: "Video not found" }])
        );
      return;
    }

    db.videos.splice(index, 1);
    res.sendStatus(HttpStatus.NoContent);
  });
