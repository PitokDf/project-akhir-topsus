import request from "supertest";
import { db } from "../src/config/prisma";
import app from "../src/app";

describe("Auth Routes", () => {
  // Bersihkan tabel sebelum & sesudah test
  beforeEach(async () => {
    await db.user.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  const testUser = {
    name: "Pitok",
    email: "pitok@example.com",
    password: "secure123"
  };

  let createdUserId: string;

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/v1/register")
      .send(testUser)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testUser.email);
    createdUserId = res.body.data.id;
  });

  it("should fail to register a user with duplicate email", async () => {
    await db.user.create({ data: testUser });

    const res = await request(app)
      .post("/api/v1/register")
      .send(testUser)
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/email sudah/i);
  });

  it("should login successfully with valid credentials", async () => {
    const res = await request(app)
      .post("/api/v1/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(testUser.email);
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app)
      .post("/api/v1/login")
      .send({
        email: testUser.email,
        password: "wrongpassword",
      })
      .expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Email or password is incorrect/i);
  });

  it("should fail login with missing email or password", async () => {
    const res = await request(app)
      .post("/api/v1/login")
      .send({
        email: testUser.email, // password missing
      })
      .expect(400);

    expect(res.body.success).toBe(false);
  });
});
