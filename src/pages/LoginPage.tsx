import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import type { UserLogin } from "../types/users";
import { loginUser } from "../services/users";
import { AuthContext } from "../context/AuthContext";

function LoginPage() {
  const [formData, setFormData] = useState<UserLogin>({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    try {
      const response = await loginUser(formData);
      login(
        response.user.id,
        response.user.username,
        response.user.settings ?? {},
        response.access_token
      );
      navigate("/"); // Redirect to home page after successful login
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button
          className="btn btn-primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-danger mt-3">{error}</p>}
      </form>

      <div className="mt-3">
        <p>
          Don't have an account? <a href="/CreateAccount">Create one here</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
