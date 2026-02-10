"use client";

import { useMemo, useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = useMemo(() => email.trim().length > 0 && password.length > 0, [email, password]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Login attempt:", { email, password: "REDACTED" });
  }

  return (
    <div className="login">
      <h1 className="login-title">Login</h1>

      <p className="login-subtitle">
        Don&apos;t have an account?{" "}
        <a className="login-link" href="/create-account">
          Create Account
        </a>
      </p>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            className="form-input"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>

          <div className="password-row">
            <input
              id="password"
              className="form-input"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
            />

            <button type="button" className="password-toggle" onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button className="login-button" type="submit" disabled={!canSubmit}>
          Next
        </button>

        <div className="oauth-row">
          <button type="button" className="oauth-button" onClick={() => alert("OAuth later")}>
            Log in w/
          </button>
          <button type="button" className="oauth-button" onClick={() => alert("OAuth later")}>
            Log in w/
          </button>
        </div>
      </form>
    </div>
  );
}
