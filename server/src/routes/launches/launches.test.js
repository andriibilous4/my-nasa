const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test Post /launch", () => {
    const completeLaunchData = {
      mission: "sfsa",
      rocket: "GSG 24",
      target: "Kepler-62 f",
      launchDate: "January 4, 2029",
    };
    const launchDataWithoutDate = {
      mission: "sfsa",
      rocket: "GSG 24",
      target: "Kepler-2424",
    };
    test("It should respond with 201 success", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send({
          mission: "sfsa",
          rocket: "GSG 24",
          target: "Kepler-2424",
          launchDate: "January 4, 2029",
        })
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("it should catch missing required properties", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictlyEqual({
        error: "Missing required launch property",
      });
    });

    test("it should catch invalid dates", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictlyEqual({
        error: "Missing required launch property",
      });
    });
  });
});
