import express from "express";
import cors from "cors";
import client from "prom-client";
import { alerts, deployments, health, timeline } from "./data.js";

const app = express();
const register = new client.Registry();

client.collectDefaultMetrics({
  register,
  prefix: "cloudshield_"
});

const httpRequests = new client.Counter({
  name: "cloudshield_http_requests_total",
  help: "Total HTTP requests served by the CloudShield API",
  labelNames: ["method", "route", "status_code"]
});

const deploymentGauge = new client.Gauge({
  name: "cloudshield_active_deployments",
  help: "Number of active application deployments"
});

const cpuGauge = new client.Gauge({
  name: "cloudshield_cpu_usage_percent",
  help: "Simulated cluster CPU utilization percentage"
});

register.registerMetric(httpRequests);
register.registerMetric(deploymentGauge);
register.registerMetric(cpuGauge);

app.use(cors());
app.use(express.json());

// Lightweight request accounting for Prometheus.
app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequests.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode
    });
  });
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({
    ...health,
    checkedAt: new Date().toISOString()
  });
});

app.get("/api/metrics", (_req, res) => {
  const latest = timeline[timeline.length - 1];
  cpuGauge.set(latest.cpu);
  deploymentGauge.set(deployments.filter((deployment) => deployment.status === "Success").length);

  res.json({
    cpu: { current: latest.cpu, threshold: 80 },
    memory: { current: latest.memory, usedGb: 10.2, totalGb: 16 },
    containers: { active: 12, restarting: 1, stopped: 2 },
    network: { ingressMbps: 83, egressMbps: 46 },
    timeline
  });
});

app.get("/api/deployments", (_req, res) => {
  res.json(deployments);
});

app.get("/api/alerts", (_req, res) => {
  res.json(alerts);
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

export default app;
