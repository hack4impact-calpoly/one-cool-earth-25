import AdminEventsPage from "@/components/AdminEventsPage";
import Navbar from "../../components/Navbar";

export default function CreateAdminEventsPage() {
  return (
    <div>
      <Navbar mode={"Admin"} />
      <AdminEventsPage />
    </div>
  );
}
