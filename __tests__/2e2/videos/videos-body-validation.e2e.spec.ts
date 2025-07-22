import request from "supertest";
import { setupApp } from "../../../src/setup-app";
import express from "express";

import { HttpStatus } from "../../../src/core/types/http-statuses";
import { VideoInputDto } from "../../../src/videos/dto/video.input-dto";
import { AvailableResolutions } from "../../../src/videos/types/video";

describe("Video API body validation check", () => {
  const app = express();
  setupApp(app);

  const correctTestDriverData: VideoInputDto = {
    title: "Schools",
    author: "Bruss Li",
    availableResolutions: [AvailableResolutions.P2160],
  };

  beforeAll(async () => {
    await request(app).delete("/testing/all-data").expect(HttpStatus.NoContent);
  });

  it(`should not create video when incorrect body passed; POST /videos'`, async () => {
    const invalidDataSet1 = await request(app)
      .post("/videos")
      .send({
        ...correctTestDriverData,
        title: 1, // not string
        author: 2, // not string
        availableResolutions: 123, // not []
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(3);

    const invalidDataSet2 = await request(app)
      .post("/videos")
      .send({
        ...correctTestDriverData,
        title: "a".repeat(50), // too long string
        author: "a".repeat(50), // too long string
        availableResolutions: [], // empty array
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(3);

    const invalidDataSet3 = await request(app)
      .post("/videos")
      .send({
        ...correctTestDriverData,
        availableResolutions: ["360", "480"], // not ["P360", "P480"]
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    // check что никто не создался
    const videoListResponse = await request(app).get("/videos");
    expect(videoListResponse.body).toHaveLength(0);
  });
});
