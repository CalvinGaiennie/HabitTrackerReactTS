import { useState } from "react";
import type { UserCreate, User } from "../types/users";
import { createUser } from "../services/users";

function LoginPage() {
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
  const [createdUser, setCreatedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const user = await createUser(formData);
      setCreatedUser(user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email:</label>
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
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create User"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {createdUser && (
          <div>
            <p>User create!</p>
            <pre>{JSON.stringify(createdUser, null, 2)}</pre>
          </div>
        )}
      </form>
    </div>
  );
}
export default LoginPage;
