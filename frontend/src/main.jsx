import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Cloud,
  Cpu,
  Gauge,
  GitBranch,
  HardDrive,
  LayoutDashboard,
  Rocket,
  Server,
  ShieldCheck,
  TimerReset
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import "./styles.css";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "monitoring", label: "Monitoring", icon: Activity },
  { id: "deployments", label: "Deployments", icon: Rocket },
  { id: "alerts", label: "Alerts", icon: AlertTriangle },
  { id: "health", label: "System Health", icon: ShieldCheck }
];

const statusColors = {
  Healthy: "text-shield-green",
  Running: "text-shield-green",
  Success: "text-shield-green",
  Warning: "text-shield-amber",
  Degraded: "text-shield-amber",
  Failed: "text-shield-red",
  Critical: "text-shield-red"
};

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Request failed: ${path}`);
  }
  return response.json();
}

function StatCard({ icon: Icon, label, value, detail, tone = "cyan" }) {
  const toneClass = {
    cyan: "text-shield-cyan bg-cyan-400/10",
    green: "text-shield-green bg-emerald-400/10",
    amber: "text-shield-amber bg-amber-400/10",
    red: "text-shield-red bg-rose-400/10"
  }[tone];

  return (
    <section className="rounded-lg border border-shield-line bg-shield-panel p-4 shadow-glow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        </div>
        <div className={`rounded-md p-2 ${toneClass}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-400">{detail}</p>
    </section>
  );
}

function Panel({ title, children, action }) {
  return (
    <section className="rounded-lg border border-shield-line bg-shield-panel p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function StatusPill({ status }) {
  const color = statusColors[status] || "text-slate-300";
  return (
    <span className={`rounded-full border border-current/30 px-2.5 py-1 text-xs font-medium ${color}`}>
      {status}
    </span>
  );
}

function DashboardView({ metrics, deployments, health }) {
  const latestDeploy = deployments[0];
  const activePods = health.kubernetes?.pods?.filter((pod) => pod.status === "Running").length || 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Cpu} label="CPU usage" value={`${metrics.cpu.current}%`} detail="Cluster average across app nodes" />
        <StatCard icon={HardDrive} label="RAM usage" value={`${metrics.memory.current}%`} detail={`${metrics.memory.usedGb} GB used of ${metrics.memory.totalGb} GB`} tone="green" />
        <StatCard icon={Boxes} label="Active containers" value={metrics.containers.active} detail={`${metrics.containers.restarting} restarting, ${metrics.containers.stopped} stopped`} tone="amber" />
        <StatCard icon={TimerReset} label="Platform uptime" value={health.uptime} detail="Backend service availability" tone="green" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <Panel title="Resource Utilization">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.timeline}>
                <defs>
                  <linearGradient id="cpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="memory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#263449" strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: "#0f1724", border: "1px solid #263449", color: "#fff" }} />
                <Area type="monotone" dataKey="cpu" stroke="#22d3ee" fill="url(#cpu)" />
                <Area type="monotone" dataKey="memory" stroke="#34d399" fill="url(#memory)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="CI/CD Summary">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-md bg-shield-panelSoft p-4">
              <div>
                <p className="text-sm text-slate-400">Latest build</p>
                <p className="mt-1 text-xl font-semibold text-white">{latestDeploy?.buildNumber}</p>
              </div>
              <StatusPill status={latestDeploy?.status || "Unknown"} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md bg-shield-panelSoft p-4">
                <p className="text-sm text-slate-400">Kubernetes pods</p>
                <p className="mt-1 text-2xl font-semibold text-white">{activePods}/{health.kubernetes?.pods?.length}</p>
              </div>
              <div className="rounded-md bg-shield-panelSoft p-4">
                <p className="text-sm text-slate-400">Deploy target</p>
                <p className="mt-1 text-2xl font-semibold text-white">{latestDeploy?.environment}</p>
              </div>
            </div>
            <div className="rounded-md border border-shield-line p-4">
              <p className="text-sm text-slate-400">Current image</p>
              <p className="mt-2 break-all text-sm text-slate-200">{latestDeploy?.image}</p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function MonitoringView({ metrics }) {
  const pieData = [
    { name: "Running", value: metrics.containers.active, color: "#34d399" },
    { name: "Restarting", value: metrics.containers.restarting, color: "#f59e0b" },
    { name: "Stopped", value: metrics.containers.stopped, color: "#fb7185" }
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
      <Panel title="Request Rate and Latency">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.timeline}>
              <CartesianGrid stroke="#263449" strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#0f1724", border: "1px solid #263449", color: "#fff" }} />
              <Line type="monotone" dataKey="requests" stroke="#22d3ee" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="latency" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Panel title="Container State">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={68} outerRadius={108} paddingAngle={4}>
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#0f1724", border: "1px solid #263449", color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}

function DeploymentsView({ deployments }) {
  return (
    <Panel title="Deployment History">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-shield-line text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="py-3 pr-4 font-medium">Build</th>
              <th className="py-3 pr-4 font-medium">Service</th>
              <th className="py-3 pr-4 font-medium">Branch</th>
              <th className="py-3 pr-4 font-medium">Commit</th>
              <th className="py-3 pr-4 font-medium">Environment</th>
              <th className="py-3 pr-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-shield-line text-slate-200">
            {deployments.map((deployment) => (
              <tr key={deployment.id}>
                <td className="py-3 pr-4 font-semibold">{deployment.buildNumber}</td>
                <td className="py-3 pr-4">{deployment.service}</td>
                <td className="py-3 pr-4">{deployment.branch}</td>
                <td className="py-3 pr-4 font-mono text-xs">{deployment.commit}</td>
                <td className="py-3 pr-4">{deployment.environment}</td>
                <td className="py-3 pr-4"><StatusPill status={deployment.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function AlertsView({ alerts }) {
  return (
    <div className="grid gap-4">
      {alerts.map((alert) => (
        <section key={alert.id} className="rounded-lg border border-shield-line bg-shield-panel p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">{alert.source}</p>
              <h2 className="mt-1 text-lg font-semibold text-white">{alert.title}</h2>
            </div>
            <StatusPill status={alert.severity} />
          </div>
          <p className="mt-3 text-sm text-slate-300">{alert.description}</p>
          <p className="mt-3 text-xs text-slate-500">Last observed: {alert.lastObserved}</p>
        </section>
      ))}
    </div>
  );
}

function HealthView({ health }) {
  const services = health.services || [];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Panel title="Service Health">
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.name} className="flex items-center justify-between rounded-md bg-shield-panelSoft p-4">
              <div className="flex items-center gap-3">
                <Server className="text-shield-cyan" size={18} />
                <div>
                  <p className="font-medium text-white">{service.name}</p>
                  <p className="text-sm text-slate-400">{service.version}</p>
                </div>
              </div>
              <StatusPill status={service.status} />
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Kubernetes Pods">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={health.kubernetes?.pods || []}>
              <CartesianGrid stroke="#263449" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#0f1724", border: "1px solid #263449", color: "#fff" }} />
              <Bar dataKey="restarts" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}

function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [data, setData] = useState({ metrics: null, deployments: [], alerts: [], health: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [health, metrics, deployments, alerts] = await Promise.all([
          fetchJson("/api/health"),
          fetchJson("/api/metrics"),
          fetchJson("/api/deployments"),
          fetchJson("/api/alerts")
        ]);
        if (mounted) {
          setData({ health, metrics, deployments, alerts });
          setError("");
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    const timer = setInterval(load, 15000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const content = useMemo(() => {
    if (loading) return <div className="rounded-lg border border-shield-line bg-shield-panel p-6 text-slate-300">Loading CloudShield telemetry...</div>;
    if (error) return <div className="rounded-lg border border-rose-400/30 bg-rose-400/10 p-6 text-rose-100">{error}</div>;
    if (activeView === "monitoring") return <MonitoringView metrics={data.metrics} />;
    if (activeView === "deployments") return <DeploymentsView deployments={data.deployments} />;
    if (activeView === "alerts") return <AlertsView alerts={data.alerts} />;
    if (activeView === "health") return <HealthView health={data.health} />;
    return <DashboardView metrics={data.metrics} deployments={data.deployments} health={data.health} />;
  }, [activeView, data, error, loading]);

  return (
    <div className="min-h-screen bg-shield-bg text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-shield-line bg-shield-panel/95 p-5 lg:block">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-shield-cyan/10 p-2 text-shield-cyan">
            <Cloud size={26} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">CloudShield</h1>
            <p className="text-xs text-slate-400">CI/CD Monitoring Platform</p>
          </div>
        </div>
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition ${
                  active ? "bg-shield-cyan/12 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="lg:pl-72">
        <header className="border-b border-shield-line bg-shield-bg/80 px-5 py-5 backdrop-blur md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-shield-cyan">DevOps control plane</p>
              <h2 className="mt-1 text-2xl font-semibold text-white md:text-3xl">
                {navItems.find((item) => item.id === activeView)?.label}
              </h2>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-shield-line bg-shield-panel px-4 py-3">
              <CheckCircle2 className="text-shield-green" size={19} />
              <span className="text-sm text-slate-300">Jenkins pipeline healthy</span>
            </div>
          </div>
          <nav className="mt-5 flex gap-2 overflow-x-auto lg:hidden">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm ${
                  activeView === item.id ? "bg-shield-cyan/12 text-white" : "bg-shield-panel text-slate-400"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </header>
        <div className="p-5 md:p-8">{content}</div>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
