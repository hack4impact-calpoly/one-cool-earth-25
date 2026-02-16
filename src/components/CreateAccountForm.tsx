"use client";

import { useMemo, useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CreateAccountForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [error, setError] = useState("");

  const [step, setStep] = useState("create");

  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const step1Done = useMemo(() => email.trim().length > 0, [email]);
  const step2Done = useMemo(() => fullName.trim().length > 0 && dob.trim().length > 0, [fullName, dob]);

  const passwordsFilled = useMemo(() => password.length > 0 && confirmPassword.length > 0, [password, confirmPassword]);

  const step3Done = useMemo(() => {
    if (!passwordsFilled) return false;
    return password === confirmPassword && password.length >= 8;
  }, [password, confirmPassword, passwordsFilled]);

  const currentStep = useMemo(() => {
    if (!step1Done) return 1;
    if (!step2Done) return 2;
    return 3;
  }, [step1Done, step2Done]);

  const handleSubmit = async () => {
    if (!isLoaded) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName: fullName.split(" ")[0],
        lastName: fullName.split(" ")[1] || "",
      });

      // IMPORTANT: Ensure signup was created
      if (result.status === "complete") {
        // Rare case: email verification disabled
        await setActive({ session: result.createdSessionId });
        router.push("/");
        return;
      }

      // Prepare verification ONLY if signup is pending
      if (result.status === "missing_requirements") {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        router.push("/confirm-email");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.errors?.[0]?.message || "Something went wrong");
    }
  };
  return (
    <div className="w-full max-w-[820px] pt-14 pb-24">
      <h1 className="text-center text-4xl font-semibold text-black">Create Account</h1>

      <p className="mt-2 text-center text-sm text-gray-700">
        Already have an Account?{" "}
        <a href="#" className="text-black underline">
          Log in
        </a>
      </p>

      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-[720px]">
          <div className="flex items-center justify-center gap-6">
            <StepCircle label="Enter your email address" number={1} done={step1Done} active={currentStep === 1} />

            <StepLine active={step1Done} />

            <StepCircle label="Basic Information" number={2} done={step2Done} active={currentStep === 2} />

            <StepLine active={step2Done} />

            <StepCircle label="Create Password" number={3} done={step3Done} active={currentStep === 3} />
          </div>
        </div>
      </div>

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
              <PillInput placeholder="XX/XX/XXXX" value={dob} onChange={(e) => setDob(e.target.value)} />
            </Field>
          </div>

          <div className="mt-6">
            <Field label="Email Address">
              <PillInput placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
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

                {passwordsFilled && password !== confirmPassword ? (
                  <p className="mt-2 text-xs text-red-600">Passwords do not match.</p>
                ) : null}
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
              Create Account
            </button>
          </div>
        </div>
      </div>
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
  number: 1 | 2 | 3;
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
    <div
      className={`h-[4px] min-w-[110px] flex-1 rounded-full ${active ? "bg-[#1f7a5a]" : "bg-[#d3dbe3]"}`}
      aria-hidden
    />
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

function PillInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-12 w-full rounded-full border border-[#bcd1ea] bg-[#eaf3ff] px-5 text-sm text-[#1e2b3a] placeholder:text-[#6d8197] outline-none focus:border-[#4e78b7] focus:ring-2 focus:ring-[#4e78b7]/30"
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
