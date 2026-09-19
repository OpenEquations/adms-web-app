import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Package,
  Plus,
  Trash2,
  Trophy,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { tendersApi } from "../../lib/api/tenders";
import { itemsApi } from "../../lib/api/items";
import { companiesApi } from "../../lib/api/companies";
import { ApiError } from "../../lib/apiClient";
import {
  ITEM_STATUS_LABELS,
  TENDER_STATUSES,
  TENDER_STATUS_LABELS,
  TENDER_TYPE_LABELS,
  statusToClassName,
} from "../../lib/constants";

import "./TenderDetail.css";

function TenderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tender, setTender] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [titleDraft, setTitleDraft] = useState("");
  const [descriptionDraft, setDescriptionDraft] = useState("");
  const [savingDetails, setSavingDetails] = useState(false);

  const [selectedItemId, setSelectedItemId] = useState("");
  const [addingItem, setAddingItem] = useState(false);

  const [statusDraft, setStatusDraft] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);

  const [winnerId, setWinnerId] = useState("");
  const [savingWinner, setSavingWinner] = useState(false);
  const [concluding, setConcluding] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const [tenderData, itemsData, companiesData] = await Promise.all([
        tendersApi.getById(id),
        itemsApi.getAll(),
        companiesApi.getAll(),
      ]);

      setTender(tenderData);
      setAllItems(itemsData);
      setCompanies(companiesData);
      setTitleDraft(tenderData.title);
      setDescriptionDraft(tenderData.description ?? "");
      setStatusDraft(tenderData.status);
      setWinnerId(tenderData.tenderWinner ? String(tenderData.tenderWinner.id) : "");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load disposal request.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const availableItems = useMemo(() => {
    if (!tender) {
      return [];
    }
    const includedIds = new Set(tender.items.map((item) => item.id));
    return allItems.filter((item) => !includedIds.has(item.id));
  }, [allItems, tender]);

  const handleSaveDetails = async (event) => {
    event.preventDefault();
    setSavingDetails(true);
    setError("");

    try {
      await Promise.all([
        tendersApi.changeTitle(id, titleDraft),
        tendersApi.changeDescription(id, descriptionDraft),
      ]);
      setTender((current) => ({ ...current, title: titleDraft, description: descriptionDraft }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save changes.");
    } finally {
      setSavingDetails(false);
    }
  };

  const handleAddItem = async (event) => {
    event.preventDefault();
    if (!selectedItemId) {
      return;
    }

    setAddingItem(true);
    setError("");

    try {
      await tendersApi.addItem(id, selectedItemId);
      setSelectedItemId("");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to add item.");
    } finally {
      setAddingItem(false);
    }
  };

  const handleStatusSave = async (event) => {
    event.preventDefault();
    setSavingStatus(true);
    setError("");

    try {
      await tendersApi.changeStatus(id, statusDraft);
      setTender((current) => ({ ...current, status: statusDraft }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update status.");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSetWinner = async (event) => {
    event.preventDefault();
    if (!winnerId) {
      return;
    }

    setSavingWinner(true);
    setError("");

    try {
      await tendersApi.setWinner(id, winnerId);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to set winner.");
    } finally {
      setSavingWinner(false);
    }
  };

  const handleConclude = async () => {
    if (!winnerId) {
      window.alert("Select a winning company first.");
      return;
    }

    if (!window.confirm("Conclude this disposal request? This sets its status to Concluded.")) {
      return;
    }

    setConcluding(true);
    setError("");

    try {
      await tendersApi.conclude(id, winnerId);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to conclude disposal request.");
    } finally {
      setConcluding(false);
    }
  };

  const handleDelete = async () => {
    if (!tender) {
      return;
    }
    if (!window.confirm(`Delete "${tender.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await tendersApi.remove(id);
      navigate("/disposal-requests");
    } catch (err) {
      window.alert(err instanceof ApiError ? err.message : "Failed to delete disposal request.");
    }
  };

  if (loading) {
    return (
      <div className="tender-detail-page">
        <div className="state-block">
          <span className="spinner" />
          Loading disposal request...
        </div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="tender-detail-page">
        <div
          className="banner banner-error"
          role="alert"
        >
          <AlertCircle />
          <span>{error || "Disposal request not found."}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tender-detail-page">
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <Link to="/disposal-requests">Disposal Requests</Link>
            <span>/</span>
            <span>{tender.title}</span>
          </div>

          <div className="page-title-row">
            <div className="page-title-icon">
              <ClipboardList />
            </div>

            <div>
              <h1>{tender.title}</h1>
              <p>
                {TENDER_TYPE_LABELS[tender.type] ?? tender.type} ·{" "}
                <span className={`badge tender-status-${statusToClassName(tender.status)}`}>
                  {TENDER_STATUS_LABELS[tender.status] ?? tender.status}
                </span>
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/disposal-requests"
          className="btn btn-outline"
        >
          <ArrowLeft />
          Back
        </Link>
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

      <div className="tender-detail-layout">
        <div className="tender-detail-main">
          <div className="card">
            <div className="form-card-header">
              <h2>Details</h2>
            </div>

            <form onSubmit={handleSaveDetails}>
              <div className="form-group">
                <label htmlFor="tender-title">Title</label>
                <input
                  id="tender-title"
                  className="input"
                  value={titleDraft}
                  onChange={(event) => setTitleDraft(event.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="tender-description">Description</label>
                <textarea
                  id="tender-description"
                  className="input textarea"
                  rows="3"
                  value={descriptionDraft}
                  onChange={(event) => setDescriptionDraft(event.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-outline"
                disabled={savingDetails}
              >
                {savingDetails ? "Saving..." : "Save details"}
              </button>
            </form>
          </div>

          <div className="card">
            <div className="form-card-header">
              <h2>Items in this request</h2>
              <p>{tender.items.length} item(s) included.</p>
            </div>

            {tender.items.length === 0 ? (
              <div className="state-block">
                <Package />
                No items added yet.
              </div>
            ) : (
              <div className="tender-detail-items">
                {tender.items.map((item) => (
                  <div
                    key={item.id}
                    className="tender-detail-item"
                  >
                    <div className="item-icon">
                      <Package />
                    </div>

                    <div className="tender-detail-item-info">
                      <span className="item-title">{item.itemName}</span>
                      <span
                        className={`badge status-${statusToClassName(item.itemStatus)}`}
                      >
                        {ITEM_STATUS_LABELS[item.itemStatus] ?? item.itemStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form
              className="tender-detail-add-form"
              onSubmit={handleAddItem}
            >
              <select
                className="input"
                value={selectedItemId}
                onChange={(event) => setSelectedItemId(event.target.value)}
              >
                <option value="">
                  {availableItems.length === 0 ? "No more items to add" : "Select an item to add..."}
                </option>

                {availableItems.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.itemName}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="btn btn-outline"
                disabled={!selectedItemId || addingItem}
              >
                <Plus />
                {addingItem ? "Adding..." : "Add"}
              </button>
            </form>
          </div>
        </div>

        <div className="tender-detail-side">
          <div className="card">
            <div className="form-card-header">
              <h2>Status</h2>
            </div>

            <form onSubmit={handleStatusSave}>
              <div className="form-group">
                <select
                  className="input"
                  value={statusDraft}
                  onChange={(event) => setStatusDraft(event.target.value)}
                >
                  {TENDER_STATUSES.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {TENDER_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-outline"
                disabled={savingStatus || statusDraft === tender.status}
              >
                {savingStatus ? "Updating..." : "Update status"}
              </button>
            </form>
          </div>

          <div className="card">
            <div className="form-card-header">
              <h2>Winner</h2>
              <p>
                {tender.tenderWinner ? `Currently: ${tender.tenderWinner.name}` : "No winner selected yet."}
              </p>
            </div>

            <div className="form-group">
              <select
                className="input"
                value={winnerId}
                onChange={(event) => setWinnerId(event.target.value)}
              >
                <option value="">Select a company...</option>

                {companies.map((company) => (
                  <option
                    key={company.id}
                    value={company.id}
                  >
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="tender-detail-winner-actions">
              <button
                type="button"
                className="btn btn-outline"
                disabled={!winnerId || savingWinner}
                onClick={handleSetWinner}
              >
                <Trophy />
                {savingWinner ? "Saving..." : "Set winner"}
              </button>

              <button
                type="button"
                className="btn btn-primary"
                disabled={!winnerId || concluding}
                onClick={handleConclude}
              >
                <CheckCircle2 />
                {concluding ? "Concluding..." : "Conclude"}
              </button>
            </div>
          </div>

          <div className="card">
            <div className="form-card-header">
              <h2>Danger zone</h2>
            </div>

            <button
              type="button"
              className="btn btn-outline dropdown-item-destructive"
              onClick={handleDelete}
            >
              <Trash2 />
              Delete disposal request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TenderDetail;
