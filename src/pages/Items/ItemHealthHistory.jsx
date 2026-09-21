import { useEffect, useState } from "react";
import {
  ArrowLeft,
  AlertCircle,
  Minus,
  TrendingDown,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { itemsApi } from "../../lib/api/items";
import { ApiError } from "../../lib/apiClient";
import UpdateHealthModal from "../../components/UpdateHealthModal/UpdateHealthModal";

import "./ItemHealthHistory.css";

function formatDate(isoString) {
  return new Date(isoString).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAxisDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function ItemHealthHistory() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [healthModalOpen, setHealthModalOpen] = useState(false);

  const loadData = () =>
    Promise.all([itemsApi.getById(id), itemsApi.getHealthHistory(id)]).then(
      ([itemData, historyData]) => {
        setItem(itemData);
        setHistory(historyData);
      },
    );

  useEffect(() => {
    let cancelled = false;

    loadData()
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load health history.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="health-history-page">
        <div className="state-block">
          <span className="spinner" />
          Loading health history...
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="health-history-page">
        <div
          className="banner banner-error"
          role="alert"
        >
          <AlertCircle />
          <span>{error || "Item not found."}</span>
        </div>
      </div>
    );
  }

  const chartData = history.map((entry) => ({
    ...entry,
    label: formatAxisDate(entry.recordedAt),
  }));

  const first = history[0];
  const latest = history[history.length - 1];
  const netChange = history.length > 1 ? latest.health - first.health : 0;

  return (
    <div className="health-history-page">
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <Link to="/items">Items</Link>
            <span>/</span>
            <span>{item.itemName}</span>
            <span>/</span>
            <span>Health History</span>
          </div>

          <div className="page-title-row">
            <div className="page-title-icon">
              <Activity />
            </div>

            <div>
              <h1>{item.itemName}</h1>
              <p>Health trend over time.</p>
            </div>
          </div>
        </div>

        <div className="health-history-header-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setHealthModalOpen(true)}
          >
            <Activity />
            Update Health
          </button>

          <Link
            to="/items"
            className="btn btn-outline"
          >
            <ArrowLeft />
            Back to items
          </Link>
        </div>
      </div>

      <div className="health-history-stats">
        <div className="stat-card card">
          <div className="stat-card-header">
            <span>Current Health</span>
          </div>
          <div className="stat-value">{item.itemHealth}%</div>
        </div>

        <div className="stat-card card">
          <div className="stat-card-header">
            <span>Readings Recorded</span>
          </div>
          <div className="stat-value">{history.length}</div>
        </div>

        <div className="stat-card card">
          <div className="stat-card-header">
            <span>Change Since First Reading</span>
          </div>
          <div className={`stat-value health-change ${netChange < 0 ? "health-change-down" : netChange > 0 ? "health-change-up" : ""}`}>
            {netChange > 0 && <TrendingUp />}
            {netChange < 0 && <TrendingDown />}
            {netChange === 0 && <Minus />}
            {netChange > 0 ? `+${netChange}` : netChange}%
          </div>
        </div>
      </div>

      <div className="card health-history-chart-card">
        <div className="dashboard-card-header">
          <div>
            <h2>Health Trend</h2>
            <p>Every recorded health reading for this item, in order.</p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="state-block">No health readings recorded yet.</div>
        ) : (
          <div className="health-history-chart">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  width={35}
                />

                <Tooltip
                  formatter={(value) => [`${value}%`, "Health"]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload ? formatDate(payload[0].payload.recordedAt) : ""
                  }
                />

                <Line
                  type="monotone"
                  dataKey="health"
                  stroke="var(--foreground)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="card health-history-table-card">
        <div className="dashboard-card-header">
          <div>
            <h2>Readings</h2>
          </div>
        </div>

        <div className="health-history-table-wrapper">
          <table className="health-history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Health</th>
                <th>Change</th>
              </tr>
            </thead>

            <tbody>
              {[...history].reverse().map((entry, index) => {
                const reversedIndex = history.length - 1 - index;
                const previous = reversedIndex > 0 ? history[reversedIndex - 1] : null;
                const delta = previous ? entry.health - previous.health : null;

                return (
                  <tr key={entry.recordedAt}>
                    <td>{formatDate(entry.recordedAt)}</td>
                    <td>{entry.health}%</td>
                    <td>
                      {delta === null ? (
                        <span className="health-delta-initial">Initial reading</span>
                      ) : delta === 0 ? (
                        <span className="health-delta health-delta-flat">
                          <Minus />
                          No change
                        </span>
                      ) : delta > 0 ? (
                        <span className="health-delta health-delta-up">
                          <TrendingUp />
                          +{delta}%
                        </span>
                      ) : (
                        <span className="health-delta health-delta-down">
                          <TrendingDown />
                          {delta}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {healthModalOpen && (
        <UpdateHealthModal
          item={item}
          onClose={() => setHealthModalOpen(false)}
          onUpdated={() => {
            loadData().catch(() => {
              // Health was saved; a stale view just means a manual refresh
              // is needed, so this failure isn't worth surfacing as an error.
            });
          }}
        />
      )}
    </div>
  );
}

export default ItemHealthHistory;
