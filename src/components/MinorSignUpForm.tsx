"use client";
import styles from "@/styles/MinorSignUpForm.module.css";
import { useState } from "react";

export default function MinorSignUpForm() {
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    email: "",
    guardianName: "",
    guardianDOB: "",
    phone: "",
    relationship: "Parent",
    password: "",
    confirmPassword: "",
  });

  const yourInfoDone = form.fullName.length != 0 && form.dob.length != 0 && form.email.length != 0;

  const guardianDone =
    form.guardianName.length != 0 &&
    form.guardianDOB.length != 0 &&
    form.phone.length != 0 &&
    form.relationship.length != 0;

  const passwordDone = form.password.length != 0 && form.confirmPassword.length != 0;

  return (
    <div className={styles.page}>
      {/* Form card */}
      <main className={styles.whiteBox}>
        {/* Title and login link */}
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>
          Already have an Account? <u>Log in</u>
        </p>

        {/* Progress steps */}
        <div className={styles.registerSteps}>
          <div className={styles.step}>
            <div className={yourInfoDone ? styles.stepCircle : styles.stepCircleOutline}>
              {yourInfoDone ? "✓" : "1"}
            </div>
            <div>Your Information</div>
          </div>
          <div className={yourInfoDone ? styles.stepLineGreen : styles.stepLineBlue} />
          <div className={styles.step}>
            <div className={guardianDone ? styles.stepCircle : styles.stepCircleOutline}>
              {guardianDone ? "✓" : "2"}
            </div>
            <div>Parent/Guardian</div>
            <div>Information</div>
          </div>
          <div className={guardianDone ? styles.stepLineGreen : styles.stepLineBlue} />
          <div className={styles.step}>
            <div className={passwordDone ? styles.stepCircle : styles.stepCircleOutline}>
              {passwordDone ? "✓" : "3"}
            </div>
            <div>Create Password</div>
          </div>
        </div>

        {/* Minor info */}
        <h2 className={styles.sectionTitle}>Your Information</h2>
        <div className={styles.formRow}>
          <label className={styles.field}>
            <span className={styles.label}>Full Name</span>
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className={styles.input}
              placeholder="First and last name"
            />
          </label>
          <label className={styles.fieldSmall}>
            <span className={styles.label}>Date of Birth</span>
            <input
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
              className={styles.input}
              placeholder="XX/XX/XXXX"
            />
          </label>
        </div>
        <div className={styles.formRow}>
          <label className={`${styles.field} ${styles.fieldWide}`}>
            <span className={styles.label}>Email Address</span>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={styles.input}
              placeholder="example@email.com"
            />
          </label>
        </div>

        {/* Notice for Users */}
        <div className={styles.notice}>
          <div className={styles.noticeIcon}>i</div>
          <div>
            <strong>Notice:</strong> All minors signing up must have a Parent/Guardian information to log in
          </div>
        </div>

        {/* Parent/Guardian Info */}
        <h2 className={styles.sectionTitle}>Parent/Guardian Information</h2>
        <div className={styles.formRow}>
          <label className={styles.field}>
            <span className={styles.label}>Parent/Guardian Full Name</span>
            <input
              value={form.guardianName}
              onChange={(e) => setForm({ ...form, guardianName: e.target.value })}
              className={styles.input}
              placeholder="First and last name"
            />
          </label>
          <label className={styles.fieldSmall}>
            <span className={styles.label}>Date of Birth</span>
            <input
              value={form.guardianDOB}
              onChange={(e) => setForm({ ...form, guardianDOB: e.target.value })}
              className={styles.input}
              placeholder="XX/XX/XXXX"
            />
          </label>
        </div>
        <div className={styles.formRow}>
          <label className={styles.fieldSmall}>
            <span className={styles.label}>Phone Number</span>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={styles.input}
              placeholder="(XXX) XXX-XXXX"
            />
          </label>
          <label className={styles.fieldSmall}>
            <span className={styles.label}>Relationship</span>
            <select
              value={form.relationship}
              onChange={(e) => setForm({ ...form, relationship: e.target.value })}
              className={styles.input}
            >
              <option>Parent</option>
              <option>Guardian</option>
              <option>Other</option>
            </select>
          </label>
        </div>

        {/* Passwords */}
        <h2 className={styles.sectionTitle}>Create Password</h2>
        <div className={styles.passwordRow}>
          <div className={styles.passwordColumn}>
            <label className={styles.field}>
              <span className={styles.label}>Create Password</span>
              <input
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={styles.input}
                type="password"
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Confirm Password</span>
              <input
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className={styles.input}
                type="password"
              />
            </label>
          </div>
          <div className={styles.requirements}>
            <strong>Password Requirements:</strong>
            <ul className={styles.requirementsList}>
              <li>Minimum 8 Characters</li>
              <li>1 number or Symbol</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
