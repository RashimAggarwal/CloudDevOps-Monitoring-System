# Grafana Dashboard Setup

1. Start the platform with `docker compose up -d --build`.
2. Open Grafana at `http://localhost:3001`.
3. Sign in with username `admin` and password `admin`.
4. Add a Prometheus data source:
   - URL: `http://prometheus:9090`
   - Access: Server
5. Create a dashboard with these panels:
   - `cloudshield_http_requests_total` as a time-series panel.
   - `cloudshield_cpu_usage_percent` as a gauge.
   - `cloudshield_active_deployments` as a stat panel.
   - `cloudshield_process_cpu_seconds_total` for backend process CPU.
   - `cloudshield_nodejs_heap_size_used_bytes` for Node.js memory.
6. Save the dashboard as `CloudShield DevOps Monitoring`.

Screenshot placeholders:

- `docs/screenshots/grafana-dashboard.png`
- `docs/screenshots/prometheus-targets.png`
