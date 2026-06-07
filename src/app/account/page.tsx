"use client";

import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import NavBarWrapper from "@/components/NavbarWrapper";
import RegistrationNotificationSettings from "@/components/RegistrationNotificationSettings";
import styles from "@/styles/Account.module.css";
import { useRole } from "@/hooks/useRole";
import { useWaiverStatus } from "@/hooks/useWaiverStatus";

type NotificationOption = "Text" | "Email" | "Both" | "None";

interface AccountFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string;
  email: string;
  password: string;
  shiftUpdates: NotificationOption;
  directMessages: NotificationOption;
}

export default function AccountPage() {
  const role = useRole();
  const isAdmin = role === "admin";
  const { signOut } = useClerk();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const { waiverCompleted, loading: waiverStatusLoading, refreshWaiverStatus } = useWaiverStatus(true);

  const hasSignedWaiver = waiverCompleted;

  const [formData, setFormData] = useState<AccountFormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "(XXX) XXX-XXXX",
    dob: "XX/XX/XXXX",
    email: "example@email.com",
    password: "",
    shiftUpdates: "Text",
    directMessages: "Both",
  });

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          dob: data.dob || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
        }));
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = formData.password || undefined;
    await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clerkId: user?.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dob: formData.dob,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        ...(password && { password }),
      }),
    });
    setIsEditing(false);
  };

  const handleCancel = () => setIsEditing(false);

  return (
    <div>
      <NavBarWrapper />

      {loading ? (
        <main className={styles.pageLoading} aria-live="polite">
          <LoaderCircle className={styles.loadingIcon} aria-hidden="true" />
          <span>Loading account...</span>
        </main>
      ) : (
        <main className={styles.page}>
          <div className={styles.inner}>
            <h1 className={styles.title}>My Account</h1>

            <form className={styles.form} onSubmit={handleSave}>
              <div className={styles.row}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>First Name</label>
                  {isEditing ? (
                    <input
                      className={styles.input}
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                    />
                  ) : (
                    <div className={styles.inputReadOnly}>{formData.firstName || "—"}</div>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Last Name</label>
                  {isEditing ? (
                    <input
                      className={styles.input}
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                    />
                  ) : (
                    <div className={styles.inputReadOnly}>{formData.lastName || "—"}</div>
                  )}
                </div>
              </div>

              <div className={styles.shortRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Phone Number</label>
                  {isEditing ? (
                    <input
                      className={styles.input}
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder={"(XXX) XXX-XXXX"}
                    />
                  ) : (
                    <div className={styles.inputReadOnly}>{formData.phoneNumber || "—"}</div>
                  )}
                </div>

                <div className={styles.compactFieldGroup}>
                  <label className={styles.label}>Date of Birth</label>
                  {isEditing ? (
                    <input
                      className={styles.input}
                      type="text"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className={styles.inputReadOnly}>{formData.dob || "—"}</div>
                  )}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Email Address</label>
                {isEditing ? (
                  <input
                    className={styles.input}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                ) : (
                  <div className={styles.inputReadOnly}>{formData.email || "—"}</div>
                )}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Password</label>
                {isEditing ? (
                  <input
                    className={styles.input}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                ) : (
                  <div className={styles.inputReadOnly}>••••••••</div>
                )}
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Waiver Status</label>
                <div className={styles.waiverStatusRow}>
                  <div className={styles.inputReadOnly}>
                    {hasSignedWaiver ? (
                      "Waiver completed"
                    ) : (
                      <>
                        Incomplete{" "}
                        <span className={styles.waiverText}>
                          (Fill out the waiver -{" "}
                          <Link href="https://form.jotform.com/70895957565174" className={styles.waiverLink}>
                            English
                          </Link>
                          {" | "}
                          <Link href="https://form.jotform.com/251204962817155" className={styles.waiverLink}>
                            Spanish
                          </Link>
                          )
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    className={styles.refreshWaiverButton}
                    onClick={refreshWaiverStatus}
                    disabled={waiverStatusLoading}
                  >
                    {waiverStatusLoading ? "Checking..." : "Reload"}
                  </button>
                </div>
              </div>

              {!isEditing ? (
                <div className={styles.actionsSingle}>
                  <button type="button" className={styles.editButton} onClick={() => setIsEditing(true)}>
                    Edit Information
                  </button>
                </div>
              ) : (
                <div className={styles.actionsDual}>
                  <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveButton}>
                    Save
                  </button>
                </div>
              )}
            </form>

            {isAdmin ? <RegistrationNotificationSettings /> : null}

            <section className={styles.deleteSection}>
              <h2 className={styles.deleteTitle}>Delete Account</h2>
              <p className={styles.deleteText}>
                Permanently delete your account and associated data. This action cannot be undone.
              </p>
              <div className={styles.deleteButtonWrap}>
                <Link href="/account/delete">
                  <button type="button" className={styles.deleteButton}>
                    Delete my account
                  </button>
                </Link>
              </div>
            </section>

            <div className={styles.logoutSection}>
              <button type="button" onClick={handleLogout} className={styles.logoutButton}>
                Log Out
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
