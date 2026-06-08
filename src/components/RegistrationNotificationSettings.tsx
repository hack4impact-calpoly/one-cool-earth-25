"use client";

import { useEffect, useState } from "react";

export default function RegistrationNotificationSettings() {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loadingEmails, setLoadingEmails] = useState(true);
  const [savingEmails, setSavingEmails] = useState(false);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNotificationRecipients() {
      try {
        setLoadingEmails(true);
        const response = await fetch("/api/admin/registration-notification-recipients", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to load notification emails.");
        }

        setEmails(Array.isArray(data.emails) ? data.emails : []);
        setEmailError(null);
      } catch (error) {
        setEmailError(error instanceof Error ? error.message : "Failed to load notification emails.");
      } finally {
        setLoadingEmails(false);
      }
    }

    loadNotificationRecipients();
  }, []);

  function addEmail() {
    const normalizedEmail = newEmail.trim().toLowerCase();

    if (!normalizedEmail) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setEmailError("Enter a valid email address.");
      setEmailMessage(null);
      return;
    }

    setEmails((currentEmails) =>
      currentEmails.includes(normalizedEmail) ? currentEmails : [...currentEmails, normalizedEmail],
    );
    setNewEmail("");
    setEmailError(null);
    setEmailMessage(null);
  }

  function removeEmail(email: string) {
    setEmails((currentEmails) => currentEmails.filter((currentEmail) => currentEmail !== email));
    setEmailMessage(null);
  }

  async function saveEmails() {
    try {
      setSavingEmails(true);
      setEmailError(null);
      setEmailMessage(null);

      const response = await fetch("/api/admin/registration-notification-recipients", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emails }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to save notification emails.");
      }

      setEmails(Array.isArray(data.emails) ? data.emails : []);
      setEmailMessage("Notification emails saved.");
    } catch (error) {
      setEmailError(error instanceof Error ? error.message : "Failed to save notification emails.");
    } finally {
      setSavingEmails(false);
    }
  }

  return (
    <section className="mt-8 rounded-lg border border-[#c8d6bd] bg-[#f7f9f3] p-6">
      <h2 className="text-2xl font-bold text-[#4f6e22]">Registration Notification Emails</h2>
      <p className="mt-2 text-sm text-[#3f4b35]">
        These addresses receive an email whenever someone registers for an event.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={newEmail}
          onChange={(event) => setNewEmail(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addEmail();
            }
          }}
          placeholder="admin@example.com"
          className="min-h-11 flex-1 rounded-md border border-[#9eb68c] bg-white px-4 text-sm outline-none focus:border-[#4f6e22]"
        />
        <button
          type="button"
          onClick={addEmail}
          className="min-h-11 rounded-md border border-[#4f6e22] bg-[#d8e7c3] px-5 font-semibold text-[#344d15] transition hover:brightness-95 active:brightness-90"
        >
          Add Email
        </button>
      </div>

      <div className="mt-5 rounded-md border border-[#d8e1d0] bg-white">
        {loadingEmails ? (
          <p className="p-4 text-sm text-[#4f6e22]">Loading notification emails...</p>
        ) : emails.length === 0 ? (
          <p className="p-4 text-sm text-[#6d7467]">No notification emails added yet.</p>
        ) : (
          <ul className="divide-y divide-[#edf1e8]">
            {emails.map((email) => (
              <li key={email} className="flex items-center justify-between gap-4 p-4">
                <span className="min-w-0 break-all text-sm font-semibold text-[#1f2933]">{email}</span>
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  className="shrink-0 rounded-md border border-[#d9a7a7] bg-[#f8d7d7] px-3 py-1 text-sm font-semibold text-black transition hover:brightness-95 active:brightness-90"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {emailError ? <p className="mt-3 text-sm font-semibold text-[#b42318]">{emailError}</p> : null}
      {emailMessage ? <p className="mt-3 text-sm font-semibold text-[#4f6e22]">{emailMessage}</p> : null}

      <button
        type="button"
        onClick={saveEmails}
        disabled={loadingEmails || savingEmails}
        className="mt-5 rounded-full border border-[#7e9b6a] bg-[#d8e7c3] px-6 py-2 font-semibold text-[#344d15] transition hover:brightness-95 active:brightness-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {savingEmails ? "Saving..." : "Save Notification Emails"}
      </button>
    </section>
  );
}
