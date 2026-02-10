"use client";

import { useMemo, useState } from "react";
import styles from "../styles/LoginForm.module.css";
import Image from "next/image";
import eyeClosed from "../icons/eyeClosed.svg";
import eyeShow from "../icons/eyeShow.svg";

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
    <div className={styles.loginCard}>
      <h1 className={styles.title}>Login</h1>

      <p className={styles.subtitle}>
        Don&apos;t have an account?{" "}
        <a className={styles.loginLink} href="/create-account">
          Create Account
        </a>
      </p>

      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="email">
            Email Address
          </label>

          <input
            id="email"
            className={styles.formInput}
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="password">
            Password
          </label>

          <div className={styles.passwordWrapper}>
            <input
              id="password"
              className={styles.formInput}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
            />

            <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? (
                <Image src={eyeClosed} alt="Hide" width={25} height={25} />
              ) : (
                <Image src={eyeShow} alt="Show" width={25} height={25} />
              )}
            </button>
          </div>
        </div>

        <button className={styles.loginButton} type="submit" disabled={!canSubmit}>
          Next
        </button>

        <div className={styles.oauthRow}>
          <button type="button" className={styles.oauthButton}>
            Log in w/
          </button>

          <button type="button" className={styles.oauthButton}>
            Log in w/
          </button>
        </div>
      </form>
    </div>
  );
}
