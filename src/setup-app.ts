import express, { Express, Request, Response } from "express";
import { db } from "./db/memory.db";
import { Video } from "./videos/types/video";
import { HttpStatus } from "./core/types/http-statuses";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  // основной роут
  app.get("/", (req, res) => {
    res.status(200).send("Hello world!");
  });

  app.get("/videos", (req, res) => {
    // возвращаем всех водителей
    res.status(200).send(db.videos);
  });

  app.get(
    "/videos/:id",
    (req: Request<{ id: string }, {}, {}, {}>, res: Response<Video | null>) => {
      // ищем водителя в бд по id
      const video = db.videos.find((v) => v.id === +req.params.id);
      if (!video) {
        return res.sendStatus(404);
      }
      // возвращаем ответ
      res.status(200).send(video);
    }
  );

  app.post("/videos", (req: Request, res: Response) => {
    //1) проверяем приходящие данные на валидность
    //2) создаем newDriver
    const newVideo: Video = {
      id: db.videos.length ? db.videos[db.videos.length - 1].id + 1 : 1,

      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: new Date(),
      publicationDate: new Date(),

      ...req.body,
    };
    //3) добавляем newDriver в БД
    db.videos.push(newVideo);
    //4) возвращаем ответ
    res.status(201).send(newVideo);
  });

  app.get("/testing", (req: Request, res: Response) => {
    res.status(200).send("testing url");
  });

  app.delete("/testing/all-data", (req: Request, res: Response) => {
    db.videos = [];
    res.sendStatus(HttpStatus.NoContent);
  });

  return app;
};
