"use client";

import { useMemo, useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { CircleAlert } from "lucide-react";
import { BeatLoader } from "react-spinners";
import ConfirmAccountPage from "./ConfirmAccountForm";
import AuthMobileHeader from "./AuthMobileHeader";
import { StepCircle, StepLine } from "./ui/Stepper";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function hasNumberOrSymbol(password: string) {
  return /(\d|[^a-zA-Z0-9])/.test(password);
}

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function cleanPhoneNumber(value: string) {
  return value.replace(/\D/g, "");
}

export default function CreateAccountForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState<"create" | "confirm">("create");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

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
    return phoneNumber.replace(/\D/g, "").length === 10;
  }, [phoneNumber]);

  const step4Done = useMemo(() => {
    if (!passwordsFilled) return false;
    return password === confirmPassword && password.length >= 8 && hasNumberOrSymbol(password);
  }, [password, confirmPassword, passwordsFilled]);

  const step5Done = step === "confirm";

  const currentStep = useMemo(() => {
    if (step5Done) return 5;
    if (!step2Done) return 1;
    if (!step1Done) return 2;
    if (!step4Done) return 3;
    if (!step3Done) return 4;
    return 4;
  }, [step1Done, step2Done, step4Done, step5Done, step3Done]);

  const handleSubmit = async () => {
    if (!isLoaded) return;
    if (!step1Done || !step2Done || !step4Done) return;

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
          phoneNumber,
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
    <div className="w-full max-w-[820px] pb-24 md:pt-14">
      <AuthMobileHeader />

      <div className="mx-auto w-full max-w-[360px] px-5 md:max-w-none md:px-0">
        <h1 className="text-center text-[28px] font-semibold text-black md:text-4xl">Create Account</h1>

        <p className="mt-2 text-center text-[13px] text-gray-700 md:text-sm">
          Already have an Account?{" "}
          <a href="/login" className="text-black underline">
            Log in
          </a>
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-[900px] px-5 md:px-0">
          <div className="hidden items-center justify-center gap-6 md:flex">
            <StepCircle label="Basic Information" number={1} done={step2Done} active={currentStep === 1} />
            <StepLine active={step2Done} />
            <StepCircle label="Enter Email" number={2} done={step1Done && step3Done} active={currentStep === 2} />
            <StepLine active={step1Done && step3Done} />
            <StepCircle label="Create Password" number={3} done={step4Done} active={currentStep === 3} />
          </div>

          <div className="flex items-center justify-center gap-3 md:hidden">
            <MobileStep number={1} done={step2Done} />
            <MobileStepLine active={step2Done} />
            <MobileStep number={2} done={step1Done} />
            <MobileStepLine active={step1Done} />
            <MobileStep number={3} done={step4Done} />
          </div>
        </div>
      </div>

      {step === "create" ? (
        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-[520px] px-5 md:px-0">
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-[16px] font-semibold text-[#2c2c2c] md:hidden">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#707070] text-[10px]">
                  1
                </span>
                Your Information
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                <Field label="Full Name">
                  <PillInput
                    placeholder="First and last name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </Field>

                <Field label="Phone Number" className="md:order-3 md:col-span-2">
                  <PillInput
                    type="tel"
                    placeholder="(XXX) XXX-XXXX"
                    value={phoneNumber}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      setPhoneNumber(formatted);
                    }}
                    onBlur={() => {
                      if (phoneNumber.length === 0) setPhoneNumberError("Phone Number is required.");
                      else setPhoneNumberError("");
                    }}
                  />
                  {phoneNumberError && <p className="mt-2 text-xs text-red-600">{phoneNumberError}</p>}
                </Field>

                <Field label="Email Address" className="md:order-3 md:col-span-2">
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

                <Field label="Date of Birth" className="mx-auto w-[132px] md:mx-0 md:w-auto md:order-2">
                  <PillInput
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="px-3 text-center text-[13px] [color-scheme:light] md:text-left"
                  />
                </Field>
              </div>

              {emailError && <p className="mt-2 text-xs text-red-600">{emailError}</p>}
            </section>

            <div className="mt-6 rounded-[8px] border-2 border-[#86a9eb] bg-white px-3 py-2 text-[12px] font-semibold text-[#3e3e3e] md:hidden">
              <div className="flex items-start gap-2">
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#d96f4a]" strokeWidth={1.75} />
                <p>Notice: All minors signing up must have a Parent/Guardian information to log in</p>
              </div>
            </div>

            <section className="mt-7">
              <h2 className="mb-3 flex items-center gap-2 text-[16px] font-semibold text-[#2c2c2c] md:hidden">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#707070] text-[10px]">
                  3
                </span>
                Create Password
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_190px] md:gap-6">
                <div>
                  <Field label="Create Password">
                    <PasswordInput
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      visible={showPassword}
                      onToggle={() => setShowPassword((prev) => !prev)}
                    />
                  </Field>

                  <div className="mt-4 md:mt-6">
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

                <div className="order-first mx-auto w-[170px] md:order-none md:mx-0 md:w-auto md:pt-7">
                  <div className="rounded-[8px] border-2 border-[#4e78b7] bg-white p-3 text-center text-[12px] md:text-left md:text-sm">
                    <p className="mb-1 font-semibold text-[#1e2b3a]">Password Requirements:</p>
                    <ul className="ml-5 list-disc text-left text-[#1e2b3a]">
                      <li>Minimum 8 Characters</li>
                      <li>1 number or Symbol</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!step4Done}
                className="h-[38px] rounded-[10px] border-2 border-[#77a94f] bg-[#d5efc1] px-8 text-[14px] font-semibold text-[#4d7a30] shadow-[0_2px_0_rgba(0,0,0,0.10)] transition hover:brightness-95 active:brightness-90 disabled:opacity-50 md:h-auto md:rounded-full md:border md:border-[#7db456] md:bg-[#b9e08c] md:px-10 md:py-3 md:text-base md:text-black"
              >
                {loading ? <BeatLoader /> : "Create Account"}
              </button>
            </div>

            {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
          </div>
        </div>
      ) : (
        <ConfirmAccountPage email={email} fullName={fullName} dob={dob} phoneNumber={phoneNumber} />
      )}
    </div>
  );
}

function MobileStep({ number, done }: { number: number; done: boolean }) {
  return (
    <div
      className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[13px] font-semibold ${
        done ? "border-[#4f7cc7] bg-[#4f7cc7] text-white" : "border-[#4f7cc7] text-[#4f7cc7]"
      }`}
    >
      {done ? "✓" : number}
    </div>
  );
}

function MobileStepLine({ active }: { active: boolean }) {
  return <div className={`h-[2px] w-9 ${active ? "bg-[#4f7cc7]" : "bg-[#d9d9d9]"}`} />;
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[12px] font-semibold text-[#1e2b3a] md:text-sm">{label}</span>
      {children}
    </label>
  );
}

function PillInput({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "h-11 w-full rounded-[8px] border-2 border-[#86a9eb] bg-white px-4 text-sm text-[#1e2b3a] placeholder:text-[#9a9a9a] outline-none focus:border-[#4e78b7] focus:ring-2 focus:ring-[#4e78b7]/20 md:h-12 md:rounded-full md:border md:border-[#bcd1ea] md:bg-[#eaf3ff] md:px-5 md:placeholder:text-[#6d8197] md:focus:ring-[#4e78b7]/30 " +
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
      <PillInput type={visible ? "text" : "password"} value={value} onChange={onChange} className="pr-12 md:pr-16" />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#2b5876] md:right-4 md:text-sm"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
