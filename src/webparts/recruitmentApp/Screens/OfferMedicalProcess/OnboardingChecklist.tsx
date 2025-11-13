import * as React from "react";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { Check, X } from "lucide-react"; // Make sure this is installed: npm i lucide-react
import "./Checklist.css";

export interface Preference {
  id: string;
  label: string;
  description?: string;
  value: boolean | null;
}

interface OnboardingChecklistProps {
  documents: Preference[];
  BtnEnable: React.Dispatch<React.SetStateAction<boolean>>;
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  documents,
  BtnEnable,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [loadingId, setLoadingId] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [preferences, setPreferences] = React.useState<Preference[]>(documents);

  const completedCount = preferences.filter((p) => p.value === true).length;
  const completionPercentage = Math.round(
    (completedCount / preferences.length) * 100
  );

  React.useEffect(() => {
    setIsLoading(false);
    console.log(successMessage);
    console.log(errorMessage);
    const BtnEnableValue = documents.length === completedCount;
    BtnEnable(BtnEnableValue);
  }, []);

  async function handleToggle(id: string, value: boolean) {
    setLoadingId(id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // await new Promise((res) => setTimeout(res, 300));

      setPreferences((prev) =>
        prev.map((p) => (p.id === id ? { ...p, value } : p))
      );

      setSuccessMessage("Preference saved!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error("Error saving preference:", err);
      setErrorMessage("Failed to save preference");
      setTimeout(() => setErrorMessage(""), 2000);
    } finally {
      setLoadingId(null);
    }
  }

  function renderCard(pref: Preference) {
    const isLoadingCard = loadingId === pref.id;

    return (
      <div
        key={pref.id}
        className={`card-container ${isHovered ? "hovered" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="card-header">
          <div className="card-info">
            <h3 className={`card-title ${isHovered ? "hovered" : ""}`}>
              {pref.label}
            </h3>
            {pref.description && (
              <p className={`card-description ${isHovered ? "hovered" : ""}`}>
                {pref.description}
              </p>
            )}
          </div>

          <div className="card-actions">
            <button
              onClick={() => handleToggle(pref.id, true)}
              disabled={isLoadingCard}
              className={`action-btn yes-btn ${
                pref.value === true ? "active" : ""
              } ${isLoadingCard ? "disabled" : ""} ${
                isHovered && pref.value !== true ? "hovered" : ""
              }`}
              aria-label="Yes"
            >
              <Check size={20} strokeWidth={2.5} />
            </button>

            <button
              onClick={() => handleToggle(pref.id, false)}
              disabled={isLoadingCard}
              className={`action-btn no-btn ${
                pref.value === false ? "active" : ""
              } ${isLoadingCard ? "disabled" : ""} ${
                isHovered && pref.value !== false ? "hovered" : ""
              }`}
              aria-label="No"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div
          className={`progress-bar ${pref.value === true ? "filled" : ""}`}
        />
      </div>
    );
  }

  return (
    <CustomLoader isLoading={isLoading}>
      <div className="page-container">
        <div className="content-wrapper">
          <div className="header">
            <h1>Onboarding Checklist</h1>
            <p>
              All supporting documentation to accompany RESI for approvals .
            </p>
          </div>

          <div className="progress-card">
            <div className="progress-header">
              <span>Progress</span>
              <span>
                {completedCount} of {preferences.length}
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar filled"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="preferences-list">
            {preferences.map((pref) => renderCard(pref))}
          </div>
        </div>
      </div>
    </CustomLoader>
  );
};
