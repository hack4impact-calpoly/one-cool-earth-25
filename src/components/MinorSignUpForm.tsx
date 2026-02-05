import styles from "@/styles/MinorSignUpForm.module.css";

export default function MinorSignUpForm() {
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
            <div className={styles.stepCircle}>✓</div>
            <div>Your Information</div>
          </div>
          <div className={styles.stepLineGreen} />
          <div className={styles.step}>
            <div className={styles.stepCircleOutline}>2</div>
            <div className={styles.stepTextMuted}>Parent/Guardian</div>
            <div className={styles.stepTextMuted}>Information</div>
          </div>
          <div className={styles.stepLineBlue} />
          <div className={styles.step}>
            <div className={styles.stepCircleOutline}>3</div>
            <div className={styles.stepTextMuted}>Create Password</div>
          </div>
        </div>

        {/* Minor info */}
        <h2 className={styles.sectionTitle}>Your Information</h2>
        <div className={styles.formRow}>
          <label className={styles.field}>
            <span className={styles.label}>Full Name</span>
            <input className={styles.input} placeholder="First and last name" />
          </label>
          <label className={styles.fieldSmall}>
            <span className={styles.label}>Date of Birth</span>
            <input className={styles.input} placeholder="XX/XX/XXXX" />
          </label>
        </div>
        <div className={styles.formRow}>
          <label className={`${styles.field} ${styles.fieldWide}`}>
            <span className={styles.label}>Email Address</span>
            <input className={styles.input} placeholder="example@email.com" />
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
            <input className={styles.input} placeholder="First and last name" />
          </label>
          <label className={styles.fieldSmall}>
            <span className={styles.label}>Date of Birth</span>
            <input className={styles.input} placeholder="XX/XX/XXXX" />
          </label>
        </div>
        <div className={styles.formRow}>
          <label className={styles.fieldSmall}>
            <span className={styles.label}>Phone Number</span>
            <input className={styles.input} placeholder="(XXX) XXX-XXXX" />
          </label>
          <label className={styles.fieldSmall}>
            <span className={styles.label}>Relationship</span>
            <select className={styles.input} defaultValue="Parent">
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
              <input className={styles.input} type="password" />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Confirm Password</span>
              <input className={styles.input} type="password" />
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
