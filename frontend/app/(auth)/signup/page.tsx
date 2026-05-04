"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./signup.css";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<any>({});

  const validate = () => {
    const errors: any = {};

    if (!name.trim()) errors.name = "Name is required";

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!email.includes("@")) {
      errors.email = "Enter a valid email";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Minimum 6 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // backend error handling
        if (data?.detail) {
          setError(data.detail);
        } else {
          setError("Something went wrong");
        }
        return;
      }

      // ✅ success → go to signin
      router.push("/login");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>Create account</h1>

        {/* NAME */}
        <div className="field">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setFieldErrors((prev: any) => ({ ...prev, name: "" }));
            }}
          />
          {fieldErrors.name && (
            <span className="field-error">{fieldErrors.name}</span>
          )}
        </div>

        {/* EMAIL */}
        <div className="field">
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((prev: any) => ({ ...prev, email: "" }));
            }}
          />
          {fieldErrors.email && (
            <span className="field-error">{fieldErrors.email}</span>
          )}
        </div>

        {/* PASSWORD */}
        <div className="field">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((prev: any) => ({ ...prev, password: "" }));
            }}
          />
          {fieldErrors.password && (
            <span className="field-error">{fieldErrors.password}</span>
          )}
        </div>

        {/* GLOBAL ERROR */}
        {error && <div className="error">{error}</div>}

        <button onClick={handleSignup} disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="switch">
          Already have an account?{" "}
          <span onClick={() => router.push("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}