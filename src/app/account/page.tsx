"use client";

import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import NavBarWrapper from "@/components/NavbarWrapper";
import styles from "@/styles/Account.module.css";

type NotificationOption = "Text" | "Email" | "Both" | "None";

interface AccountFormData {
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  email: string;
  password: string;
  shiftUpdates: NotificationOption;
  directMessages: NotificationOption;
}

export default function AccountPage() {
  const { signOut } = useClerk();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useUser();

  const [formData, setFormData] = useState<AccountFormData>({
    firstName: "",
    lastName: "",
    phone: "(XXX) XXX-XXXX",
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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/user");
      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        dob: data.dob || "",
        email: data.email || "",
      }));
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
        ...(password && { password }),
      }),
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div>
      <NavBarWrapper />

      <main className={styles.page}>
        <div className={styles.inner}>
          <h1 className={styles.title}>My Account</h1>

          <form className={styles.form} onSubmit={handleSave}>
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>First Name</label>
                <input
                  className={styles.input}
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="First Name"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Last Name</label>
                <input
                  className={styles.input}
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div className={styles.shortRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Phone Number</label>
                <input
                  className={styles.input}
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className={styles.compactFieldGroup}>
                <label className={styles.label}>Date of Birth</label>
                <input
                  className={styles.input}
                  type="text"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                className={styles.input}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Create New Password</label>
              <input
                className={styles.input}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={!isEditing}
              />
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
          <button // NOTE TO FIX UI
            type="button"
            onClick={handleLogout}
            className={styles.deleteButton}
          >
            Log Out
          </button>
        </div>
      </main>
    </div>
  );
}
