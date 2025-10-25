import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import type { UserCreate } from "../types/users";
import { createUser } from "../services/users";
import { AuthContext } from "../context/AuthContext";

function CreateAccountPage() {
  const [formData, setFormData] = useState<UserCreate>({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    settings: {
      enabledPages: [],
      homePageLayout: [],
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    throw new Error("AuthContext not found");
  }

  const { login } = authContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    if (formData.password !== passwordConfirmation) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await createUser(formData);
      // Auto-login after successful registration
      login(
        response.user.id,
        response.user.username,
        response.user.settings,
        response.access_token
      );
      navigate("/"); // Redirect to home page after successful registration
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username:</label>
          <input
            className="form-control"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            className="form-control"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">First Name:</label>
          <input
            className="form-control"
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name:</label>
          <input
            className="form-control"
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            className="form-control"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm Password:</label>
          <input
            className="form-control"
            type="password"
            name="password_confirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Account"}
        </button>

        {error && <p className="text-danger mt-3">{error}</p>}
      </form>

      <div className="mt-3">
        <p>
          Already have an account? <a href="/Login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default CreateAccountPage;
