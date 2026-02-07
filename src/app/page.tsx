import Navbar from "@/components/Navbar";
import VolunteerList from "@/components/VolunteerList";

export default function Home() {
  return (
    <main style={{ height: "100vh", padding: 20 }}>
      <Navbar />
      <h1>Home</h1>
      <VolunteerList />
    </main>
  );
}
