"use client";

import { useSignUp } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/ConfirmEmail.module.css";
import { IoReloadOutline } from "react-icons/io5";

export default function ConfirmAccountPage({
  email,
  fullName,
  dob,
  phoneNumber,
}: {
  email: string;
  fullName: string;
  dob: string;
  phoneNumber: string;
}) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const router = useRouter();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  const verify = async () => {
    if (!isLoaded) return;
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: code.join(""),
      });

      if (result.status === "complete") {
        await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clerkId: result.createdUserId,
            email,
            firstName: fullName.split(" ")[0],
            lastName: fullName.split(" ").slice(1).join(" ") || "",
            phoneNumber,
            dob,
          }),
        });

        await setActive({ session: result.createdSessionId });
        router.push("/calendar");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid code");
    }
  };

  const resendCode = async () => {
    if (!isLoaded || cooldown > 0) return;

    try {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setCooldown(30); // 30 second cooldown
      setError("");
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to resend code");
    }
  };

  const updateAtIndex = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.confirmDisplay}>
        <div className={styles.spaceApart}>
          Please put in the pin sent to your email
          <button onClick={resendCode} className={styles.resendButton} disabled={cooldown > 0}>
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code?"} <IoReloadOutline />
          </button>
        </div>

        <div className={styles.inputContainer}>
          {code.map((value, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              value={value}
              maxLength={1}
              onChange={(e) => updateAtIndex(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>

        {error && <p className={styles.error}>{error}</p>}
        <button onClick={verify} className={styles.verifyButton} disabled={code.some((c) => c === "")}>
          verify and create account
        </button>
      </div>
    </div>
  );
}
