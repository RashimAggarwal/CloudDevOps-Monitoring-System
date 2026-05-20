import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";

test("health endpoint returns platform status", async () => {
  const response = await request(app).get("/api/health").expect(200);
  assert.equal(response.body.status, "Healthy");
  assert.equal(response.body.kubernetes.cluster, "minikube");
});

test("prometheus endpoint exposes CloudShield metrics", async () => {
  const response = await request(app).get("/metrics").expect(200);
  assert.match(response.text, /cloudshield_/);
});
