"use client";

import { useState, useRef } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import styles from "@/styles/ForgotPassword.module.css";

export default function Page() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [error, setError] = useState("");

  if (!isLoaded) return <p>Loading...</p>;

  // Send the password reset code to the user's email
  async function create(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then((_) => {
        setSuccessfulCreation(true);
        setError("");
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  async function reset(e: React.FormEvent) {
    e.preventDefault();
    const strCode = code.join("");
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: strCode,
        password,
      })
      .then((result) => {
        if (result.status === "needs_second_factor") {
          // See https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
        } else if (result.status === "complete") {
          // Set the active session to
          // the newly created session (user is now signed in)
          setActive({
            session: result.createdSessionId,
            navigate: async ({ session }) => {
              if (session?.currentTask) {
                // Handle pending session tasks
                // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
                console.log(session?.currentTask);
                return;
              }

              router.push("/calendar");
            },
          });
          setError("");
        } else {
          console.log(result);
        }
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  const changeCode = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);

    setCode((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    // Move to next input after entering a digit
    if (digit && index < code.length - 1) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        setCode((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
      } else if (index > 0) {
        codeInputRefs.current[index - 1]?.focus();

        setCode((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
      }
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.header}>Forgot Password?</h1>
      <form onSubmit={!successfulCreation ? create : reset}>
        {!successfulCreation && (
          <>
            <div className={styles.emailContainer}>
              <input
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="e.g john@doe.com"
              ></input>
              <button className={styles.submit}>→</button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </>
        )}

        {successfulCreation && (
          <>
            <label htmlFor="code">Enter reset code that was sent to your email</label>
            <div className={styles.inputCode}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    codeInputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className={styles.input}
                  value={digit}
                  onChange={(e) => changeCode(index, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(index, e)}
                />
              ))}
            </div>
            <label htmlFor="password">Enter your new password</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className={styles.reset}>Reset</button>
            {error && <p>{error}</p>}
          </>
        )}
      </form>
    </div>
  );
}
