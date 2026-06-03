"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { StepCircle, StepLine } from "@/components/ui/Stepper";
import { useParams, useRouter } from "next/navigation";

type RegistrationMode = "loggedIn" | "guest";
type RegistrationStep = 1 | 2 | 3;
type AdditionalPartyMember = {
  id: number;
  name: string;
  email: string;
};
type PartyMemberErrors = Record<number, { name?: string; email?: string }>;

const DEMO_EVENT = {
  title: "Garden Workday Signup",
  location: "Baywood Elementary, Los Osos",
  dateTime: "May 5th, 3-5pm",
};

const ORGANIZATION_OPTIONS = ["N/A", "One Cool Earth", "Baywood PTA", "Cal Poly", "Community Volunteer Group"];

const emptyPartyMember = (id: number): AdditionalPartyMember => ({
  id,
  name: "",
  email: "",
});

function getDisplayName(fullName: string | null | undefined, fallbackEmail: string) {
  const value = fullName?.trim();
  return value && value.length > 0 ? value : fallbackEmail;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function EventRegistrationPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mode, setMode] = useState<RegistrationMode>("guest");
  const [step, setStep] = useState<RegistrationStep>(1);
  const [guestName, setGuestName] = useState("John Doe");
  const [guestEmail, setGuestEmail] = useState("jdoe@gmail.com");
  const [partyMembers, setPartyMembers] = useState<AdditionalPartyMember[]>([emptyPartyMember(1)]);
  const [organization, setOrganization] = useState("N/A");
  const [notes, setNotes] = useState("");
  const [guestError, setGuestError] = useState("");
  const [partyMemberErrors, setPartyMemberErrors] = useState<PartyMemberErrors>({});
  const [partyMembersError, setPartyMembersError] = useState("");
  const [didHydrateMode, setDidHydrateMode] = useState(false);
  const [showRegisteredMessage, setShowRegisteredMessage] = useState(false);
  const [waiverCompleted, setWaiverCompleted] = useState(false);
  const router = useRouter();

  const params = useParams();
  const id = params.eventId as string;

  useEffect(() => {
    if (!isLoaded || didHydrateMode) return;
    setMode(isSignedIn ? "loggedIn" : "guest");
    setDidHydrateMode(true);
  }, [didHydrateMode, isLoaded, isSignedIn]);

  useEffect(() => {
    async function fetchWaiverStatus() {
      if (!isLoaded || !user?.id) return;

      const response = await fetch("/api/user");
      const data = await response.json();

      setWaiverCompleted(Boolean(data.waiverCompleted));
    }

    fetchWaiverStatus();
  }, [isLoaded, user?.id]);

  const primaryName = useMemo(() => {
    if (mode === "loggedIn") {
      const email = user?.primaryEmailAddress?.emailAddress ?? "volunteer@example.com";
      return getDisplayName(user?.fullName, email);
    }

    return guestName.trim() || "John Doe";
  }, [guestName, mode, user?.fullName, user?.primaryEmailAddress?.emailAddress]);

  const primaryEmail = useMemo(() => {
    if (mode === "loggedIn") {
      return user?.primaryEmailAddress?.emailAddress ?? "volunteer@example.com";
    }

    return guestEmail.trim() || "jdoe@gmail.com";
  }, [guestEmail, mode, user?.primaryEmailAddress?.emailAddress]);

  const filledPartyMembers = useMemo(
    () => partyMembers.filter((member) => member.name.trim().length > 0 || member.email.trim().length > 0),
    [partyMembers],
  );

  const currentStep = isLoaded ? step : 1;
  const navbarMode = isLoaded && mode === "loggedIn" ? "VolunteerLoggedIn" : "VolunteerNotLoggedIn";

  const handleContinueFromDetails = () => {
    if (mode === "guest") {
      const name = guestName.trim();
      const email = guestEmail.trim();

      if (!name || !email) {
        setGuestError("Please enter both name and email to continue as a guest.");
        return;
      }

      if (!isValidEmail(email)) {
        setGuestError("Please enter a valid email address to continue as a guest.");
        return;
      }
    }

    setGuestError("");
    setPartyMembersError("");
    setShowRegisteredMessage(false);
    setStep(2);
  };

  const handleContinueToReview = () => {
    const nextErrors: PartyMemberErrors = {};
    let hasErrors = false;

    for (const member of partyMembers) {
      const name = member.name.trim();
      const email = member.email.trim();

      if (!name && !email) {
        continue;
      }

      if (!name) {
        nextErrors[member.id] = { ...nextErrors[member.id], name: "Enter a name for this attendee." };
        hasErrors = true;
      }

      if (!email) {
        nextErrors[member.id] = { ...nextErrors[member.id], email: "Enter an email for this attendee." };
        hasErrors = true;
      } else if (!isValidEmail(email)) {
        nextErrors[member.id] = { ...nextErrors[member.id], email: "Enter a valid email address." };
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setPartyMemberErrors(nextErrors);
      setPartyMembersError("Please fix the attendee details before continuing.");
      setShowRegisteredMessage(false);
      return;
    }

    setPartyMemberErrors({});
    setPartyMembersError("");
    setShowRegisteredMessage(false);
    setStep(3);
  };

  const handleAddPartyMember = () => {
    setPartyMembers((prev) => [...prev, emptyPartyMember(prev.length + 1)]);
  };

  const updatePartyMember = (id: number, field: "name" | "email", value: string) => {
    setPartyMembers((prev) => prev.map((member) => (member.id === id ? { ...member, [field]: value } : member)));
    setPartyMemberErrors((prev) => {
      if (!prev[id]?.[field]) {
        return prev;
      }

      const next = { ...prev };
      const memberErrors = { ...next[id] };
      delete memberErrors[field];

      if (!memberErrors.name && !memberErrors.email) {
        delete next[id];
      } else {
        next[id] = memberErrors;
      }

      return next;
    });
    setPartyMembersError("");
  };

  const switchToGuest = () => {
    setMode("guest");
    setStep(1);
    setGuestError("");
    setShowRegisteredMessage(false);
  };

  const handleRegistration = async () => {
    let tempPartyMembers = partyMembers
      .filter((pm) => pm.name && pm.email)
      .map((pm) => {
        return {
          name: pm.name,
          email: pm.email,
          waiverSigned: waiverCompleted,
          registrant: false,
          attending: true,
          attended: false,
        };
      });

    const registrant = {
      name: mode == "loggedIn" ? primaryName : guestName,
      email: mode == "loggedIn" ? primaryEmail : guestEmail,
      waiverSigned: waiverCompleted,
      registrant: true,
      attending: true,
      attended: false,
    };

    tempPartyMembers = [registrant, ...tempPartyMembers];

    const registrationBody = {
      eventId: id,
      partyMembers: tempPartyMembers,
      affiliatedOrganization: organization,
      additionalComments: notes,
    };

    const response = await fetch(`/api/events/registration`, {
      method: "POST",
      body: JSON.stringify(registrationBody),
    });

    router.push("/events");
  };

  return (
    <div className="min-h-screen bg-[#f7f7f2] font-lora text-[#161616]">
      <Navbar mode={navbarMode} />

      <main className="mx-auto max-w-5xl px-6 pb-20 pt-10">
        <header className="text-center">
          <h1 className="text-5xl font-bold">{DEMO_EVENT.title}</h1>
          <p className="mt-3 text-3xl font-semibold text-[#6d6666]">{DEMO_EVENT.location}</p>
          <p className="mt-2 text-2xl font-semibold text-[#9d9d9d]">{DEMO_EVENT.dateTime}</p>
        </header>

        <section className="mt-16 flex flex-wrap items-center justify-center gap-5">
          <StepCircle label="Your Details" number={1} done={currentStep > 1} active={currentStep === 1} />
          <StepLine active={currentStep > 1} />
          <StepCircle label="Additional Info" number={2} done={currentStep > 2} active={currentStep === 2} />
          <StepLine active={currentStep > 2} />
          <StepCircle label="Register" number={3} done={false} active={currentStep === 3} />
        </section>

        <section className="mx-auto mt-16 max-w-4xl">
          {step === 1 ? (
            mode === "loggedIn" ? (
              <LoggedInDetailsStep
                name={primaryName}
                email={primaryEmail}
                onContinue={handleContinueFromDetails}
                onContinueAsGuest={switchToGuest}
              />
            ) : (
              <GuestDetailsStep
                name={guestName}
                email={guestEmail}
                guestError={guestError}
                onNameChange={setGuestName}
                onEmailChange={setGuestEmail}
                onContinue={handleContinueFromDetails}
              />
            )
          ) : null}

          {step === 2 ? (
            <AdditionalInfoStep
              partyMembers={partyMembers}
              partyMemberErrors={partyMemberErrors}
              partyMembersError={partyMembersError}
              organization={organization}
              notes={notes}
              onBack={() => {
                setShowRegisteredMessage(false);
                setStep(1);
              }}
              onContinue={handleContinueToReview}
              onAddPartyMember={handleAddPartyMember}
              onPartyMemberChange={updatePartyMember}
              onOrganizationChange={setOrganization}
              onNotesChange={setNotes}
            />
          ) : null}

          {step === 3 ? (
            <ReviewStep
              name={primaryName}
              email={primaryEmail}
              partyMembers={filledPartyMembers}
              organization={organization}
              notes={notes}
              waiverCompleted={waiverCompleted}
              showRegisteredMessage={showRegisteredMessage}
              onBack={() => {
                setShowRegisteredMessage(false);
                setStep(2);
              }}
              onRegister={() => handleRegistration()}
            />
          ) : null}
        </section>
      </main>
    </div>
  );
}

function LoggedInDetailsStep({
  name,
  email,
  onContinue,
  onContinueAsGuest,
}: {
  name: string;
  email: string;
  onContinue: () => void;
  onContinueAsGuest: () => void;
}) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold">Confirm Your Details:</h2>
        <div className="mt-5 rounded-2xl border-2 border-[#7da3e0] bg-white px-10 py-8 text-2xl leading-10 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
          <p>
            <span className="font-bold">Name:</span> {name}
          </p>
          <p className="mt-2">
            <span className="font-bold">Email:</span> {email}
          </p>
        </div>
      </div>

      <p className="text-right text-xl font-semibold">
        Not you?{" "}
        <button type="button" onClick={onContinueAsGuest} className="underline underline-offset-2">
          Continue as guest
        </button>{" "}
        or{" "}
        <Link href="/create-account" className="underline underline-offset-2">
          create new account
        </Link>
      </p>

      <div className="flex justify-end">
        <FlowButton onClick={onContinue}>continue</FlowButton>
      </div>
    </div>
  );
}

function GuestDetailsStep({
  name,
  email,
  guestError,
  onNameChange,
  onEmailChange,
  onContinue,
}: {
  name: string;
  email: string;
  guestError: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-9">
      <div>
        <h2 className="text-3xl font-bold">Create an account?</h2>
        <div className="mt-4 rounded-2xl border-2 border-[#7da3e0] bg-white px-10 py-8 text-xl leading-10 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
          <p>
            Create an account to keep track of your volunteer hours, your past events, as well as keep track of the
            events you are currently signed up for.
          </p>
          <p className="mt-5">
            By continuing as a guest, you will still get reminder emails and can communicate with the organization
            through email.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Link href="/create-account" className="text-xl font-semibold underline underline-offset-2">
          Create new account
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FormField label="Name:">
          <FlowInput value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="John Doe" />
        </FormField>

        <FormField label="Email:">
          <FlowInput
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="jdoe@gmail.com"
            aria-invalid={guestError ? true : undefined}
          />
        </FormField>
      </div>

      {guestError ? <p className="text-base font-semibold text-red-600">{guestError}</p> : null}

      <div className="flex justify-end">
        <FlowButton onClick={onContinue}>continue as guest</FlowButton>
      </div>
    </div>
  );
}

function AdditionalInfoStep({
  partyMembers,
  partyMemberErrors,
  partyMembersError,
  organization,
  notes,
  onBack,
  onContinue,
  onAddPartyMember,
  onPartyMemberChange,
  onOrganizationChange,
  onNotesChange,
}: {
  partyMembers: AdditionalPartyMember[];
  partyMemberErrors: PartyMemberErrors;
  partyMembersError: string;
  organization: string;
  notes: string;
  onBack: () => void;
  onContinue: () => void;
  onAddPartyMember: () => void;
  onPartyMemberChange: (id: number, field: "name" | "email", value: string) => void;
  onOrganizationChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold">Additional Party Members</h2>
        <div className="mt-4 space-y-4">
          {partyMembers.map((member) => {
            const memberError = partyMemberErrors[member.id];
            const memberErrorMessage = [memberError?.name, memberError?.email].filter(Boolean).join(" ");

            return (
              <div key={member.id} className="space-y-2">
                <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                  <FormField label="">
                    <FlowInput
                      value={member.name}
                      onChange={(e) => onPartyMemberChange(member.id, "name", e.target.value)}
                      placeholder="Jane Doe"
                      aria-invalid={memberError?.name ? true : undefined}
                    />
                  </FormField>
                  <FormField label="">
                    <FlowInput
                      type="email"
                      value={member.email}
                      onChange={(e) => onPartyMemberChange(member.id, "email", e.target.value)}
                      placeholder="jdoe2@gmail.com"
                      aria-invalid={memberError?.email ? true : undefined}
                    />
                  </FormField>
                  <button
                    type="button"
                    onClick={onAddPartyMember}
                    className="h-12 w-12 rounded-md border border-[#7cb25a] bg-[#d6f0b8] text-3xl font-semibold text-[#38724e]"
                    aria-label="Add another party member"
                  >
                    +
                  </button>
                </div>
                {memberErrorMessage ? (
                  <p className="text-base font-semibold text-red-600">{memberErrorMessage}</p>
                ) : null}
              </div>
            );
          })}
        </div>
        {partyMembersError ? <p className="mt-4 text-base font-semibold text-red-600">{partyMembersError}</p> : null}
      </div>

      <FormField label="Affiliated Organization:">
        <select
          value={organization}
          onChange={(e) => onOrganizationChange(e.target.value)}
          className="h-14 w-full rounded-2xl border-2 border-[#7da3e0] bg-white px-5 text-2xl text-[#161616] outline-none focus:border-[#4e78b7]"
        >
          {ORGANIZATION_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Anything you'd like us to know?">
        <FlowInput value={notes} onChange={(e) => onNotesChange(e.target.value)} placeholder="..." />
      </FormField>

      <div className="flex items-center justify-between">
        <FlowButton variant="secondary" onClick={onBack}>
          back
        </FlowButton>
        <FlowButton onClick={onContinue}>continue</FlowButton>
      </div>
    </div>
  );
}

function ReviewStep({
  name,
  email,
  partyMembers,
  organization,
  notes,
  waiverCompleted,
  showRegisteredMessage,
  onBack,
  onRegister,
}: {
  name: string;
  email: string;
  partyMembers: AdditionalPartyMember[];
  organization: string;
  notes: string;
  waiverCompleted: boolean;
  showRegisteredMessage: boolean;
  onBack: () => void;
  onRegister: () => void;
}) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold">Confirm Registration Details:</h2>
        <div className="mt-4 rounded-2xl border-2 border-[#5a91dd] bg-white px-10 py-8 text-xl leading-10 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
          <p>
            <span className="font-bold">Name:</span> {name}
          </p>
          <p>
            <span className="font-bold">Email:</span> {email}
          </p>

          <p>
            <span className="font-bold">Waiver Signed:</span>{" "}
            {waiverCompleted ? (
              "Yes"
            ) : (
              <>
                No{" "}
                <span className="text-base" style={{ textDecoration: "none" }}>
                  ( Fill out waiver -{" "}
                  <Link href="https://form.jotform.com/70895957565174" className="underline">
                    English
                  </Link>
                  {" | "}
                  <Link href="https://form.jotform.com/251204962817155" className="underline">
                    Spanish
                  </Link>
                  )
                </span>
              </>
            )}
          </p>

          <div className="mt-4">
            <p className="font-bold">Additional Party Information:</p>
            {partyMembers.length > 0 ? (
              <div className="mt-2 grid gap-x-8 md:grid-cols-[1fr_auto]">
                {partyMembers.map((member) => (
                  <FragmentRow key={member.id} left={member.name || "Guest"} right={member.email || "No email added"} />
                ))}
              </div>
            ) : (
              <p className="mt-2">No additional party members added.</p>
            )}
          </div>

          <p className="mt-4">
            <span className="font-bold">Affiliated Organization:</span> {organization}
          </p>
          <p className="mt-2">
            <span className="font-bold">Additional Questions:</span> {notes.trim() || "N/A"}
          </p>
        </div>
      </div>

      {showRegisteredMessage ? (
        <div className="rounded-2xl border border-[#7cb25a] bg-[#eef9df] px-6 py-4 text-lg font-semibold text-[#356943]">
          Demo registration complete. This button is UI-only in the current branch and does not submit data yet.
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <FlowButton variant="secondary" onClick={onBack}>
          back
        </FlowButton>
        <FlowButton onClick={onRegister}>register</FlowButton>
      </div>
    </div>
  );
}

function FragmentRow({ left, right }: { left: string; right: string }) {
  return (
    <>
      <span>{left}</span>
      <span>{right}</span>
    </>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      {label ? <span className="mb-2 block text-xl font-bold">{label}</span> : null}
      {children}
    </label>
  );
}

function FlowInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-14 w-full rounded-2xl border-2 border-[#7da3e0] bg-[#f5f8fd] px-4 text-2xl text-[#161616] outline-none focus:border-[#4e78b7]"
    />
  );
}

function FlowButton({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
}) {
  const buttonClass =
    variant === "primary"
      ? "border-[#8fbb69] bg-[#d7f1b6] text-[#4f7c58]"
      : "border-[#8fbb69] bg-[#d7f1b6] text-[#4f7c58]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[6px] border px-6 py-2 text-2xl font-bold shadow-[0_1px_0_rgba(0,0,0,0.08)] transition hover:brightness-95 ${buttonClass}`}
    >
      {children}
    </button>
  );
}
