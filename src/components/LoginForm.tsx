"use client";

import { useMemo, useState } from "react";
import { useSignIn, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import styles from "../styles/LoginForm.module.css";
import Image from "next/image";
import eyeClosed from "../icons/eyeClosed.svg";
import eyeShow from "../icons/eyeShow.svg";
import AuthMobileHeader from "./AuthMobileHeader";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = useMemo(() => {
    const e = email.trim();
    return e.length > 0 && isValidEmail(e) && password.length > 0;
  }, [email, password]);

  const { signIn, isLoaded } = useSignIn();
  const { setActive } = useClerk();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!isLoaded) return;

    const eTrim = email.trim();

    if (eTrim.length === 0) {
      setEmailError("Email is required.");
      return;
    }

    if (!isValidEmail(eTrim)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");
    setError(null);

    try {
      const result = await signIn.create({
        identifier: eTrim,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/calendar");
      }
    } catch (err: any) {
      console.error(err.errors);
      setError(err.errors?.[0]?.message || "Login failed");
    }
  }

  return (
    <div className={styles.loginCard}>
      <AuthMobileHeader />

      <div className={styles.loginPanel}>
        <h1 className={styles.title}>Login</h1>

        <p className={styles.subtitle}>
          Don&apos;t have an Account?{" "}
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
              onBlur={() => {
                const eTrim = email.trim();
                if (eTrim.length === 0) setEmailError("Email is required.");
                else if (!isValidEmail(eTrim)) setEmailError("Please enter a valid email address.");
                else setEmailError("");
              }}
              aria-invalid={submitted && !!emailError}
            />

            {emailError && <p className={styles.fieldError}>{emailError}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="password">
              Password
            </label>

            <div className={styles.passwordWrapper}>
              <input
                id="password"
                className={styles.formInput}
                placeholder="********************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
              />

              <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? (
                  <Image src={eyeClosed} alt="Hide" width={20} height={20} />
                ) : (
                  <Image src={eyeShow} alt="Show" width={20} height={20} />
                )}
              </button>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.loginButton} type="submit" disabled={!canSubmit}>
            Log in
          </button>
        </form>

        <div className={styles.oauthRow}>
          <button type="button" className={styles.oauthButton}>
            Log in w/
          </button>
          <button type="button" className={styles.oauthButton}>
            Log in w/
          </button>
        </div>

        <button type="button" className={styles.forgotLink}>
          Forgot Password?
        </button>
      </div>
    </div>
  );
}
