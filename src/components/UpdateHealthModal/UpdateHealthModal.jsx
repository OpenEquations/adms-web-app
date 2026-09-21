import { useState } from "react";
import { AlertCircle } from "lucide-react";

import Modal from "../Modal/Modal";
import { itemsApi } from "../../lib/api/items";
import { ApiError } from "../../lib/apiClient";

import "./UpdateHealthModal.css";

function healthTone(health) {
  if (health <= 30) return "update-health-low";
  if (health <= 60) return "update-health-medium";
  return "update-health-good";
}

function UpdateHealthModal({ item, onClose, onUpdated }) {
  const [health, setHealth] = useState(item.itemHealth);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const numericHealth = Number(health);
      await itemsApi.changeHealth(item.id, numericHealth);
      onUpdated(numericHealth);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update health.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Update Health"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div
            className="banner banner-error"
            role="alert"
          >
            <AlertCircle />
            <span>{error}</span>
          </div>
        )}

        <p className="update-health-item-name">{item.itemName}</p>

        <div className="update-health-value-row">
          <input
            type="number"
            className="input update-health-number"
            min="0"
            max="100"
            value={health}
            onChange={(event) => setHealth(event.target.value)}
            autoFocus
          />
          <span>%</span>
        </div>

        <input
          type="range"
          className={`update-health-slider ${healthTone(health)}`}
          min="0"
          max="100"
          value={health}
          onChange={(event) => setHealth(event.target.value)}
        />

        <div className="update-health-bar">
          <div
            className={`update-health-bar-fill ${healthTone(health)}`}
            style={{ width: `${health}%` }}
          />
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting && <span className="spinner" />}
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default UpdateHealthModal;
