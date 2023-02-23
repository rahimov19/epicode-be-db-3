import supertest from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { server } from "../server";
import UsersModel from "../api/users/model";
import AccomodationsModel from "../api/accomodations/model";

dotenv.config();

const client = supertest(server);

const buenoUser = {
  email: "user@user.com",
  password: "1234",
};

const nobuenoUser = {
  email: "user@user.com",
};

const buenoUserNotInDb = {
  email: "user@gmail.com",
  password: "1234",
};

const realAcc = {
  name: "Everything Bueno",
  description: "Bueno",
  maxGuests: 5,
  city: "B-City",
  host: "123",
};

let goodId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL_TEST!);
  const user = new UsersModel(buenoUser);
  await user.save();
  realAcc.host = user._id;
  const accommodation = new AccomodationsModel(realAcc);
  await accommodation.save();
  goodId = accommodation._id;
});

afterAll(async () => {
  await UsersModel.deleteMany();
  await AccomodationsModel.deleteMany();
  await mongoose.connection.close();
});

let accessToken: string;

describe("Testing USER APIs", () => {
  it("Should test that POST /users with a not valid user returns a 400", async () => {
    await client.post("/users").send(nobuenoUser).expect(400);
  });

  it("Should test that POST/users/login with correct credentials will return a token", async () => {
    const response = await client.post("/users/login").send(buenoUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    accessToken = response.body.accessToken;
  });
  it("Should test that POST /users/register with existing user will return 400 (email already registered in db)", async () => {
    const response = await client.post("/users/register").send(buenoUser);
    expect(response.status).toBe(400);
  });

  it("Should test that POST /users/register with existing user credentials will return a token", async () => {
    const response = await client
      .post("/users/register")
      .send(buenoUserNotInDb);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("accessToken");
    accessToken = response.body.accessToken;
  });

  it("Should test that GET /users/me returns 401 if you don't provide a valid accessToken", async () => {
    await client.get("/users/me").expect(401);
  });

  it("Should test that GET /users/me with correct credentials and access token will return the valid user", async () => {
    const response = await client
      .get("/users/me")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    console.log(response.body);
  });
});

describe("Testing Accommodations APIs", () => {
  it("Should return all accommodations if you use valid credentials", async () => {
    const response = await client
      .get("/accomodations")
      .set("Authorization", `Bearer ${accessToken}`);
    // console.log(response);
    expect(response.status).toBe(200);
  });

  it("Should test that GET /accomodations returns 401 if you don't provide a valid accessToken", async () => {
    await client.get("/accomodations").expect(401);
  });

  it("Should test that GET /accomodations/:accomodationId with an existing id returns the accommodation that matched the id from params", async () => {
    const response = await client
      .get(`/accomodations/${goodId.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("Should test that GET /:accomodationId with a not valid id to return 404", async () => {
    await client
      .get("/accomodations/123456789123456789123456")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404);
  });
});
