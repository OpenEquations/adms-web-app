import { useEffect, useState } from "react";
import { AlertCircle, Building2, CheckCircle2 } from "lucide-react";

import { organizationApi } from "../../lib/api/organization";
import { ApiError } from "../../lib/apiClient";

import "./OrganizationSettings.css";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  website: "",
  registrationNumber: "",
  address: "",
  description: "",
};

function OrganizationSettings() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState([]);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    organizationApi
      .get()
      .then((data) => {
        if (cancelled) return;
        setForm({
          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          website: data.website ?? "",
          registrationNumber: data.registrationNumber ?? "",
          address: data.address ?? "",
          description: data.description ?? "",
        });
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load organization settings.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors([]);
    setSaved(false);
    setSubmitting(true);

    try {
      await organizationApi.update(form);
      setSaved(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.details ?? []);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="org-settings-page">
        <div className="state-block">
          <span className="spinner" />
          Loading organization settings...
        </div>
      </div>
    );
  }

  return (
    <div className="org-settings-page">
      <div className="org-settings-header">
        <div className="org-settings-icon">
          <Building2 />
        </div>

        <div>
          <h1>Organization Settings</h1>
          <p>
            This information is used to brand documents you generate from the
            system, such as printable tender posters.
          </p>
        </div>
      </div>

      <div className="card org-settings-card">
        <div className="form-card-header">
          <h2>Organization profile</h2>
          <p>Tell ADMS about your organization.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div
              className="banner banner-error"
              role="alert"
            >
              <AlertCircle />
              <div>
                <span>{error}</span>
                {fieldErrors.length > 0 && (
                  <ul>
                    {fieldErrors.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {saved && (
            <div
              className="banner"
              role="status"
              style={{ borderColor: "rgb(4 120 87 / 25%)", background: "rgb(4 120 87 / 6%)", color: "#047857" }}
            >
              <CheckCircle2 />
              <span>Organization settings saved.</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="org-name">
              Organization name
            </label>

            <input
              id="org-name"
              type="text"
              className="input"
              placeholder="e.g. Ministry of Infrastructure"
              autoComplete="off"
              value={form.name}
              onChange={updateField("name")}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="org-email">
                Email
              </label>

              <input
                id="org-email"
                type="email"
                className="input"
                placeholder="contact@organization.org"
                autoComplete="off"
                value={form.email}
                onChange={updateField("email")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="org-phone">
                Phone
              </label>

              <input
                id="org-phone"
                type="text"
                className="input"
                placeholder="+250 700 000 000"
                autoComplete="off"
                value={form.phone}
                onChange={updateField("phone")}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="org-website">
                Website
              </label>

              <input
                id="org-website"
                type="text"
                className="input"
                placeholder="https://organization.org"
                autoComplete="off"
                value={form.website}
                onChange={updateField("website")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="org-registration">
                Registration number
              </label>

              <input
                id="org-registration"
                type="text"
                className="input"
                placeholder="e.g. TIN or registration ID"
                autoComplete="off"
                value={form.registrationNumber}
                onChange={updateField("registrationNumber")}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="org-address">
              Address
            </label>

            <textarea
              id="org-address"
              className="input textarea"
              placeholder="Physical or postal address"
              rows="2"
              value={form.address}
              onChange={updateField("address")}
            />
          </div>

          <div className="form-group">
            <label htmlFor="org-description">
              Description / tagline
            </label>

            <textarea
              id="org-description"
              className="input textarea"
              placeholder="A short description used on published documents"
              rows="3"
              value={form.description}
              onChange={updateField("description")}
            />

            <span className="form-help">
              Shown under your organization name on printable tender posters.
            </span>
          </div>

          <div className="form-actions">
            <span className="form-help">
              Name is required; everything else is optional.
            </span>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting && <span className="spinner" />}
              {submitting ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OrganizationSettings;
