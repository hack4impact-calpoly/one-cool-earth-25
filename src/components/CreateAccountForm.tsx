"use client";

import { useMemo, useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ConfirmAccountPage from "./ConfirmAccountForm";
import { BeatLoader } from "react-spinners";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function hasNumberOrSymbol(password: string) {
  return /(\d|[^a-zA-Z0-9])/.test(password);
}

export default function CreateAccountForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState<"create" | "confirm">("create");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const step1Done = useMemo(() => {
    const e = email.trim();
    return e.length > 0 && isValidEmail(e);
  }, [email]);

  const step2Done = useMemo(() => {
    return fullName.trim().length > 0 && dob.trim().length > 0;
  }, [fullName, dob]);

  const passwordsFilled = useMemo(() => {
    return password.length > 0 && confirmPassword.length > 0;
  }, [password, confirmPassword]);

  const step3Done = useMemo(() => {
    if (!passwordsFilled) return false;
    return password === confirmPassword && password.length >= 8 && hasNumberOrSymbol(password);
  }, [password, confirmPassword, passwordsFilled]);

  const step4Done = step === "confirm";

  const currentStep = useMemo(() => {
    if (step4Done) return 4;
    if (!step2Done) return 1;
    if (!step1Done) return 2;
    if (!step3Done) return 3;
    return 4;
  }, [step1Done, step2Done, step3Done, step4Done]);

  const handleSubmit = async () => {
    if (!isLoaded) return;
    if (!step1Done || !step2Done || !step3Done) return;

    try {
      setLoading(true);
      setError("");

      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName: fullName.split(" ")[0],
        lastName: fullName.split(" ")[1] || "",
      });

      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: result.createdUserId,
          email,
          firstName: fullName.split(" ")[0],
          lastName: fullName.split(" ").slice(1).join(" ") || "",
          dob,
        }),
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
        return;
      }

      if (result.status === "missing_requirements") {
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setStep("confirm");
      }
    } catch (err: any) {
      const clerkError = err?.errors?.[0];

      if (clerkError?.code === "form_identifier_exists") {
        setError("An account with this email already exists. Please log in instead.");
      } else {
        setError(clerkError?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[820px] pt-14 pb-24">
      <h1 className="text-center text-4xl font-semibold text-black">Create Account</h1>

      <p className="mt-2 text-center text-sm text-gray-700">
        Already have an Account?{" "}
        <a href="/login" className="text-black underline">
          Log in
        </a>
      </p>

      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-[900px]">
          <div className="flex items-center justify-center gap-6">
            <StepCircle label="Basic Information" number={1} done={step2Done} active={currentStep === 1} />

            <StepLine active={step2Done} />

            <StepCircle label="Enter Email" number={2} done={step1Done} active={currentStep === 2} />

            <StepLine active={step1Done} />

            <StepCircle label="Create Password" number={3} done={step3Done} active={currentStep === 3} />
          </div>
        </div>
      </div>

      {step === "create" ? (
        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-[520px]">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Full Name">
                <PillInput
                  placeholder="First and last name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </Field>

              <Field label="Date of Birth">
                <PillInput type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
              </Field>
            </div>

            <div className="mt-6">
              <Field label="Email Address">
                <PillInput
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  onBlur={() => {
                    const eTrim = email.trim();
                    if (eTrim.length === 0) setEmailError("Email is required.");
                    else if (!isValidEmail(eTrim)) setEmailError("Please enter a valid email address.");
                    else setEmailError("");
                  }}
                />
              </Field>

              {emailError && <p className="mt-2 text-xs text-red-600">{emailError}</p>}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[1fr_190px]">
              <div>
                <Field label="Create Password">
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    visible={showPassword}
                    onToggle={() => setShowPassword((prev) => !prev)}
                  />
                </Field>

                <div className="mt-6">
                  <Field label="Confirm Password">
                    <PasswordInput
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      visible={showConfirmPassword}
                      onToggle={() => setShowConfirmPassword((prev) => !prev)}
                    />
                  </Field>

                  {passwordsFilled && password !== confirmPassword && (
                    <p className="mt-2 text-xs text-red-600">Passwords do not match.</p>
                  )}

                  {passwordsFilled &&
                    password === confirmPassword &&
                    password.length >= 8 &&
                    !hasNumberOrSymbol(password) && (
                      <p className="mt-2 text-xs text-red-600">Password must include at least 1 number or symbol.</p>
                    )}
                </div>
              </div>

              <div className="md:pt-7">
                <div className="rounded-md border-2 border-[#4e78b7] bg-white p-3 text-sm">
                  <p className="mb-1 font-semibold text-[#1e2b3a]">Password Requirements:</p>
                  <ul className="ml-5 list-disc text-[#1e2b3a]">
                    <li>Minimum 8 Characters</li>
                    <li>1 number or Symbol</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!step3Done}
                className="rounded-full border border-[#7db456] bg-[#b9e08c] px-10 py-3 font-semibold text-black shadow-[0_2px_0_rgba(0,0,0,0.10)] transition hover:brightness-95 active:brightness-90 disabled:opacity-50"
              >
                {loading ? <BeatLoader /> : "Confirm Details"}
              </button>
            </div>

            {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
          </div>
        </div>
      ) : (
        <ConfirmAccountPage email={email} fullName={fullName} dob={dob} />
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#1e2b3a]">{label}</span>
      {children}
    </label>
  );
}

function PillInput({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "h-12 w-full rounded-full border border-[#bcd1ea] bg-[#eaf3ff] px-5 text-sm text-[#1e2b3a] placeholder:text-[#6d8197] outline-none focus:border-[#4e78b7] focus:ring-2 focus:ring-[#4e78b7]/30 " +
        className
      }
    />
  );
}

function PasswordInput({
  value,
  onChange,
  visible,
  onToggle,
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <PillInput type={visible ? "text" : "password"} value={value} onChange={onChange} className="pr-16" />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#2b5876]"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}

function StepCircle({
  label,
  number,
  done,
  active,
}: {
  label: string;
  number: 1 | 2 | 3 | 4;
  done: boolean;
  active: boolean;
}) {
  const baseCircle = "h-8 w-8 rounded-full flex items-center justify-center font-semibold";
  const baseLabel = "mt-2 text-xs font-semibold text-center w-[150px]";

  const circleClass = done ? "bg-[#1f7a5a] text-white" : "bg-[#4e78b7] text-white";

  const labelClass = done ? "text-[#1f7a5a]" : active ? "text-[#4e78b7]" : "text-[#8aa0ba]";

  return (
    <div className="flex flex-col items-center">
      <div className={`${baseCircle} ${circleClass}`}>{done ? "✓" : number}</div>
      <div className={`${baseLabel} ${labelClass}`}>{label}</div>
    </div>
  );
}
function StepLine({ active }: { active: boolean }) {
  return (
    <div className={`h-[4px] min-w-[100px] rounded-full ${active ? "bg-[#1f7a5a]" : "bg-[#d3dbe3]"}`} aria-hidden />
  );
}
