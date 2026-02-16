"use client";

import { useSignUp } from "@clerk/nextjs";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import styles from "@/styles/ConfirmEmail.module.css";

export default function ConfirmAccountPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const router = useRouter();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const verify = async () => {
    if (!isLoaded) return;

    try {
      const strCode = code.join("");
      const result = await signUp.attemptEmailAddressVerification({
        code: strCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateAtIndex = (index: number, value: string) => {
    // Only allow one digit (remove regex if you want letters too)
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input if value entered
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
    <div className={styles.confirmDisplay}>
      <h1 className={styles.headerText}>Confirm Email</h1>
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

      <button onClick={verify} className={styles.verifyButton} disabled={code.some((c) => c == "")}>
        verify
      </button>
    </div>
  );
}
