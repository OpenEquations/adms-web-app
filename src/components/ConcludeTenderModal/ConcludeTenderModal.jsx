import { useState } from "react";
import { AlertCircle } from "lucide-react";

import Modal from "../Modal/Modal";
import { tendersApi } from "../../lib/api/tenders";
import { ApiError } from "../../lib/apiClient";

import "./ConcludeTenderModal.css";

function ConcludeTenderModal({ tender, companies, onClose, onConcluded }) {
  const [companyId, setCompanyId] = useState(
    tender.tenderWinner ? String(tender.tenderWinner.id) : "",
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!companyId) {
      setError("Select the winning company to conclude this disposal request.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await tendersApi.conclude(tender.id, companyId);
      onConcluded();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to conclude disposal request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Conclude Disposal Request"
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

        <p className="conclude-tender-name">{tender.title}</p>

        <div className="conclude-tender-form-group">
          <label htmlFor="conclude-winner">Winning company</label>
          <select
            id="conclude-winner"
            className="input"
            value={companyId}
            onChange={(event) => setCompanyId(event.target.value)}
            autoFocus
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
            disabled={submitting || !companyId}
          >
            {submitting && <span className="spinner" />}
            {submitting ? "Concluding..." : "Conclude"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ConcludeTenderModal;
