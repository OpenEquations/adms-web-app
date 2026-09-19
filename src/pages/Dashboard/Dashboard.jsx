import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ClipboardList,
  Package,
  Warehouse,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { itemsApi } from "../../lib/api/items";
import { warehousesApi } from "../../lib/api/warehouses";
import { tendersApi } from "../../lib/api/tenders";
import { ApiError } from "../../lib/apiClient";
import { ITEM_STATUSES, ITEM_STATUS_LABELS } from "../../lib/constants";

import "./Dashboard.css";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function buildMonthlySeries(items) {
  const counts = new Map();

  items.forEach((item) => {
    if (!item.dateBought) {
      return;
    }
    const [year, month] = item.dateBought.split("-");
    const key = `${year}-${month}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-9)
    .map(([key, count]) => {
      const [, month] = key.split("-");
      return { month: MONTH_LABELS[Number(month) - 1], items: count };
    });
}

function Dashboard() {
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        const [itemsData, warehousesData, tendersData] = await Promise.all([
          itemsApi.getAll(),
          warehousesApi.getAll(),
          tendersApi.getAll(),
        ]);

        setItems(itemsData);
        setWarehouses(warehousesData);
        setTenders(tendersData);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const lowHealthItems = useMemo(
    () => items.filter((item) => item.itemHealth <= 30),
    [items],
  );

  const openTenders = useMemo(
    () => tenders.filter((tender) => tender.status !== "OVER"),
    [tenders],
  );

  const statusBreakdown = useMemo(() => {
    return ITEM_STATUSES.map((status) => ({
      status,
      count: items.filter((item) => item.itemStatus === status).length,
    }));
  }, [items]);

  const monthlySeries = useMemo(() => buildMonthlySeries(items), [items]);

  const recentItems = useMemo(() => {
    return [...items]
      .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
      .slice(0, 5);
  }, [items]);

  const maxStatusCount = Math.max(1, ...statusBreakdown.map((entry) => entry.count));

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="state-block">
          <span className="spinner" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Page header */}
      <div className="dashboard-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your organization's assets.</p>
        </div>
      </div>

      {error && (
        <div
          className="banner banner-error"
          role="alert"
        >
          <AlertCircle />
          <span>{error}</span>
        </div>
      )}

      {/* Statistics */}
      <div className="dashboard-stats">
        <div className="stat-card card">
          <div className="stat-card-header">
            <span>Total Items</span>

            <div className="stat-icon">
              <Package />
            </div>
          </div>

          <div className="stat-value">{items.length}</div>

          <div className="stat-footer">
            <span>Across all warehouses</span>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-card-header">
            <span>Warehouses</span>

            <div className="stat-icon">
              <Warehouse />
            </div>
          </div>

          <div className="stat-value">{warehouses.length}</div>

          <div className="stat-footer">
            <span>Active storage locations</span>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-card-header">
            <span>Low Health Items</span>

            <div className="stat-icon">
              <AlertTriangle />
            </div>
          </div>

          <div className="stat-value">{lowHealthItems.length}</div>

          <div className="stat-footer">
            <span className="stat-warning">
              <AlertTriangle />
              Health score 30% or below
            </span>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-card-header">
            <span>Open Disposal Requests</span>

            <div className="stat-icon">
              <ClipboardList />
            </div>
          </div>

          <div className="stat-value">{openTenders.length}</div>

          <div className="stat-footer">
            <span>Not yet concluded</span>
          </div>
        </div>
      </div>

      {/* Main dashboard grid */}
      <div className="dashboard-grid">
        {/* Items chart */}
        <div className="dashboard-card card dashboard-chart-card">
          <div className="dashboard-card-header">
            <div>
              <h2>Items Added</h2>
              <p>
                Number of assets added over the past months.
              </p>
            </div>
          </div>

          <div className="dashboard-chart">
            {monthlySeries.length === 0 ? (
              <div className="state-block">
                No purchase dates recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySeries}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={30}
                    allowDecimals={false}
                  />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="items"
                    stroke="var(--foreground)"
                    fill="var(--secondary)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Asset overview */}
        <div className="dashboard-card card">
          <div className="dashboard-card-header">
            <div>
              <h2>Asset Overview</h2>
              <p>Current item distribution.</p>
            </div>
          </div>

          <div className="asset-overview">
            {statusBreakdown.map(({ status, count }) => (
              <div
                className="overview-row"
                key={status}
              >
                <div>
                  <span className="overview-label">
                    {ITEM_STATUS_LABELS[status]}
                  </span>

                  <span className="overview-value">
                    {count}
                  </span>
                </div>

                <div className="overview-bar">
                  <div
                    className="overview-bar-fill"
                    style={{ width: `${(count / maxStatusCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="dashboard-bottom-grid">
        <div className="dashboard-card card">
          <div className="dashboard-card-header">
            <div>
              <h2>Recently Added Items</h2>
              <p>The latest assets registered in the system.</p>
            </div>
          </div>

          {recentItems.length === 0 ? (
            <div className="state-block">
              No items yet.
            </div>
          ) : (
            <div className="activity-list">
              {recentItems.map((item) => (
                <div
                  className="activity-item"
                  key={item.id}
                >
                  <div className="activity-icon">
                    <Package />
                  </div>

                  <div>
                    <strong>{item.itemName}</strong>
                    <span>
                      {ITEM_STATUS_LABELS[item.itemStatus] ?? item.itemStatus}
                    </span>
                  </div>

                  <time>{item.dateBought ?? "—"}</time>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
