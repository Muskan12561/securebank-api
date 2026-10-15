
import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app";

describe("Health endpoint", () => {
  it("returns a healthy status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.service).toBe("SecureBank API");
    expect(response.body.data.status).toBe("healthy");
    expect(response.body.data.timestamp).toBeDefined();
  });

  it("does not expose the Express X-Powered-By header", async () => {
    const response = await request(app).get("/health");

    expect(response.headers["x-powered-by"]).toBeUndefined();
  });
  
  it("returns 404 for an unknown route", async () => {
    const response = await request(app).get("/api/this-route-does-not-exist");

    expect(response.status).toBe(404);
  });

});
