import { useState} from "react";
import type { UserCreate } from "../types/users";
import { createUser } from "../services/users";

function CreateAccountPage() {
    const [formData, setFormData] = useState<UserCreate>({
            username: "",
            password: "",
            email: "",
            first_name: "",
            last_name: "",
            settings: {
                enabledPages: [],
                homePageLayout: []
            },
        })
    
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [createdUser, setCreatedUser] = useState(null);
        const [error, setError] = useState<string | null>(null);
        const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
    
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const {name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setIsSubmitting(true);
            setError(null);
            if (formData.password !== passwordConfirmation) {
                setError("Passwords do not match.");
                setIsSubmitting(false);
                return
            }
            try {
                const user = await createUser(formData);
                setCreatedUser(user);
            } catch (err: any) {
                setError(err.message || "Something went wrong.")
            } finally {
                setIsSubmitting(false);
            }
        }
        return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>First Name:</label>
                    <input
                        type="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label className="form-label">Confirm Password:</label>
                    <input
                        type="password_confirmation"
                        name="password_confirmation"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
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
    )
    }
export default CreateAccountPage