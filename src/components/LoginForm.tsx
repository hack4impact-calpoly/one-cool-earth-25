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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secondFactorCode, setSecondFactorCode] = useState("");
  const [needsSecondFactor, setNeedsSecondFactor] = useState(false);
  const [secondFactorHint, setSecondFactorHint] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    const e = email.trim();
    return e.length > 0 && isValidEmail(e) && password.length > 0;
  }, [email, password]);

  const { signIn, isLoaded } = useSignIn();
  const { setActive } = useClerk();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  function resetSecondFactorState() {
    setNeedsSecondFactor(false);
    setSecondFactorCode("");
    setSecondFactorHint(null);
  }

  async function completeSignInWithSecondFactor() {
    const code = secondFactorCode.trim();

    if (!code) {
      setError("Enter the verification code that was sent to your email.");
      return;
    }

    if (!signIn) {
      setError("Sign-in is still loading. Please try again.");
      return;
    }

    const result = await signIn.attemptSecondFactor({
      strategy: "email_code",
      code,
    });

    if (result.status === "complete" && result.createdSessionId) {
      await setActive({ session: result.createdSessionId });
      router.replace("/calendar");
      return;
    }

    setError("The verification code could not be confirmed. Please try again.");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!isLoaded || isSubmitting) return;

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
    setIsSubmitting(true);

    try {
      if (needsSecondFactor) {
        await completeSignInWithSecondFactor();
        return;
      }

      resetSecondFactorState();

      const result = await signIn.create({
        strategy: "password",
        identifier: eTrim,
        password,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace("/calendar");
        return;
      }

      if (result.status === "needs_second_factor") {
        const emailCodeFactor = result.supportedSecondFactors?.find((factor) => factor.strategy === "email_code");

        if (!emailCodeFactor || !("emailAddressId" in emailCodeFactor)) {
          setError("This account needs a second verification step that this page does not support yet.");
          return;
        }

        await signIn.prepareSecondFactor({
          strategy: "email_code",
          emailAddressId: emailCodeFactor.emailAddressId,
        });

        setNeedsSecondFactor(true);
        setSecondFactorHint(emailCodeFactor.safeIdentifier);
        setError(`Enter the verification code sent to ${emailCodeFactor.safeIdentifier}.`);
        return;
      }

      if (result.status === "needs_new_password") {
        setError("This account needs a new password before it can sign in.");
        return;
      }

      setError("Login could not be completed. Please check that the account has finished setup.");
    } catch (err: any) {
      console.error(err.errors);
      setError(err.errors?.[0]?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
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
              onChange={(e) => {
                setEmail(e.target.value);
                if (needsSecondFactor) resetSecondFactorState();
                if (error) setError(null);
              }}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (needsSecondFactor) resetSecondFactorState();
                  if (error) setError(null);
                }}
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

          {needsSecondFactor ? (
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="second-factor-code">
                Verification Code
              </label>

              <input
                id="second-factor-code"
                className={styles.formInput}
                placeholder={secondFactorHint ? `Code sent to ${secondFactorHint}` : "Enter verification code"}
                value={secondFactorCode}
                onChange={(e) => {
                  setSecondFactorCode(e.target.value);
                  if (error) setError(null);
                }}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            </div>
          ) : null}

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.loginButton} type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Logging in..." : needsSecondFactor ? "Verify code" : "Log in"}
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
