import { Request, Response, Router } from "express";
import { db } from "../../db/memory.db";
import { HttpStatus } from "../../core/types/http-statuses";

export const testingRouter = Router({});

testingRouter
  .get("", (req: Request, res: Response) => {
    res.status(200).send("testing url");
  })
  .delete("/all-data", (req: Request, res: Response) => {
    db.videos = [];
    res.sendStatus(HttpStatus.NoContent);
  });
