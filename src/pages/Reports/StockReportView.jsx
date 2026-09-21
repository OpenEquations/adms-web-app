import { useEffect, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  FileText,
  Printer,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { reportsApi } from "../../lib/api/reports";
import { ApiError } from "../../lib/apiClient";
import { ITEM_STATUS_LABELS, ITEM_TYPE_LABELS } from "../../lib/constants";

import "./StockReportView.css";

function formatDate(isoString) {
  return new Date(isoString).toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function labelFor(key, labels) {
  return labels[key] ?? (key === "UNSPECIFIED" ? "Unspecified" : key);
}

function StockReportView() {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    reportsApi
      .getById(id)
      .then((data) => {
        if (!cancelled) setReport(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load report.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="report-page">
        <div className="state-block no-print">
          <span className="spinner" />
          Loading report...
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="report-page">
        <div
          className="banner banner-error no-print"
          role="alert"
        >
          <AlertCircle />
          <span>{error || "Report not found."}</span>
        </div>
      </div>
    );
  }

  const maxStatusCount = Math.max(1, ...report.itemsByStatus.map((entry) => entry.count));
  const maxTypeCount = Math.max(1, ...report.itemsByType.map((entry) => entry.count));

  return (
    <div className="report-page">
      <div className="report-toolbar no-print">
        <Link
          to="/reports"
          className="btn btn-outline"
        >
          <ArrowLeft />
          Back
        </Link>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => window.print()}
        >
          <Printer />
          Print / Save as PDF
        </button>
      </div>

      <div className="report-sheet">
        <header className="report-header">
          <div className="report-header-icon">
            <FileText />
          </div>
          <div>
            <h1>Stock Report</h1>
            <p>
              Generated {formatDate(report.generatedAt)} by {report.generatedByName}
            </p>
          </div>
        </header>

        <div className="report-divider" />

        <div className="report-summary-grid">
          <div className="report-summary-stat">
            <span>Total Items</span>
            <strong>{report.totalItems}</strong>
          </div>
          <div className="report-summary-stat">
            <span>Warehouses</span>
            <strong>{report.totalWarehouses}</strong>
          </div>
          <div className="report-summary-stat">
            <span>Companies</span>
            <strong>{report.totalCompanies}</strong>
          </div>
          <div className="report-summary-stat">
            <span>Disposal Requests</span>
            <strong>{report.totalTenders}</strong>
          </div>
          <div className="report-summary-stat">
            <span>Unallocated Items</span>
            <strong>{report.unallocatedItems}</strong>
          </div>
        </div>

        <div className="report-section-grid">
          <section className="report-section">
            <h2>Items by Status</h2>

            {report.itemsByStatus.length === 0 ? (
              <p className="report-empty">No items.</p>
            ) : (
              <div className="report-breakdown">
                {report.itemsByStatus.map((entry) => (
                  <div
                    className="report-breakdown-row"
                    key={entry.key}
                  >
                    <div>
                      <span>{labelFor(entry.key, ITEM_STATUS_LABELS)}</span>
                      <span className="report-breakdown-count">{entry.count}</span>
                    </div>
                    <div className="report-breakdown-bar">
                      <div
                        className="report-breakdown-bar-fill"
                        style={{ width: `${(entry.count / maxStatusCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="report-section">
            <h2>Items by Type</h2>

            {report.itemsByType.length === 0 ? (
              <p className="report-empty">No items.</p>
            ) : (
              <div className="report-breakdown">
                {report.itemsByType.map((entry) => (
                  <div
                    className="report-breakdown-row"
                    key={entry.key}
                  >
                    <div>
                      <span>{labelFor(entry.key, ITEM_TYPE_LABELS)}</span>
                      <span className="report-breakdown-count">{entry.count}</span>
                    </div>
                    <div className="report-breakdown-bar">
                      <div
                        className="report-breakdown-bar-fill"
                        style={{ width: `${(entry.count / maxTypeCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="report-section">
          <h2>Items by Warehouse</h2>

          {report.itemsByWarehouse.length === 0 ? (
            <p className="report-empty">No warehouses.</p>
          ) : (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Warehouse</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {report.itemsByWarehouse.map((entry) => (
                  <tr key={entry.warehouseName}>
                    <td>{entry.warehouseName}</td>
                    <td>{entry.itemCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="report-section">
          <h2>
            <AlertTriangle />
            Items Needing Attention (Health 30% or below)
          </h2>

          {report.lowHealthItems.length === 0 ? (
            <p className="report-empty">No items below the health threshold. Everything looks good.</p>
          ) : (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Health</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {report.lowHealthItems.map((item) => (
                  <tr key={item.itemId}>
                    <td>{item.itemName}</td>
                    <td>{item.health}%</td>
                    <td>{labelFor(item.status, ITEM_STATUS_LABELS)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <div className="report-divider" />

        <footer className="report-footer">
          Report #{report.id} &middot; Generated {formatDate(report.generatedAt)} by {report.generatedByName}
        </footer>
      </div>
    </div>
  );
}

export default StockReportView;
