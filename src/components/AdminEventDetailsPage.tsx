import Image from "next/image";
import styles from "@/styles/events.module.css";

// ✅ Update these imports to your actual component paths
import EventDetailsCard from "@/components/EventDetails";
import VolunteerList from "@/components/VolunteerList";
import NavBar from "@/components/Navbar";

export default function AdminEventDetailsPage() {
  // Later you can fetch event by params.id and pass data into the components.
  return (
    <div className={styles.page}>
      <NavBar mode="Admin" />
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Garden Workday</h1>

        <section className={styles.grid}>
          {/* Left card: Event Details */}
          <div className={styles.eventCard}>
            <EventDetailsCard />
          </div>
          {/* Right card: Volunteers */}
          <div className={styles.card}>
            <VolunteerList />
          </div>
        </section>
      </main>
    </div>
  );
}
