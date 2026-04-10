"use client";

import NavBar from "./Navbar";
import { useRole } from "@/hooks/useRole";
import { useUser } from "@clerk/nextjs";

export default function NavBarWrapper() {
  const role = useRole();
  const { isSignedIn, isLoaded } = useUser();

  type NavMode = "Admin" | "VolunteerNotLoggedIn" | "VolunteerLoggedIn";

  let mode: NavMode = "VolunteerNotLoggedIn";

  if (!isLoaded) return null;

  if (isSignedIn) {
    if (role === "admin") {
      mode = "Admin";
    } else {
      mode = "VolunteerLoggedIn";
    }
  }

  return <NavBar mode={mode} />;
}
