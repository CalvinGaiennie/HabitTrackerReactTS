import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/users";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    if (!token) {
      setTokenError(true);
      setMessage({
        text: "Invalid reset link. Please request a new password reset.",
        type: "error",
      });
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setMessage({
        text: "Invalid reset link. Please request a new password reset.",
        type: "error",
      });
      return;
    }

    setMessage(null);
    setIsSubmitting(true);

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        text: "Passwords do not match",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({
        text: "Password must be at least 8 characters long",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await resetPassword(token, passwordData.newPassword);
      setMessage({
        text: "Password reset successfully! Redirecting to login...",
        type: "success",
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/Login");
      }, 2000);
    } catch (error) {
      setMessage({
        text:
          error instanceof Error
            ? error.message
            : "Failed to reset password. The link may have expired. Please request a new one.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenError) {
    return (
      <div className="container mt-5">
        <h2>Reset Password</h2>
        <div className="alert alert-danger">
          Invalid reset link. Please request a new password reset.
        </div>
        <p>
          <a href="/ForgotPassword">Request Password Reset</a>
        </p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Reset Password</h2>
      <p className="text-muted">Enter your new password below.</p>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <div className="mb-3">
          <label className="form-label">New Password:</label>
          <input
            className="form-control"
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handleChange}
            required
            minLength={8}
            disabled={isSubmitting}
          />
          <small className="form-text text-muted">
            Must be at least 8 characters
          </small>
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm New Password:</label>
          <input
            className="form-control"
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
            disabled={isSubmitting}
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
          className="btn btn-primary"
          type="submit"
          disabled={isSubmitting || !token}
        >
          {isSubmitting ? "Resetting Password..." : "Reset Password"}
        </button>
      </form>

      <div className="mt-3">
        <p>
          <a href="/Login">Back to Login</a>
        </p>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
