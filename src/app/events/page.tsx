import VolunteerEventsPage from "@/components/VolunteerEventsPage";
import Navbar from "../../components/Navbar";

export default function CreateEventsPage() {
  return (
    <div>
      <Navbar mode={"VolunteerLoggedIn"} />
      <VolunteerEventsPage />
    </div>
  );
}
