import { useState } from "react";
import { requestPasswordReset } from "../services/users";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      await requestPasswordReset(email);
      setMessage({
        text: "If that email exists, a password reset link has been sent. Please check your email.",
        type: "success",
      });
      // Clear email field after successful submission
      setEmail("");
    } catch (error) {
      setMessage({
        text:
          error instanceof Error
            ? error.message
            : "Failed to send password reset email. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Forgot Password</h2>
      <p className="text-muted">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            className="form-control"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className="mt-3">
        <p>
          Remember your password? <a href="/Login">Back to Login</a>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
