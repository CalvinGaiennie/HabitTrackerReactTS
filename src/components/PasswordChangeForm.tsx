import { useState } from "react";
import { changePassword } from "../services/users";

function PasswordChangeForm() {
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        text: "New passwords do not match",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({
        text: "New password must be at least 8 characters",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await changePassword(passwordData.oldPassword, passwordData.newPassword);
      setMessage({
        text: "Password changed successfully!",
        type: "success",
      });
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage({
        text:
          error instanceof Error
            ? error.message
            : "Failed to change password. Please check your current password.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Change Password</h3>
      <form
        onSubmit={handleSubmit}
        className="mt-3"
        style={{ maxWidth: "400px" }}
      >
        <div className="mb-3">
          <label className="form-label">Current Password:</label>
          <input
            type="password"
            name="oldPassword"
            className="form-control"
            value={passwordData.oldPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">New Password:</label>
          <input
            type="password"
            name="newPassword"
            className="form-control"
            value={passwordData.newPassword}
            onChange={handleChange}
            required
            minLength={8}
          />
          <small className="form-text text-muted">
            Must be at least 8 characters
          </small>
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm New Password:</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-control"
            value={passwordData.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>

        {message && (
          <div
            className={`alert ${
              message.type === "success" ? "alert-success" : "alert-danger"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Changing Password..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}

export default PasswordChangeForm;
