import request from "supertest";
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { VideoInputDto } from "../../../src/videos/dto/video.input-dto";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { AvailableResolutions } from "../../../src/videos/types/video";
import { VideoUpdateDto } from "../../../src/videos/dto/video.update-dto";

describe("Driver API", () => {
  const app = express();
  setupApp(app);

  const testVideoData: VideoInputDto = {
    title: "Happiness",
    author: "Valentin",
    availableResolutions: [AvailableResolutions.P2160],
  };

  const testVideoUpdateData: VideoUpdateDto = {
    ...testVideoData,

    canBeDownloaded: true,
    minAgeRestriction: 18,
    publicationDate: "2025-07-23T00:17:56.222Z",
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

  it("should update video; PUT /videos/:id", async () => {
    //создаем
    const createResponse = await request(app)
      .post("/videos")
      .send({ ...testVideoUpdateData })
      .expect(HttpStatus.Created);

    //  console.log("111111111111", createResponse.body);

    //меняем
    await request(app)
      .put(`/videos/${createResponse.body.id}`)
      .send({
        title: "fan",
        author: "john",
        availableResolutions: [
          AvailableResolutions.P720,
          AvailableResolutions.P480,
        ],

        canBeDownloaded: false,
        minAgeRestriction: 10,
        publicationDate: "2024-07-23T00:17:56.222Z",
      })
      .expect(HttpStatus.NoContent);

    //извлекаем
    const getResponse = await request(app)
      .get(`/videos/${createResponse.body.id}`)
      .expect(HttpStatus.Ok);

    //смотрим что изменилось
    expect(getResponse.body).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(String),

      title: "fan",
      author: "john",
      availableResolutions: [
        AvailableResolutions.P720,
        AvailableResolutions.P480,
      ],

      canBeDownloaded: false,
      minAgeRestriction: 10,
      publicationDate: "2024-07-23T00:17:56.222Z",
    });
  });
});
