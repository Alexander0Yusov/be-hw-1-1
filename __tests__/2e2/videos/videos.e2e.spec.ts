import request from "supertest";
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { VideoInputDto } from "../../../src/videos/dto/video.input-dto";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { AvailableResolutions } from "../../../src/videos/types/video";

describe("Driver API", () => {
  const app = express();
  setupApp(app);

  const testVideoData: VideoInputDto = {
    title: "Happiness",
    author: "Valentin",
    availableResolutions: [AvailableResolutions.P2160],
  };

  beforeAll(async () => {
    await request(app).delete("/testing/all-data").expect(HttpStatus.NoContent);
  });

  it("should create video; POST /videos", async () => {
    const newVideo: VideoInputDto = {
      ...testVideoData,
      title: "Earth",
    };

    await request(app)
      .post("/videos")
      .send(newVideo)
      .expect(HttpStatus.Created);
  });

  it("should return videos list; GET /videos", async () => {
    await request(app)
      .post("/videos")
      .send({ ...testVideoData, title: "Dictionary" })
      .expect(HttpStatus.Created);

    await request(app)
      .post("/videos")
      .send({ ...testVideoData, title: "Funny stories" })
      .expect(HttpStatus.Created);

    const videoListResponse = await request(app)
      .get("/videos")
      .expect(HttpStatus.Ok);

    expect(videoListResponse.body).toBeInstanceOf(Array);
    expect(videoListResponse.body.length).toBeGreaterThanOrEqual(2);
  });

  it("should return video by id; GET /videos/:id", async () => {
    const createResponse = await request(app)
      .post("/videos")
      .send({ ...testVideoData, title: "About animals" })
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .get(`/videos/${createResponse.body.id}`)
      .expect(HttpStatus.Ok);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
      id: expect.any(Number),
      createdAt: expect.any(String),
    });
  });
});
