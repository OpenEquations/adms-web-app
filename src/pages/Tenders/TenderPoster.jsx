import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  Printer,
  Settings,
  Globe,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { tendersApi } from "../../lib/api/tenders";
import { organizationApi } from "../../lib/api/organization";
import { ApiError } from "../../lib/apiClient";
import {
  ITEM_STATUS_LABELS,
  ITEM_TYPE_LABELS,
  TENDER_STATUS_LABELS,
  TENDER_TYPE_LABELS,
} from "../../lib/constants";

import "./TenderPoster.css";

function TenderPoster() {
  const { id } = useParams();

  const [tender, setTender] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([tendersApi.getById(id), organizationApi.get()])
      .then(([tenderData, organizationData]) => {
        if (cancelled) return;
        setTender(tenderData);
        setOrganization(organizationData);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load poster.");
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
      <div className="poster-page">
        <div className="state-block no-print">
          <span className="spinner" />
          Preparing poster...
        </div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="poster-page">
        <div
          className="banner banner-error no-print"
          role="alert"
        >
          <AlertCircle />
          <span>{error || "Disposal request not found."}</span>
        </div>
      </div>
    );
  }

  const hasOrgInfo = Boolean(organization?.name);
  const orgName = organization?.name || "Your Organization";
  const contactParts = [organization?.address, organization?.phone, organization?.email, organization?.website]
    .filter(Boolean);

  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="poster-page">
      {/* Toolbar - hidden when printing */}
      <div className="poster-toolbar no-print">
        <Link
          to={`/disposal-requests/${id}`}
          className="btn btn-outline"
        >
          <ArrowLeft />
          Back
        </Link>

        <div className="poster-toolbar-right">
          {!hasOrgInfo && (
            <Link
              to="/settings"
              className="poster-org-warning"
            >
              <AlertCircle />
              Add your organization details for this poster
            </Link>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.print()}
          >
            <Printer />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {error && (
        <div
          className="banner banner-error no-print"
          role="alert"
        >
          <AlertCircle />
          <span>{error}</span>
        </div>
      )}

      {/* Printable poster */}
      <div className="poster-sheet">
        <header className="poster-header">
          <div className="poster-org-name">{orgName}</div>

          {organization?.description && (
            <p className="poster-org-tagline">{organization.description}</p>
          )}

          {contactParts.length > 0 && (
            <div className="poster-org-contact">
              {organization?.address && (
                <span>
                  <MapPin />
                  {organization.address}
                </span>
              )}
              {organization?.phone && (
                <span>
                  <Phone />
                  {organization.phone}
                </span>
              )}
              {organization?.email && (
                <span>
                  <Mail />
                  {organization.email}
                </span>
              )}
              {organization?.website && (
                <span>
                  <Globe />
                  {organization.website}
                </span>
              )}
            </div>
          )}

          {organization?.registrationNumber && (
            <p className="poster-org-registration">
              Reg. No. {organization.registrationNumber}
            </p>
          )}
        </header>

        <div className="poster-divider" />

        <div className="poster-eyebrow">
          {TENDER_TYPE_LABELS[tender.type] ?? tender.type} &middot; Public Notice
        </div>

        <h1 className="poster-title">{tender.title}</h1>

        <div className="poster-badges">
          <span className="badge">
            {TENDER_STATUS_LABELS[tender.status] ?? tender.status}
          </span>
          {tender.tenderWinner && (
            <span className="badge">
              Awarded to {tender.tenderWinner.name}
            </span>
          )}
        </div>

        {tender.description && (
          <p className="poster-description">{tender.description}</p>
        )}

        <div className="poster-items-section">
          <h2>Items included in this notice</h2>

          {tender.items.length === 0 ? (
            <p className="poster-items-empty">Items to be announced.</p>
          ) : (
            <table className="poster-items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Condition</th>
                </tr>
              </thead>
              <tbody>
                {tender.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.itemName}</td>
                    <td>{ITEM_TYPE_LABELS[item.itemType] ?? "—"}</td>
                    <td>{ITEM_STATUS_LABELS[item.itemStatus] ?? item.itemStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="poster-divider" />

        <footer className="poster-footer">
          <div>
            {contactParts.length > 0 ? (
              <span>{orgName} &middot; {contactParts.join(" • ")}</span>
            ) : (
              <span>{orgName}</span>
            )}
          </div>
          <div>Notice generated on {today}</div>
        </footer>
      </div>

      {/* Discreet footnote pointing to where org info comes from - print only */}
      <p className="poster-print-hint no-print">
        <Settings />
        Organization details on this poster come from Settings &rarr; Organization Settings.
      </p>
    </div>
  );
}

export default TenderPoster;
