import express, { Express, Request, Response } from "express";
import { videosRouter } from "./videos/routers/videos.routers";
import { testingRouter } from "./testing/routers/testing.routers";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  app.get("/", (req, res) => {
    res.status(200).send("Hello world!");
  });

  app.use("/videos", videosRouter);
  app.use("/testing", testingRouter);

  return app;
};
