export const timeline = [
  { time: "09:00", cpu: 42, memory: 58, requests: 420, latency: 96 },
  { time: "10:00", cpu: 47, memory: 61, requests: 510, latency: 104 },
  { time: "11:00", cpu: 55, memory: 65, requests: 690, latency: 118 },
  { time: "12:00", cpu: 63, memory: 69, requests: 760, latency: 132 },
  { time: "13:00", cpu: 59, memory: 67, requests: 720, latency: 121 },
  { time: "14:00", cpu: 51, memory: 64, requests: 640, latency: 109 }
];

export const deployments = [
  {
    id: "dep-1042",
    buildNumber: "#1042",
    service: "cloudshield-backend",
    branch: "main",
    commit: "8f4a91c",
    image: "ghcr.io/university/cloudshield-backend:1.0.42",
    environment: "staging",
    status: "Success",
    deployedAt: "2026-05-20T09:42:00Z"
  },
  {
    id: "dep-1041",
    buildNumber: "#1041",
    service: "cloudshield-frontend",
    branch: "main",
    commit: "2b8fd22",
    image: "ghcr.io/university/cloudshield-frontend:1.0.41",
    environment: "staging",
    status: "Success",
    deployedAt: "2026-05-20T08:36:00Z"
  },
  {
    id: "dep-1040",
    buildNumber: "#1040",
    service: "cloudshield-backend",
    branch: "feature/prometheus-labels",
    commit: "c9e10fb",
    image: "ghcr.io/university/cloudshield-backend:1.0.40",
    environment: "dev",
    status: "Failed",
    deployedAt: "2026-05-19T18:22:00Z"
  }
];

export const alerts = [
  {
    id: "alert-9001",
    title: "Backend latency above warning threshold",
    source: "Prometheus",
    severity: "Warning",
    description: "p95 latency crossed 250 ms for five minutes during the last deployment window.",
    lastObserved: "2 minutes ago"
  },
  {
    id: "alert-9002",
    title: "Container restart detected",
    source: "Kubernetes",
    severity: "Critical",
    description: "cloudshield-backend-7d6f9c restarted once after a temporary configuration reload.",
    lastObserved: "12 minutes ago"
  },
  {
    id: "alert-9003",
    title: "Disk pressure normalized",
    source: "Node Exporter",
    severity: "Healthy",
    description: "Available disk returned above 35% after old Docker layers were pruned.",
    lastObserved: "31 minutes ago"
  }
];

export const health = {
  status: "Healthy",
  uptime: "99.94%",
  services: [
    { name: "frontend", status: "Healthy", version: "1.0.0" },
    { name: "backend", status: "Healthy", version: "1.0.0" },
    { name: "prometheus", status: "Healthy", version: "2.54.1" },
    { name: "grafana", status: "Healthy", version: "11.2.0" }
  ],
  kubernetes: {
    cluster: "minikube",
    namespace: "cloudshield",
    pods: [
      { name: "frontend-7f6b", status: "Running", restarts: 0 },
      { name: "frontend-82aa", status: "Running", restarts: 0 },
      { name: "backend-55c9", status: "Running", restarts: 1 },
      { name: "backend-718e", status: "Running", restarts: 0 }
    ]
  }
};
